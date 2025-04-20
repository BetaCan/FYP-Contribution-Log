import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

/**
 * A reusable section container component for consistent section styling
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Component children
 * @param {string} props.title - Section title
 * @param {Object} props.actions - Optional actions to display in the header
 * @param {Object} props.sx - Additional styling for the container
 * @param {number} props.elevation - Paper elevation (0 for flat)
 * @param {string} props.variant - Paper variant ('outlined' or 'elevation')
 */
export default function SectionContainer({
  children,
  title,
  actions,
  sx = {},
  elevation = 0,
  variant = 'outlined'
}) {
  return (
    <Paper
      elevation={elevation}
      variant={variant}
      sx={{
        p: 3,
        ...sx
      }}
    >
      {title && (
        <>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h5" component="h2">
              {title}
            </Typography>
            
            {actions && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {actions}
              </Box>
            )}
          </Box>
          
          <Divider sx={{ mb: 3 }} />
        </>
      )}
      
      {children}
    </Paper>
  );
}

// PropTypes definition
SectionContainer.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  actions: PropTypes.node,
  sx: PropTypes.object,
  elevation: PropTypes.number,
  variant: PropTypes.oneOf(['outlined', 'elevation'])
};
