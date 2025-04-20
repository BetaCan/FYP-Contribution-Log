import { useState } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

// Custom styled tabs for better appearance
const StyledTabs = styled(Tabs)({
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
  '& .MuiTabs-indicator': {
    display: 'none',
  },
});

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'uppercase',
  fontWeight: 500,
  fontSize: '0.875rem',
  padding: theme.spacing(1.5, 3),
  borderRadius: '4px',
  color: '#000',
  '&.Mui-selected': {
    backgroundColor: '#4a77e5',
    color: '#fff',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(74, 119, 229, 0.32)',
  },
}));

// Component for custom tab panels
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

/**
 * A reusable tabs container component
 * 
 * @param {Object} props - Component props
 * @param {Array} props.tabs - Array of tab configurations [{label: string, content: React.Node}]
 * @param {Function} props.onChange - Optional callback when tab changes
 * @param {number} props.defaultTab - Optional default selected tab index (defaults to 0)
 */
export default function TabsContainer({ tabs, onChange, defaultTab = 0 }) {
  const [tabValue, setTabValue] = useState(defaultTab);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };
  
  if (!tabs || tabs.length === 0) {
    return null;
  }
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 0 }}>
        <StyledTabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="tabs"
          variant="fullWidth"
        >
          {tabs.map((tab, index) => (
            <StyledTab key={index} label={tab.label} id={`tab-${index}`} aria-controls={`tab-panel-${index}`} />
          ))}
        </StyledTabs>
      </Box>
      
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={tabValue} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
}
