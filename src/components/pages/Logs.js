import { useState, useEffect } from "react";
import API from "../api/API.js";
import "./Logs.scss"; // Import the SCSS file for styling

export default function Logs() {
  // State ------------------------------------------------------------------------------------------------------
  const [logs, setLogs] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("Loading records...");

  const loadLogs = async () => {
    const getLogsEndpoint = `/logs`;
    const response = await API.get(getLogsEndpoint);
    if (response.isSuccess) {
      setLogs(response.result);
    } else {
      setLoadingMessage(response.message);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  if (!logs) {
    return <p>{loadingMessage}</p>;
  }

  const displayableAttributes = [
    { key: "LogID", label: "ID" },
    { key: "LogTitle", label: "Title" },
    { key: "LogDate", label: "Date" },
    { key: "LogDescription", label: "Description" },
  ];

  return (
    <div className="logs-container">
      <h2>All Logs</h2>
      <table className="logs-table">
        <thead>
          <tr>
            {displayableAttributes.map((attr) => (
              <th key={attr.key}>{attr.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.LogID}>
              {displayableAttributes.map((attr) => (
                <td key={attr.key}>{log[attr.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
