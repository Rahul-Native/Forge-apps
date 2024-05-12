import React, { useState } from 'react';
import { invoke } from '@forge/bridge';  
import './App.css';

const MyForm = () => {
  const [mainForm, setMainForm] = useState({
    moduleName: '',
    productionState: '',
    buildName: '',
    ecuName: '',
    canRx: '',
    divForms: [],
  });


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
  };

  const handleSubmit = async (e) => {
    try {
      console.log('Form Data:', mainForm, JSON.stringify(mainForm));
      invoke('handler', { icePackRequestForm: mainForm, buildName: mainForm.buildName, moduleName: mainForm.moduleName, icePackJsonName: `spo_${mainForm.moduleName.toLowerCase()}_icepack.json` })
      .then((data) => console.log('invoke success', data))
      .catch((error)=>console.error('Error invoking resolver:', error))
    } catch (error) {
      console.error('Error invoking resolver:', error);
    }
  };

  return (
    <div>
      <h2>Main Form</h2>
      <form onSubmit={handleSubmit}>
      <div class="form-group">
  <label for="moduleName">Module Name:</label>
  <select
    class="form-control"
    id="moduleName"
    name="moduleName"
    value={mainForm.moduleName}
    onChange={handleMainFormChange}
  >
    <option value="">Select</option>
    <option value="Module1">Module1</option>
    <option value="Module2">Module2</option>
  </select>
      </div>
      <div class="form-group">
        <label for="productionState">Production State:</label>
        <select
          class="form-control"
          id="productionState"
          name="productionState"
          value={mainForm.productionState}
          onChange={handleMainFormChange}
        >
          <option value="">Select</option>
          <option value="Production">Production</option>
          <option value="Development">Development</option>
        </select>
      </div>
      <div class="form-group">
        <label for="buildName">Jenkins Build Name:</label>
        <input
          type="text"
          class="form-control"
          id="buildName"
          name="buildName"
          value={mainForm.buildName}
          onChange={handleMainFormChange}
        />
      </div>
      <div class="form-group">
        <label for="ecuName">ECU Name:</label>
        <input
          type="text"
          class="form-control"
          id="ecuName"
          name="ecuName"
          value={mainForm.ecuName}
          onChange={handleMainFormChange}
        />
      </div>
      <div class="form-group">
        <label for="canRx">Can Rx:</label>
        <input
          type="text"
          class="form-control"
          id="canRx"
          name="canRx"
          value={mainForm.canRx}
          onChange={handleMainFormChange}
        />
      </div>


        {mainForm && mainForm.divForms && mainForm.divForms.map((divForm, divIndex) => (
          <div key={divIndex}>
            <h3>Div Form {divIndex + 1}</h3>
            <div class="form-group">
              <label>Domain Instance Name:</label>
              <input
                    class="form-control"
                type="text"
                name="domainInstanceName"
                value={divForm.domainInstanceName}
                onChange={(e) => handleDivFormChange(e, divIndex)}
              />
            </div>
            <div class="form-group">
              <label>Domain Instance Version:</label>
              <input
                    class="form-control"
                type="text"
                name="domainInstanceVersion"
                value={divForm.domainInstanceVersion}
                onChange={(e) => handleDivFormChange(e, divIndex)}
              />
            </div>
            <div class="form-group">
              <label>Program Code:</label>
              <input
                    class="form-control"
                type="text"
                name="programCode"
                value={divForm.programCode}
                onChange={(e) => handleDivFormChange(e, divIndex)}
              />
            </div>
            <div class="form-group">
              <label>Model Year:</label>
              <input
                    class="form-control"
                type="text"
                name="modelYear"
                value={divForm.modelYear}
                onChange={(e) => handleDivFormChange(e, divIndex)}
              />
            </div>
            <div class="form-group">
              <label>PartII Specification:</label>
              <input
                    class="form-control"
                type="text"
                name="partIISpecification"
                value={divForm.partIISpecification}
                onChange={(e) => handleDivFormChange(e, divIndex)}
              />
            </div>
            <div class="form-group">
              <label>Hardware Parts:</label>
              <input
                    class="form-control"
                type="text"
                name="hardwareParts"
                value={divForm.hardwareParts}
                onChange={(e) => handleDivFormChange(e, divIndex)}
              />
            </div>
            <div class="form-group">
              <label>Related Applications:</label>
              <input
                    class="form-control"
                type="text"
                name="relatedApplications"
                value={divForm.relatedApplications}
                onChange={(e) => handleDivFormChange(e, divIndex)}
              />
            </div>

            {divForm.dependencyForms.map((dependencyForm, depIndex) => (
              <div key={depIndex}>
                <h4>Dependency Form {depIndex + 1}</h4>
                <div class="form-group">
                  <label>Name:</label>
                  <input
                    class="form-control"
                    type="text"
                    name="name"
                    value={dependencyForm.name}
                    onChange={(e) => handleDependencyFormChange(e, divIndex, depIndex)}
                  />
                </div>
                <div class="form-group">
                  <label>Version:</label>
                  <input
                    class="form-control"
                    type="text"
                    name="version"
                    value={dependencyForm.version}
                    onChange={(e) => handleDependencyFormChange(e, divIndex, depIndex)}
                  />
                </div>
                <div class="form-group">
                  <label>RelationShipType:</label>
                  <input
                    class="form-control"
                    type="text"
                    name="relationShipType"
                    value={dependencyForm.relationShipType}
                    onChange={(e) => handleDependencyFormChange(e, divIndex, depIndex)}
                  />
                </div>
                <div class="form-group">
                  <label>Related IcePack:</label>
                  <input
                    class="form-control"
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
                      className="primary-button"
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
                  className="primary-button"
                  onClick={() => handleAddDependencyForm(divIndex)}
                >
                  Add Dependency Form
                </button>
                <button
                  type="button"
                  className="primary-button"
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
            className="primary-button"
            onClick={handleAddDivForm}
          >
            Add Div Fosssrm
          </button>
        </div>


        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
  </div>
  );
};
export default MyForm;