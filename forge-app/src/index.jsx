//Import the necessary modules
import ForgeUI, {
    render,
    Fragment,
    Form,
    TextField,
    ProjectPage,
    Text,
    Button,
    useState,
    Select,
    Option
} from '@forge/ui';
import api from '@forge/api';

// Create a function to render the form
const App = () => {
// State to keep track of added fragments and their values
    const [fragments, setFragments] = useState([]);
    const [depFragments, setDepFragments] = useState({});
    const [formValues, setFormValues] = useState({});
    const [formState, setFormState] = useState(undefined);
    const [failedState, setFailedState] = useState(false);

    const useEnvVar = () => {
        const val = process.env.GITHUB_TOKEN;

        if(hasValue(val)){
            console.log("Env Var Present");
        }
    }

    function createDepFragment(depFragmentValue, formValues, divFragmentValue, depIndex, divIndex) {
        
        if (hasValue(formValues) && hasValue(formValues.release) && hasValue(formValues.release[divIndex]['dependencyDetails'][depIndex])) {
            return (
                <Fragment>
                    <TextField name={`name-${divFragmentValue}-${depFragmentValue}`} label={`Name (${depFragmentValue})`}
                               isRequired={true} description={"Icepack Name"}
                               defaultValue={`${formValues.release[divIndex]['dependencyDetails'][depIndex].name}`}/>
                    <TextField name={`version-${divFragmentValue}-${depFragmentValue}`} label={`Version (${depFragmentValue})`}
                               isRequired={true} description={"Icepack Version"}
                               defaultValue={`${formValues.release[divIndex]['dependencyDetails'][depIndex].version}`}/>
                    <TextField name={`relationshipType-${divFragmentValue}-${depFragmentValue}`} label={`RelationShipType (${depFragmentValue})`}
                               isRequired={true} description={"Icepack RelationShipType"}
                               defaultValue={`${formValues.release[divIndex]['dependencyDetails'][depIndex].relationshipType}`}/>
                    <TextField name={`relatedIcePacks-${divFragmentValue}-${depFragmentValue}`} label={`Related IcePack (${depFragmentValue})`}
                               isRequired={true} description={"Related IcePack Number"}
                               defaultValue={`${formValues.release[divIndex]['dependencyDetails'][depIndex].relatedIcePacks}`}/>
                    <Button text="Delete Dependency" onClick={() => deleteDepFragment(depFragmentValue,divFragmentValue)}
                            disabled={depFragmentValue === depFragments.length - 1}/>
                </Fragment>
            )
        }
        return (
            <Fragment>
                <TextField name={`name-${divFragmentValue}-${depFragmentValue}`} label={`Name (${depFragmentValue})`}
                           isRequired={true} description={"Icepack Name"}/>
                <TextField name={`version-${divFragmentValue}-${depFragmentValue}`} label={`Version (${depFragmentValue})`}
                           isRequired={true} description={"Icepack Version"}/>
                <TextField name={`relationshipType-${divFragmentValue}-${depFragmentValue}`} label={`RelationShipType (${depFragmentValue})`}
                           isRequired={true} description={"Icepack RelationShipType"}/>
                <TextField name={`relatedIcePacks-${divFragmentValue}-${depFragmentValue}`} label={`Related IcePack (${depFragmentValue})`}
                           isRequired={true} description={"Related IcePack Number"}/>
                <Button text="Delete Dependency" onClick={() => deleteDepFragment(depFragmentValue,divFragmentValue)}
                        disabled={depFragmentValue === depFragments.length - 1}/>
            </Fragment>
        );
    }

    const addDepFragment = (divFragmentValue, formValues) => {
        if(hasValue(depFragments[divFragmentValue])){
            const newIndex = depFragments[divFragmentValue].length + 1;
            depFragments[divFragmentValue] = [...depFragments[divFragmentValue], newIndex]
            setDepFragments(depFragments);
        }
        else{
            depFragments[divFragmentValue] = [1]
            setDepFragments(depFragments);
        }
    }

    const deleteDepFragment = (depFragmentValue, divFragmentValue) => {
        depFragments[divFragmentValue] = depFragments[divFragmentValue].filter((_, i) => i !== depFragmentValue - 1);
        setDepFragments(depFragments);
    };

    // Function to create a fragment with text fields
    function createFragment(fragmentValue, formValues, divIndex) {

        if (hasValue(formValues) && hasValue(formValues.release) && hasValue(formValues.release[fragmentValue - 1])) {
            return (
                <Fragment>
                    <TextField name={`div${fragmentValue}`} label={`Domain Instance Name (${fragmentValue})`}
                               isRequired={true} description={"Domain instance name"}
                               defaultValue={`${formValues.release[fragmentValue - 1].div}`}/>
                    <TextField name={`divVersion${fragmentValue}`} label={`Domain Instance Version (${fragmentValue})`}
                               isRequired={true} description={"Domain instance version"}
                               defaultValue={`${formValues.release[fragmentValue - 1].divVersion}`}/>
                    <TextField name={`programCode${fragmentValue}`} label={`Program Code (${fragmentValue})`}
                               isRequired={true} description={"Program code eg: P702"}
                               defaultValue={`${formValues.release[fragmentValue - 1].programCode}`}/>
                    <TextField name={`modelYear${fragmentValue}`} label={`Model Year (${fragmentValue})`}
                               isRequired={true}
                               description={"Model year eg: 2023"}
                               defaultValue={`${formValues.release[fragmentValue - 1].modelYear}`}/>
                    <TextField name={`partSpecification${fragmentValue}`}
                               label={`PartIISpecification (${fragmentValue})`}
                               isRequired={false} description={"Part II specification eg: DSMU5T-14G650-JA"}
                               defaultValue={`${formValues.release[fragmentValue - 1].partIISpecification}`}/>
                    <TextField name={`hardware${fragmentValue}`} label={`Hardware Parts (${fragmentValue})`}
                               isRequired={true}
                               description={"Comma seperated hardware part numbers eg: MU5T-14G681-AG,MU5T-14G681-BG"}
                               defaultValue={`${formValues.release[fragmentValue - 1].hardware}`}/>
                    <TextField name={`applications${fragmentValue}`} label={`Related Applications (${fragmentValue})`}
                               isRequired={false}
                               description={"Comma seperated application software part numbers eg: MU5T-14G690-CA,MU5T-14G681-DA"}
                               defaultValue={`${formValues.release[fragmentValue - 1].applications}`}/>
                    {depFragments[fragmentValue] && depFragments[fragmentValue].length ? depFragments[fragmentValue].map((value, index) => (
                        createDepFragment(value, formValues, fragmentValue, index, divIndex)
                    )): ''}
                    <Button text="Add Dependency" onClick={() => addDepFragment(fragmentValue, formValues)}/>
                    <Button text="Delete DIV" onClick={() => deleteFragment(fragmentValue)}
                            disabled={fragmentValue === fragments.length - 1}/>
                </Fragment>
            )
        }
        return (
            <Fragment>
                <TextField name={`div${fragmentValue}`} label={`Domain Instance Name (${fragmentValue})`}
                           isRequired={true} description={"Domain instance name"}/>
                <TextField name={`divVersion${fragmentValue}`} label={`Domain Instance Version (${fragmentValue})`}
                           isRequired={true} description={"Domain instance version"}/>
                <TextField name={`programCode${fragmentValue}`} label={`Program Code (${fragmentValue})`}
                           isRequired={true} description={"Program code eg: P702"}/>
                <TextField name={`modelYear${fragmentValue}`} label={`Model Year (${fragmentValue})`} isRequired={true}
                           description={"Model year eg: 2023"}/>
                <TextField name={`partSpecification${fragmentValue}`} label={`PartIISpecification (${fragmentValue})`}
                           isRequired={false} description={"Part II specification eg: DSMU5T-14G650-JA"}/>
                <TextField name={`hardware${fragmentValue}`} label={`Hardware Parts (${fragmentValue})`}
                           isRequired={true}
                           description={"Comma seperated hardware part numbers eg: MU5T-14G681-AG,MU5T-14G681-BG"}/>
                <TextField name={`applications${fragmentValue}`} label={`Related Applications (${fragmentValue})`}
                           isRequired={false}
                           description={"Comma seperated application software part numbers eg: MU5T-14G690-CA,MU5T-14G681-DA"}/>
                {depFragments[fragmentValue] && depFragments[fragmentValue].length ? depFragments[fragmentValue].map((value, index) => (
                    createDepFragment(value, formValues, fragmentValue, index, divIndex)
                )): ''}
                <Button text="Add Dependency" onClick={() => addDepFragment(fragmentValue, formValues)}/>
                <Button text="Delete DIV" onClick={() => deleteFragment(fragmentValue)}
                        disabled={fragmentValue === fragments.length - 1}/>
            </Fragment>
        );
    }

    function hasValue(data) {
        return (data !== undefined) && (data !== null) && (data !== "");
    }

    const addFragment = () => {
        const newIndex = fragments.length + 1;
        setFragments([...fragments, newIndex]);
    };

    const deleteFragment = (fragmentValue) => {
        const updatedFragmentData = fragments.filter((_, i) => i !== fragmentValue - 1);
        setFragments(updatedFragmentData);
    };

    async function pushFileToGitHub(icePackRequestForm, baseURL, buildName, token, icePackJsonName, sha, action, repository) {
        let url = `${baseURL}${repository}/contents/${icePackJsonName}`
        let requestBody = Buffer.from(JSON.stringify(icePackRequestForm, null, '   ')).toString('base64') // encodes to base64
        let requestBodyString = {"branch":buildName,"message":`${action} from forge`,"committer":{"name":"rahul","email":"octocat@github.com"},"content":requestBody, "sha":`${sha}`}

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
        let json = await response.json();
        let text = await response.text();
        let arrayBuffer = await response.arrayBuffer();
        
        console.log(`GitHub push file response: ` + JSON.stringify(response, null, '   '), json, text, arrayBuffer);
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

    async function getFromGithub(path, baseURL, token ) {
        console.log('getFromGithub :::: started')
        let fullUrl = baseURL + path
        console.log(`checking if ${path} exists, full url : ${fullUrl}`)
        const response = await api.fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28',
            }
        })
        console.log(`GitHub response for GET: ` + JSON.stringify(response, null, '   '));
        console.log('getFromGithub :::: ended')
        return response
    }

    async function createBranchInGithub(repository, baseURL, sha, buildName, token) {
        console.log('createBranchInGithub :::: started')
        let requestBody = {}
        requestBody["ref"] = `refs/heads/${buildName}`
        requestBody["sha"] = sha // points to the main branch
        let url = `${baseURL}${repository}/git/refs`
        console.log(`Create ref request body: ${JSON.stringify(requestBody, null, '   ')}`)
        console.log(`Create ref request url: ${url}`)
        // remove token before merging
        const response = await api.fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28',
            },
            body: JSON.stringify(requestBody)
        })
        let json = await response.json();
        let text = await response.text();
        let arrayBuffer = await response.arrayBuffer();
        console.log(`GitHub response for createBranchInGithub: ` + JSON.stringify(response, null, '   '), json, text, arrayBuffer);
        return response
    }

    async function handleGithub(icePackRequestForm, moduleName, buildName, icePackJsonName) {
        useEnvVar();
        let token;
        let baseURL;
        token = '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'
        baseURL = 'https://api.github.com/repos/RahulNative/'
        // Get the current date and time
        const currentDate = new Date();
        // Format the date and time
        const formattedDate = currentDate.toLocaleDateString();
        const formattedTime = currentDate.toLocaleTimeString();
        let icePackJsonNameCloud = `spo_${moduleName.toLowerCase()}_icepack_${formattedDate}_${formattedTime}.json`
        icePackJsonNameCloud = moduleName + '/' + icePackJsonNameCloud.replace(/[^a-zA-Z0-9-\.]/g, '_')
        // repos.forEach(async (repo)=>{
            await handleRepo(icePackRequestForm, 'https://api.github.com/repos/RahulNative/', buildName, icePackJsonName, token, 'Forge-cli');
            // await handleRepo(icePackRequestForm, 'https://api.github.com/repos/RahulNative/', 'main', icePackJsonNameCloud, token, 'nativescript-vue');
        // })
        // icePackRequestForm.repository = `SPO-${moduleName}-collective`;
        // icePackRequestForm.repository = 'second_repo';
        // await handleRepo(icePackRequestForm, moduleName, 'main', icePackJsonName, token);
    }
    
    async function handleRepo(icePackRequestForm, baseUrl, branchName, icePackJsonName, token, repository) {
        let getBranchResponse;
        let pushFileResponse;
        let createBranchResponse;
        let getMainBranchResponse
        console.log('handleRepo', icePackRequestForm, baseUrl, branchName, icePackJsonName, token, repository)
        let status = 200
        while (status > 199 && status < 300) {
            getBranchResponse = await getFromGithub(repository + "/branches/" + branchName, baseUrl, token);
            setFormState(setFinalFormState(getBranchResponse, icePackRequestForm, branchName, icePackJsonName));
            status = getBranchResponse.status;
            console.log('status', status)
            if (getBranchResponse.status === 404) {
                getMainBranchResponse = await getFromGithub(repository + "/branches/main", baseUrl, token);
                let getMainBranchResponseJson = await getMainBranchResponse.json();
                console.log(`main branch response: ${JSON.stringify(getMainBranchResponseJson)}`)
                let mainBranchSha = getMainBranchResponseJson.commit.sha
                console.log(`main branch sha: ${JSON.stringify(mainBranchSha)}`)
                if (getMainBranchResponse.status === 404) {
                    setFormState(setCustomFormState(getMainBranchResponseJson, icePackRequestForm, branchName, icePackJsonName, " does not exist"));
                    status = 0
                }
                createBranchResponse = await createBranchInGithub(repository, baseUrl, mainBranchSha, branchName, token);
                setFormState(setFinalFormState(createBranchResponse, icePackRequestForm, branchName, icePackJsonName));
                status = getBranchResponse.status;
                if (createBranchResponse.status === 201) { // if the branch was able to be created, then push file to that branch
                    pushFileResponse = await pushFileToGitHub(icePackRequestForm, baseUrl, branchName, token, icePackJsonName, "", "created", repository);
                    setFormState(setFinalFormState(pushFileResponse, icePackRequestForm, branchName, icePackJsonName));
                    status = 0;
                    setFragments([])
                    setDepFragments([])
                }
            } else if ([200, 201].includes(getBranchResponse.status)) {
                const checkFileResponse = await getFromGithub(`${repository}/contents/${icePackJsonName}?ref=${branchName}`,baseUrl, token);
                let data = await checkFileResponse.json()
                let status = checkFileResponse.status
                let sha = ""
                let action = "created"
                if (status === 200) {
                    sha = data.sha
                    action = "updated"
                }
                pushFileResponse = await pushFileToGitHub(icePackRequestForm, baseUrl, branchName, token, icePackJsonName, sha, action, repository);
                setFormState(setFinalFormState(pushFileResponse, icePackRequestForm, branchName, icePackJsonName));
                status = 0;
                setFragments([])
            } else {
                setFormState(setFinalFormState(getBranchResponse, icePackRequestForm, branchName, icePackJsonName));
                status = 0;
            }
            status = 0;
        }
        console.log('handleGithub :::: ended')
    }

    const handleSubmit = async (formData) => {
        const icePackRequestForm = {};
        const releaseInfo = {};
        const divDetails = [];
        let dependencyDetails = [];
        const buildName = formData['buildName'];
        const moduleName = formData["module"];
        const icePackJsonName = `spo_${moduleName.toLowerCase()}_icepack.json`
        releaseInfo['buildName'] = formData['buildName'];
        releaseInfo['ecuName'] = formData['ecuName'];
        releaseInfo['canRx'] = formData['canRx'];
        releaseInfo['productionState'] = formData['productionState'];
        icePackRequestForm['releaseInfo'] = releaseInfo;

        fragments.forEach((divFragmentValue) => {
            const divFragment = {}
            dependencyDetails =[]
            divFragment[`div`] = formData[`div${divFragmentValue}`];
            divFragment[`divVersion`] = formData[`divVersion${divFragmentValue}`];
            divFragment[`programCode`] = formData[`programCode${divFragmentValue}`];
            divFragment[`modelYear`] = formData[`modelYear${divFragmentValue}`];
            divFragment[`partIISpecification`] = formData[`partSpecification${divFragmentValue}`];
            divFragment[`hardware`] = formData[`hardware${divFragmentValue}`];
            divFragment[`applications`] = formData[`applications${divFragmentValue}`];
                        if(Object.keys(hasValue(depFragments)) && hasValue(depFragments[divFragmentValue]))
                depFragments[divFragmentValue].forEach((depFragmentValue) => {
                    const divDepFragment = {}
                    divDepFragment[`name`] = formData[`name-${divFragmentValue}-${depFragmentValue}`];
                    divDepFragment[`version`] = formData[`version-${divFragmentValue}-${depFragmentValue}`];
                    divDepFragment[`relationshipType`] = formData[`relationshipType-${divFragmentValue}-${depFragmentValue}`];
                    divDepFragment[`relatedIcePacks`] = formData[`relatedIcePacks-${divFragmentValue}-${depFragmentValue}`];
                    dependencyDetails.push(divDepFragment);
                });
                
            divFragment[`dependencyDetails`] = dependencyDetails;
                divDetails.push(divFragment);
        });
        icePackRequestForm["release"] = divDetails;
        console.log('icepack request data', icePackRequestForm);
        await handleGithub(icePackRequestForm, moduleName, buildName, icePackJsonName);
        setFormValues({...formValues,...icePackRequestForm});
    };

    function getModuleSelect() {
        return <Select
            label="Module Name"
            name="module"
            onChange={({label, value}) => console.log(label, value)}
        >
            <Option defaultSelected label="SYNC" value="SYNC"/>
            <Option label="SCCM" value="SCCM"/>
            <Option label="ECG" value="ECG"/>
            <Option label="BCM" value="BCM"/>
            <Option label="TCU" value="TCU"/>
            <Option label="Phoenix" value="Phoenix"/>
            <Option label="DSMC" value="DSMC"/>
            <Option label="PSCM" value="PSCM"/>
            <Option label="DAT2" value="DAT2"/>
            <Option label="HVAC" value="HVAC"/>
            <Option label="IPC" value="IPC"/>
            <Option label="PDM-FNV3" value="PDM-FNV3"/>
            <Option label="PDM-FNV2" value="PDM-FNV2"/>
            <Option label="DDM-FNV3" value="DDM-FNV3"/>
            <Option label="DDM-FNV2" value="DDM-FNV2"/>
            <Option label="BLEM" value="BLEM"/>
            <Option label="TRM" value="TRM"/>
            <Option label="iTRM" value="iTRM"/>
            <Option label="TTRM" value="TTRM"/>
        </Select>;
    }

    function getStateSelect() {
        return <Select
            label="Production State"
            name="productionState"
            onChange={({label, value}) => console.log(label, value)}
        >
            <Option defaultSelected label="PROTOTYPE" value="PROTOTYPE"/>
            <Option label="PRODUCTION" value="PRODUCTION"/>
        </Select>;
    }

    function getForm(formValues) {
        if ((failedState) || (hasValue(formValues) && hasValue(formValues.releaseInfo) && hasValue(formValues.releaseInfo[fragments]))) {
            return <Fragment>
                <TextField name="buildName" label="Jenkins Build Name" isRequired={true}
                           description={"Identifier that relates to a build. Used to create branch in github. eg: launch-SYNC-134"}
                           defaultValue={hasValue(formValues.releaseInfo) ? `${formValues.releaseInfo.buildName}` : ``}/>
                <TextField name="ecuName" label="ECU Name" isRequired={true} description={"ECU name eg: APIM"}
                           defaultValue={hasValue(formValues.releaseInfo) ? `${formValues.releaseInfo.ecuName}` : ``}/>
                <TextField name="canRx" label="Can Rx" isRequired={true} description={"Can Rx id eg: 7D0"}
                           defaultValue={hasValue(formValues.releaseInfo) ? `${formValues.releaseInfo.canRx}` : ``}/>
                {fragments.map((value, index) => (
                    createFragment(value, formValues, index)
                ))}
                <Button text="Add DIV" onClick={addFragment}/>
            </Fragment>
        }
        return <Fragment>
            <TextField name="buildName" label="Jenkins Build Name" isRequired={true} description={"SPYRO/newbranchname"}/>
            <TextField name="ecuName" label="ECU Name" isRequired={true} description={"ECU name eg: APIM"}/>
            <TextField name="canRx" label="Can Rx" isRequired={true} description={"Can Rx id eg: 7D0"}/>
            {fragments.map((value, index) => (
                createFragment(value, formValues, index)
            ))}
            <Button text="Add DIV" onClick={addFragment}/>
        </Fragment>;
    }

    return (
        <ProjectPage>
            <Form onSubmit={handleSubmit}>
                {getModuleSelect()}
                {getStateSelect()}
                {getForm(formValues)}
            </Form>
            {formState && <Text>{JSON.stringify(formState)}</Text>}
        </ProjectPage>
    );
};

// Render the app
export const run = render(<App/>);
