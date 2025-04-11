import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import API from '../../api/API.js';

export default function ProjectLogsTable({ logs, viewMode, projectId, sprintId }) {
  const [selectedLog, setSelectedLog] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleRemove = async (logId) => {
    try {
      const response = await API.delete(`/projectlogs/${logId}`);
      if (response.isSuccess) {
        // Refresh the page or update the logs list
        window.location.reload();
      } else {
        console.error('Failed to delete log:', response.message);
        alert('Failed to delete log: ' + response.message);
      }
    } catch (error) {
      console.error('Error deleting log:', error);
      alert('Error deleting log: ' + error.message);
    }
    setDialogOpen(false);
  };
  
  const openDialog = (log) => {
    setSelectedLog(log);
    setDialogOpen(true);
  };
  
  const closeDialog = () => {
    setDialogOpen(false);
  };
  
  // Different table layouts based on viewMode
  const renderTable = () => {
    switch (viewMode) {
      case 'overview':
        return renderOverviewTable();
      case 'team':
        return renderTeamTable();
      case 'engagement':
        return renderEngagementTable();
      default:
        return renderOverviewTable();
    }
  };
  
  const renderOverviewTable = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="project logs table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Log Type</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No logs found for this sprint
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.LogID}>
                <TableCell>{log.LogID}</TableCell>
                <TableCell>{log.LogTitle}</TableCell>
                <TableCell>{log.LogTypeName || log.Log_LogTypeID}</TableCell>
                <TableCell>{log.LogDescription}</TableCell>
                <TableCell>{new Date(log.LogCreatedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => openDialog(log)}
                  >
                    REMOVE
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
  
  const renderTeamTable = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="team view table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} align="center">
              Team view will be implemented in future updates
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
  
  const renderEngagementTable = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="engagement view table">
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Attendance Score</TableCell>
            <TableCell>Task Completion</TableCell>
            <TableCell>Feedback Score</TableCell>
            <TableCell>Total Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} align="center">
              Engagement metrics will be implemented in future updates
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
  
  return (
    <>
      {renderTable()}
      
      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Removal"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this log entry?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button 
            onClick={() => selectedLog && handleRemove(selectedLog.LogID)} 
            autoFocus
            color="error"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
