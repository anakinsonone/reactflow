import { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";

const FilterDataPortal = ({
  successToast,
  showPortal,
  hidePortal,
}: {
  successToast: () => void;
  showPortal: boolean;
  hidePortal: () => void;
}) => {
  const [workflows, setWorkflows] = useState<string[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState(null);

  // function to save the current selected file to state
  const handleFileChange = (event) => {
    console.log(event.target.files);
    setSelectedFile(event.target.files[0]);
  };

  // useEffect for fetching already stored workflows
  useEffect(() => {
    axios
      .get("https://reactflow-backend.onrender.com/api/workflows")
      .then((res) => {
        setWorkflows(res.data);
        setSelectedWorkflow(res.data[0]);
      });
  }, []);

  // api call for executing a selected workflow
  const runWorkflow = () => {
    console.log(selectedFile);
    console.log(selectedWorkflow);
    const formData = new FormData();
    formData.append("id", selectedWorkflow);
    formData.append("file", selectedFile);
    axios
      .post(
        "https://reactflow-backend.onrender.com/api/workflows/run",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then((res) => {
        console.log(res.data);
        hidePortal();
        successToast();
      })
      .catch((err) => console.log(err));
  };

  return (
    showPortal && (
      <div className="portal">
        <div className="portal-content">
          <h2>Run Workflow</h2>
          <form onSubmit={runWorkflow}>
            <label htmlFor="fileInput">Upload File</label>
            <input
              type="file"
              id="fileInput"
              accept=".csv"
              onChange={handleFileChange}
            />
            <label htmlFor="workflowSelect">Select Workflow</label>
            <select
              id="workflowSelect"
              onChange={(e) => {
                setSelectedWorkflow(e.target.value);
                console.log(e.target.value);
              }}
            >
              {workflows.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <div className="run-workflow-panel">
              <button type="button" onClick={hidePortal}>
                Close
              </button>
              <button type="button" onClick={runWorkflow}>
                Run Workflow
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default FilterDataPortal;
