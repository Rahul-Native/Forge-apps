// Import the necessary modules
import ForgeUI, {
    render,
    Fragment,
    Form,
    TextField,
    IssuePanel,
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
  
    async function pushFileToGitHub(icePackRequestForm, baseURL, buildName, token, icePackJsonName, sha, action, repository, moduleName) {
        let url = `${baseURL}${repository}/contents/${moduleName ? moduleName + '/' : ''}${icePackJsonName}`
        let requestBody = Buffer.from(JSON.stringify(icePackRequestForm, null, '   ')).toString('base64') // encodes to base64
        let requestBodyString = {"message":`${action} from forge`,"committer":{"name":"YOUR","email":"YOUR"},"content":requestBody, "sha":`${sha}`}
  
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
  
    async function getFromGithub(path, baseURL, token ) {
        let fullUrl = baseURL + path
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
  
    async function createBranchInGithub(repository, baseURL, sha, buildName, token) {
        let url = `${baseURL}${repository}/git/refs`
        const response = await api.fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28',
            },
            body: JSON.stringify({ ref: `refs/heads/${buildName}`, sha:sha })
        })
        return response
    }
  
    async function handleGithub(icePackRequestForm, moduleName, buildName, icePackJsonName) {
        useEnvVar();
        let token = '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'
        let baseURL = 'https://api.github.com/repos/RahulNative/'
        // if(moduleName === 'PSCM'){
        //     baseURL = 'YOUR_url'
        //     token = 'YOUR_token'
        // } else {
        //     token = 'YOUR_token'
        //     baseURL = 'YOUR_url'
        // }
        await handleRepo(icePackRequestForm, baseURL, buildName, icePackJsonName, token, 'Forge-cli', '');
        await handleRepo(icePackRequestForm, baseURL, 'main', icePackJsonName, token, 'nativescript-vue', moduleName);
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
                        setFormState(setCustomFormState(mainBranchData, icePackRequestForm, branchName, icePackJsonName, " does not exist"));
                        return;
                    }
    
                    createBranchResponse = await createBranchInGithub(repository, baseUrl, mainBranchSha, branchName, token);
                    setFormState(setFinalFormState(createBranchResponse, icePackRequestForm, branchName, icePackJsonName));
    
                    if (createBranchResponse.status === 201) {
                        pushFileResponse = await pushFileToGitHub(icePackRequestForm, baseUrl, branchName, token, icePackJsonName, "", "created", repository, moduleName);
                        setFormState(setFinalFormState(pushFileResponse, icePackRequestForm, branchName, icePackJsonName));
                        setFragments([]);
                        setDepFragments([]);
                    }
                } else if (status === 200 || status === 201) {
                    const checkFileResponse = await getFromGithub(`${repository}/contents/${moduleName ? moduleName + '/' : ''}${icePackJsonName}?ref=${branchName}`, baseUrl, token);
                    const data = await checkFileResponse.json();
                    const sha = data.sha || "";
                    const action = sha ? "updated" : "created";
    
                    pushFileResponse = await pushFileToGitHub(icePackRequestForm, baseUrl, branchName, token, icePackJsonName, sha, action, repository, moduleName);
                    setFormState(setFinalFormState(pushFileResponse, icePackRequestForm, branchName, icePackJsonName));
                    setFragments([]);
                } else {
                    setFormState(setFinalFormState(getBranchResponse, icePackRequestForm, branchName, icePackJsonName));
                }
            }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    }
    
  
    const handleSubmit = async (formData) => {
        const icePackRequestForm = {};
        const releaseInfo = {};
        const divDetails = [];
        let dependencyDetails = [];
        const buildName = formData['buildName'];
        const moduleName = formData["module"];
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();
        const formattedTime = currentDate.toLocaleTimeString();
        let icePackJsonName = `spo_${moduleName.toLowerCase()}_icepack_${formattedDate}_${formattedTime}.json`
        icePackJsonName = moduleName + '/' + icePackJsonName.replace(/[^a-zA-Z0-9-\.]/g, '_')
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
        <IssuePanel>
            <Form onSubmit={handleSubmit}>
                {getModuleSelect()}
                {getStateSelect()}
                {getForm(formValues)}
            </Form>
            {formState && <Text>{JSON.stringify(formState)}</Text>}
        </IssuePanel>
    );
  };
  
  // Render the app
  export const run = render(<App/>);