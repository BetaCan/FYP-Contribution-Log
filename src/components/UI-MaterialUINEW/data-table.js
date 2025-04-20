import React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * A reusable data table component with support for loading and error states
 * 
 * @param {Object} props - Component props
 * @param {Array} props.columns - Array of column definitions with { id, label, align, format }
 * @param {Array} props.data - Array of data objects to display
 * @param {boolean} props.loading - Whether data is loading
 * @param {string} props.error - Error message, if any
 * @param {string} props.emptyMessage - Message to display when no data is available
 */
export default function DataTable({ 
  columns, 
  data, 
  loading = false, 
  error = null, 
  emptyMessage = 'No data available', 
  elevation = 0,
  variant = 'outlined'
}) {
  // Display loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Display error state
  if (error) {
    return (
      <Typography color="error" sx={{ p: 3 }}>
        {error}
      </Typography>
    );
  }

  // Display empty state
  if (!data || data.length === 0) {
    return (
      <Typography sx={{ p: 3, textAlign: 'center' }}>
        {emptyMessage}
      </Typography>
    );
  }

  // Helper function to safely get cell value and apply formatting
  const getCellContent = (row, column) => {
    const value = row[column.id];
    if (column.format && value !== undefined && value !== null) {
      return column.format(value, row);
    }
    return value;
  };

  return (
    <TableContainer component={Paper} elevation={elevation} variant={variant}>
      <Table sx={{ minWidth: 650 }} aria-label="data table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            {columns.map((column) => (
              <TableCell 
                key={column.id} 
                align={column.align || 'left'}
                sx={column.headSx}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={row.id || rowIndex}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, ...row.rowSx }}
            >
              {columns.map((column) => (
                <TableCell 
                  key={`${rowIndex}-${column.id}`} 
                  align={column.align || 'left'}
                  sx={column.cellSx}
                >
                  {getCellContent(row, column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// PropTypes definition
DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      format: PropTypes.func,
      headSx: PropTypes.object,
      cellSx: PropTypes.object
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  emptyMessage: PropTypes.string,
  elevation: PropTypes.number,
  variant: PropTypes.oneOf(['outlined', 'elevation'])
};
