import React, {useState, useEffect, useCallback, useContext} from "react";
import {styled} from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import UserContext from "../../../context/UserContext.js";
import API from "../../api/API.js";

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
  },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function DueProjectsTable() {
  const {loggedInUser} = useContext(UserContext);
  const loggedInUserID = loggedInUser?.UserID;

  const [projects, setProjects] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState("Loading records...");

  const loadProjects = useCallback(async () => {
    if (loggedInUserID) {
      const getProjectsEndpoint = `/projects/user/${loggedInUserID}`;
      const response = await API.get(getProjectsEndpoint);
      if (response.isSuccess) {
        const formattedProjects = response.result.map((project) => ({
          ...project,
          ProjectStartDate: new Date(project.ProjectStartDate).toISOString().slice(0, 10),
          ProjectEndDate: new Date(project.ProjectEndDate).toISOString().slice(0, 10),
        }));
        setProjects(formattedProjects);
      } else {
        setLoadingMessage(response.message);
      }
    }
  }, [loggedInUserID]);

  useEffect(() => {
    loadProjects();
  }, [loggedInUserID, loadProjects]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 700}} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Project Name</StyledTableCell>
            <StyledTableCell align="right">Start Date</StyledTableCell>
            <StyledTableCell align="right">End Date</StyledTableCell>
            <StyledTableCell align="right">Overseer</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.length > 0 ? (
            projects.map((project) => (
              <StyledTableRow key={project.ProjectID}>
                <StyledTableCell component="th" scope="row">
                  {project.ProjectName}
                </StyledTableCell>
                <StyledTableCell align="right">{project.ProjectStartDate}</StyledTableCell>
                <StyledTableCell align="right">{project.ProjectEndDate}</StyledTableCell>
                <StyledTableCell align="right">{project.ProjectOverseerName}</StyledTableCell>
                <StyledTableCell align="right">{project.ProjectStatusName}</StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell colSpan={5} align="center">
                {loadingMessage}
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
