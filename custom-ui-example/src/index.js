import Resolver from '@forge/resolver';
import api from '@forge/api';
const resolver = new Resolver();

async function pushFileToGitHub(icePackRequestForm, baseUrl, buildName, token, icePackJsonName, sha, action, repository, moduleName) {
  // remove token before merging
  let url = `${baseUrl}${repository}/contents/${moduleName?moduleName+"/":""}${icePackJsonName}`
  let requestBody = Buffer.from(JSON.stringify(icePackRequestForm, null, '   ')).toString('base64') // encodes to base64
  let requestBodyString = `{"message":${action} from forge,"committer":{"name":"joe roberts","email":"jrobe432@ford.com"},"sha":${sha},"content":${requestBody}`

  const response = await api.fetch(url, {
      method: 'PUT',
      headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBodyString),
      redirect: 'follow'
  })
  return response
}

function setCustomFormState(response, icePackRequestForm, buildName, fileName, message) {
  return `${response.status} status from GitHub - ${message}: ${icePackRequestForm.repository}, branch: ${buildName}, file name: ${fileName}
          ${JSON.stringify(response)}`
}

function setFinalFormState(response, icePackRequestForm, buildName, fileName) {
  if ([200, 201].includes(response.status)) {
      setFailedState(false)
      return `${response.status} status from GitHub - Ice Pack Request JSON successfully created and pushed to GitHub
          repository: ${icePackRequestForm.repository}, branch: ${buildName}, file name: ${fileName}
          ${JSON.stringify(response)}`
  } else if (response.status === 404) {
      return `${response.status} status from GitHub - Repository/Branch not found - Unable to generate Ice Pack Request with the provided information
          repository: ${icePackRequestForm.repository}, branch: ${buildName}, file name: ${fileName}
          ${JSON.stringify(response)}`
  } else if (response.status === 422) {
      setFailedState(true)
      return `${response.status} status from GitHub - ${fileName} already exists - Unable to generate Ice Pack Request, please delete ${fileName} in your branch -->
          repository: ${icePackRequestForm.repository}, branch: ${buildName}, file name: ${fileName}
          ${JSON.stringify(response)}`
  } else {
      setFailedState(true)
      return `${response.status} status from GitHub - Other - Unable to generate Ice Pack Request with the provided information
          repository: ${icePackRequestForm.repository}, branch: ${buildName}, file name: ${fileName}
          ${JSON.stringify(response)}`
  }
}

async function getFromGithub(path, baseUrl, token) {
  let fullUrl = baseUrl + path
  const response = await api.fetch(fullUrl, {
      method: 'GET',
      headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
      }
  })
  return response
}

async function createBranchInGithub(repository, baseUrl, sha, buildName, token) {
  console.log("creating branch ...")
  let requestBody = {}
  requestBody["ref"] = `refs/heads/${buildName}`
  requestBody["sha"] = sha 
  let finalUrl = `${baseUrl}${repository}/git/refs`
  const response = await api.fetch(finalUrl, {
      method: 'POST',
      headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${token}`,
          'X-GitHub-Api-Version': 2022-11-28,
      },
      body: JSON.stringify(requestBody)
  })
  return response
}

async function handleRepo(icePackRequestForm, baseUrl, branchName, icePackJsonName, token, repository, moduleName) {
  try {
      let getBranchResponse;
      let pushFileResponse;
      let createBranchResponse;
      let status = 0;

      while (status !== 200 && status !== 404) {
          getBranchResponse = await getFromGithub(`${repository}/branches/${branchName}`, baseUrl, token);
          status = getBranchResponse.status;

          if (status === 404) {
              const mainBranchResponse = await getFromGithub(`${repository}/branches/main`, baseUrl, token);
              const mainBranchData = await mainBranchResponse.json();
              const mainBranchSha = mainBranchData.commit.sha;

              if (mainBranchResponse.status === 404) {
                return setCustomFormState(mainBranchData, repository, branchName, icePackJsonName, " does not exist")
              }

              createBranchResponse = await createBranchInGithub(repository, baseUrl, mainBranchSha, branchName, token);

              if (createBranchResponse.status === 201) {
                  pushFileResponse = await pushFileToGitHub(icePackRequestForm, baseUrl, branchName, token, icePackJsonName, "", "created", repository, moduleName);
                  setFormState(setFinalFormState(pushFileResponse, repository, branchName, icePackJsonName));
                  setFragments([]);
                  setDepFragments([]);
              }
              return setFinalFormState(createBranchResponse, repository, branchName, icePackJsonName)
          } else if (status === 200 || status === 201) {
              const checkFileResponse = await getFromGithub(`${repository}/contents/${icePackJsonName}?ref=${branchName}`, baseUrl, token);
              const data = await checkFileResponse.json();
              const sha = data.sha || "";
              const action = sha ? "updated" : "created";

              pushFileResponse = await pushFileToGitHub(icePackRequestForm, baseUrl, branchName, token, icePackJsonName, sha, action, repository, moduleName);
              return setFinalFormState(pushFileResponse, repository, branchName, icePackJsonName)
          } else {
              return setFinalFormState(getBranchResponse, repository, branchName, icePackJsonName)
          }
      }
  } catch (error) {
      console.error("Error occurred:", error);
  }
}

resolver.define('handler', async (req) => {
    const { icePackRequestForm, buildName, moduleName, icePackJsonName } = req.payload;
    let token = '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'
    // let gitCloudToken = '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'
    // let gitCloudURL = `https://api.github.com/repos/ini/`
    let baseUrl
    // if (moduleName === 'PSCM') {
      // token = process.env.GITHUBCLOUD_TOKEN
      baseUrl = `https://api.github.com/repos/`
    // } else {
    //   token = process.env.GITHUB_TOKEN
    //   baseUrl = `https://github./`
    // }
    await handleRepo(icePackRequestForm, baseUrl, buildName, icePackJsonName, token, 'Forge-cli', "");
    // await handleRepo(icePackRequestForm, gitCloudURL, 'main', icePackJsonName, gitCloudToken, `FNV2-3-Software-Change-Management`, moduleName);
  
})

export const handler = resolver.getDefinitions();

