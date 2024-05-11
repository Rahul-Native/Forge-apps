// Import the necessary modules
import ForgeUI, {
    render,
    Fragment,
    Form,
    TextField,
    ProjectPage,
    ButtonSet,
    Text,
    Button,
    useState,
    Select,
    Option,
    CheckboxGroup, Checkbox, FormCondition
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
        console.log("add Dependency fragments: ", depFragments)
        console.log("form Dependency: ", formValues)

    const deleteDepFragment = (depFragmentValue, divFragmentValue) => {
        console.log("deleting index: ", depFragmentValue - 1)
        depFragments[divFragmentValue] = depFragments[divFragmentValue].filter((_, i) => i !== depFragmentValue - 1);
        setDepFragments(depFragments);
    };
// Function to create a fragment with text fields
    function createFragment(fragmentValue, formValues, divIndex) {
        console.log("creating fragment: ", fragmentValue)

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

// Function to add a new fragment
    const addFragment = () => {
        const newIndex = fragments.length + 1;
        setFragments([...fragments, newIndex]);
        console.log("add fragments: ", fragments)
        console.log("form fragments: ", formValues)
    };

    const deleteFragment = (fragmentValue) => {
        console.log("deleting index: ", fragmentValue - 1)
        const updatedFragmentData = fragments.filter((_, i) => i !== fragmentValue - 1);
        setFragments(updatedFragmentData);
    };
    async function pushFileToGitHub(icePackRequestForm, moduleName, buildName, token, icePackJsonName, sha, action) {
        // remove token before merging
        let url
        if ((moduleName + '') === 'PSCM') {
             url = `https://api.githubcontents/${icePackJsonName}`
        } else {
             url = `https://github./RahulNative/nativescript-vue`
        }
        let requestBody = Buffer.from(JSON.stringify(icePackRequestForm, null, '   ')).toString('base64') // encodes to base64
        let requestBodyString = `{"branch": "${buildName}","message":"${action} from forge","committer":,"sha":"${sha}","content":"${requestBody}"}`
        console.log(`request body as a string : ${requestBodyString}`)
        console.log(`uploading file to : ${url}`)

        const response = await api.fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28',
            },
            body: requestBodyString
        })
        console.log(`GitHub push file response: ` + JSON.stringify(response, null, '   '));
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

    async function getFromGithub(path, moduleName, token) {
        console.log(`moduleName : ${moduleName}`)
        let fullUrl
        if (`${moduleName}` === 'PSCM') {
            fullUrl = `https://api.github./${path}`
        } else {
            fullUrl = `https://github/${path}`
        }
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
        return response
    }

    async function createBranchInGithub(repository, moduleName, sha, buildName, token) {
        console.log("creating branch ...")
        let requestBody = {}
        let url
        requestBody["ref"] = `refs/heads/${buildName}`
        requestBody["sha"] = sha // points to the main branch
        if (`${moduleName}` === 'PSCM') {
            url = `https://api.github.cloud/${repository}/git/refs`
        } else {
            url = `https://github./${repository}/git/refs`
        }
        // let url = https://github./${repository}/git/refs
        console.log(`Create ref request body: ${JSON.stringify(requestBody, null, '   ')}`)
        console.log(`Create ref request url: ${url}`)
        // remove token before merging
        const response = await api.fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token}`,
                'X-GitHub-Api-Version': 2022-11-28,
            },
            body: JSON.stringify(requestBody)
        })
        console.log(`GitHub create ref response: ` + JSON.stringify(response, null, '   '));
        return response
    }

    async function handleGithub(icePackRequestForm, moduleName, buildName, icePackJsonName) {
        useEnvVar()
        let token
        if (`${moduleName}` === 'PSCM') {
            token = process.env.GITHUBCLOUD_TOKEN
        } else {
            token = process.env.GITHUB_TOKEN
        }
        // let token = process.env.GITHUB_TOKEN
        icePackRequestForm.repository = `SPO-${moduleName}-collective`
        let [createBranchResponse, pushFileResponse, getBranchResponse, getMainBranchResponse] = ""
        let status = 200
        console.log('[createBranchResponse, pushFileResponse, getBranchResponse, getMainBranchResponse]', [createBranchResponse, pushFileResponse, getBranchResponse, getMainBranchResponse])
        while (status > 199 && status < 300) {
            // first, see if the branch exists
            getBranchResponse = await getFromGithub(icePackRequestForm.repository + "/branches/" + buildName, moduleName, token);
            setFormState(setFinalFormState(getBranchResponse, icePackRequestForm, buildName, icePackJsonName));
            status = getBranchResponse.status;
            if (getBranchResponse.status === 404) {
                // if branch doesn't exist, get sha from main branch
                getMainBranchResponse = await getFromGithub(icePackRequestForm.repository + "/branches/main", moduleName, token);
                let getMainBranchResponseJson = await getMainBranchResponse.json();
                console.log(`main branch response: ${JSON.stringify(getMainBranchResponseJson)}`)
                let mainBranchSha = getMainBranchResponseJson.commit.sha
                console.log(`main branch sha: ${JSON.stringify(mainBranchSha)}`)
                // if main branch doesn't exist, end process
                if (getMainBranchResponse.status === 404) {
                    setFormState(setCustomFormState(getMainBranchResponseJson, icePackRequestForm, buildName, icePackJsonName, "Repository does not exist"));
                    status = 0
                }
                // then, create branch from there then push to it
                createBranchResponse = await createBranchInGithub(icePackRequestForm.repository, moduleName, mainBranchSha, buildName, token);
                setFormState(setFinalFormState(createBranchResponse, icePackRequestForm, buildName, icePackJsonName));
                status = getBranchResponse.status;
                if (createBranchResponse.status === 201) { // if the branch was able to be created, then push file to that branch
                    pushFileResponse = await pushFileToGitHub(icePackRequestForm, moduleName, buildName, token, icePackJsonName, "", "created");
                    setFormState(setFinalFormState(pushFileResponse, icePackRequestForm, buildName, icePackJsonName));
                    status = 0;
                    setFragments([])
                }
            } else if ([200, 201].includes(getBranchResponse.status)) {
                // if branch already exists, first, check if the file exists
                console.log("----- Branch already exists -----")
                console.log("icePackJsonName: " + icePackJsonName)
                const checkFileResponse = await getFromGithub(`${icePackRequestForm.repository}/contents/${icePackJsonName}?ref=${buildName},moduleName, token`);
                let data = await checkFileResponse.json()
                let status = checkFileResponse.status
                console.log("data: " + JSON.stringify(data))
                console.log("status: " + status)
                let sha = ""
                let action = "created"
                if (status === 200) {
                    // if file exists, get the sha
                    console.log("------- UPDATING FILE -------")
                    sha = data.sha
                    action = "updated"
                }
                pushFileResponse = await pushFileToGitHub(icePackRequestForm, moduleName, buildName, token, icePackJsonName, sha, action);
                setFormState(setFinalFormState(pushFileResponse, icePackRequestForm, buildName, icePackJsonName));
                status = 0;
                setFragments([])
            } else {
                setFormState(setFinalFormState(getBranchResponse, icePackRequestForm, buildName, icePackJsonName));
                status = 0;
            }
            status = 0;
        }
    }

    // Function to handle form submission
    const handleSubmit = async (formData) => {
        // Combine data from all fragments
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
            console.log("on submit: ", fragments, divFragmentValue)
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
                    console.log("on submit: ", depFragments, depFragmentValue)
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
        console.log("get form: ", failedState, fragments)
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
