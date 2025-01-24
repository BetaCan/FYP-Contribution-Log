import React from "react";
import { useParams } from "react-router-dom";
import Logs from "./Logs.js";

export default function ProjectLogsPage() {
  const { projectId } = useParams();

  return (
    <div>
      <h1>Logs for Project {projectId}</h1>
      <Logs projectId={projectId} />
    </div>
  );
}
