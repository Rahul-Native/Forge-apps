import React, { useState } from 'react';
import { invoke } from '@forge/bridge';

const MyForm = () => {
  const [mainForm, setMainForm] = useState({
    moduleName: '',
    productionState: '',
    jenkinsBuildName: '',
    ecuName: '',
    canRx: '',
    divForms: [],
  });

  // const [showButtonGroup, setShowButtonGroup] = useState(true);

  const handleMainFormChange = (e) => {
    setMainForm({
      ...mainForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddDivForm = () => {
    const newDivForm = {
      domainInstanceName: '',
      domainInstanceVersion: '',
      programCode: '',
      modelYear: '',
      partIISpecification: '',
      hardwareParts: '',
      relatedApplications: '',
      dependencyForms: [],
    };
    setMainForm({
      ...mainForm,
      divForms: [...mainForm.divForms, newDivForm],
    });
    // setShowButtonGroup(false); // Hide button group when adding a div form
  };

  const handleDivFormChange = (e, index) => {
    const updatedDivForms = [...mainForm.divForms];
    updatedDivForms[index][e.target.name] = e.target.value;
    setMainForm({
      ...mainForm,
      divForms: updatedDivForms,
    });
  };

  const handleDeleteDivForm = (index) => {
    setMainForm({
      ...mainForm,
      divForms: mainForm.divForms.filter((_, i) => i !== index),
    });
    // setShowButtonGroup(mainForm.divForms.length > 1); // Show if there's more than one div form
  };

  const handleAddDependencyForm = (parentIndex) => {
    const newDependencyForm = {
      name: '',
      version: '',
      relationShipType: '',
      relatedIcePack: '',
    };
    const updatedDivForms = [...mainForm.divForms];
    updatedDivForms[parentIndex].dependencyForms.push(newDependencyForm);
    setMainForm({
      ...mainForm,
      divForms: updatedDivForms,
    });
    // setShowButtonGroup(false); // Hide button group when adding a dependency form
  };

  const handleDependencyFormChange = (e, divIndex, depIndex) => {
    const updatedDivForms = [...mainForm.divForms];
    updatedDivForms[divIndex].dependencyForms[depIndex][e.target.name] = e.target.value;
    setMainForm({
      ...mainForm,
      divForms: updatedDivForms,
    });
  };

  const handleDeleteDependencyForm = (divIndex, depIndex) => {
    const updatedDivForms = [...mainForm.divForms];
    updatedDivForms[divIndex].dependencyForms = updatedDivForms[divIndex].dependencyForms.filter(
      (_, i) => i !== depIndex
    );
    setMainForm({
      ...mainForm,
      divForms: updatedDivForms,
    });
    // setShowButtonGroup(updatedDivForms.some((div) => div.dependencyForms.length < 1));
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    console.log('Form Data:', JSON.stringify(mainForm));
    const res = await invoke('handler', JSON.parse(JSON.stringify(mainForm)));
    console.log('res', res)
    // This outputs the mainForm object with divForms and dependencyForms
  };

  return (
    <div>
      <h2>Main Form</h2>
      <form>
        <div>
          <label>Module Name:</label>
          <select
            name="moduleName"
            value={mainForm.moduleName}
            onChange={handleMainFormChange}
          >
            <option value="">Select</option>
            <option value="Module1">Module1</option>
            <option value="Module2">Module2</option>
          </select>
        </div>
        <div>
          <label>Production State:</label>
          <select
            name="productionState"
            value={mainForm.productionState}
            onChange={handleMainFormChange}
          >
            <option value="">Select</option>
            <option value="Production">Production</option>
            <option value="Development">Development</option>
          </select>
        </div>
        <div>
          <label>Jenkins Build Name:</label>
          <input
            type="text"
            name="jenkinsBuildName"
            value={mainForm.jenkinsBuildName}
            onChange={handleMainFormChange}
          />
        </div>
        <div>
          <label>ECU Name:</label>
          <input
            type="text"
            name="ecuName"
            value={mainForm.ecuName}
            onChange={handleMainFormChange}
          />
        </div>
        <div>
          <label>Can Rx:</label>
          <input
            type="text"
            name="canRx"
            value={mainForm.canRx}
            onChange={handleMainFormChange}
          />
        </div>

        {mainForm && mainForm.divForms && mainForm.divForms.map((divForm, divIndex) => (
          <div key={divIndex}>
            <h3>Div Form {divIndex + 1}</h3>
            <div>
              <label>Domain Instance Name:</label>
              <input
                type="text"
                name="domainInstanceName"
                value={divForm.domainInstanceName}
                onChange={(e) => handleDivFormChange(e, divIndex)}
              />
            </div>
            <div>
              <label>Domain Instance Version:</label>
              <input
                type="text"
                name="domainInstanceVersion"
                value={divForm.domainInstanceVersion}
                onChange={(e) => handleDivFormChange(e, divIndex)}
              />
            </div>
            <div>
              <label>Program Code:</label>
              <input
                type="text"
                name="programCode"
                value={divForm.programCode}
                onChange={(e) => handleDivFormChange(e, divIndex)}
              />
            </div>
            <div>
              <label>Model Year:</label>
              <input
                type="text"
                name="modelYear"
                value={divForm.modelYear}
                onChange={(e) => handleDivFormChange(e, divIndex)}
              />
            </div>
            <div>
              <label>PartII Specification:</label>
              <input
                type="text"
                name="partIISpecification"
                value={divForm.partIISpecification}
                onChange={(e) => handleDivFormChange(e, divIndex)}
              />
            </div>
            <div>
              <label>Hardware Parts:</label>
              <input
                type="text"
                name="hardwareParts"
                value={divForm.hardwareParts}
                onChange={(e) => handleDivFormChange(e, divIndex)}
              />
            </div>
            <div>
              <label>Related Applications:</label>
              <input
                type="text"
                name="relatedApplications"
                value={divForm.relatedApplications}
                onChange={(e) => handleDivFormChange(e, divIndex)}
              />
            </div>

            {divForm.dependencyForms.map((dependencyForm, depIndex) => (
              <div key={depIndex}>
                <h4>Dependency Form {depIndex + 1}</h4>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={dependencyForm.name}
                    onChange={(e) => handleDependencyFormChange(e, divIndex, depIndex)}
                  />
                </div>
                <div>
                  <label>Version:</label>
                  <input
                    type="text"
                    name="version"
                    value={dependencyForm.version}
                    onChange={(e) => handleDependencyFormChange(e, divIndex, depIndex)}
                  />
                </div>
                <div>
                  <label>RelationShipType:</label>
                  <input
                    type="text"
                    name="relationShipType"
                    value={dependencyForm.relationShipType}
                    onChange={(e) => handleDependencyFormChange(e, divIndex, depIndex)}
                  />
                </div>
                <div>
                  <label>Related IcePack:</label>
                  <input
                    type="text"
                    name="relatedIcePack"
                    value={dependencyForm.relatedIcePack}
                    onChange={(e) => handleDependencyFormChange(e, divIndex, depIndex)}
                  />
                </div>

                {divForm.dependencyForms.length && (
                  <div>
                    <button
                      type="button"
                      onClick={() => handleDeleteDependencyForm(divIndex, depIndex)}
                    >
                      Delete Dependency Form
                    </button>
                  </div>
                )}
              </div>
            ))}

            {mainForm.divForms.length && (
              <div>
                <button
                  type="button"
                  onClick={() => handleAddDependencyForm(divIndex)}
                >
                  Add Dependency Form
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteDivForm(divIndex)}
                >
                  Delete Div Form
                </button>
              </div>
            )}
          </div>
        ))}

        <div>
          <button
            type="button"
            onClick={handleAddDivForm}
          >
            Add Div Fosssrm
          </button>
        </div>


        <div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </form>
  </div>
  );
};
export default MyForm;