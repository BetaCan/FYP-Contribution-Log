import React from 'react';
import PropTypes from 'prop-types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

/**
 * A reusable metrics chart component to visualize data trends
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of data objects for the chart
 * @param {string} props.type - Chart type (line, area, bar)
 * @param {string} props.xAxisKey - Data key for the X axis
 * @param {Array} props.series - Array of series definitions with { key, name, color }
 * @param {string} props.title - Optional chart title
 * @param {boolean} props.loading - Whether data is loading
 * @param {string} props.error - Error message, if any
 * @param {string} props.emptyMessage - Message to display when no data is available
 * @param {Object} props.options - Additional chart configuration options
 */
export default function MetricsChart({
  data,
  type = 'line',
  xAxisKey,
  series,
  title,
  loading = false,
  error = null,
  emptyMessage = 'No data available',
  options = {}
}) {
  // Handle loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Typography color="error" sx={{ p: 3, textAlign: 'center' }}>
        {error}
      </Typography>
    );
  }

  // Handle empty data state
  if (!data || data.length === 0) {
    return (
      <Typography sx={{ p: 3, textAlign: 'center' }}>
        {emptyMessage}
      </Typography>
    );
  }

  // Extract chart options with defaults
  const {
    height = 400,
    yAxisDomain = [0, 'auto'],
    yAxisLabel,
    tooltipFormatter,
    gridLines = true,
    showLegend = true,
    paperProps = { elevation: 0, variant: 'outlined' }
  } = options;

  // Select chart component based on type
  const ChartComponent = {
    line: LineChart,
    area: AreaChart,
    bar: BarChart
  }[type] || LineChart;

  // Select series component based on type
  const SeriesComponent = {
    line: Line,
    area: Area,
    bar: Bar
  }[type] || Line;

  return (
    <Paper {...paperProps} sx={{ p: 3, ...paperProps.sx }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          {title}
        </Typography>
      )}
      
      <Box sx={{ height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            {gridLines && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis 
              domain={yAxisDomain} 
              label={yAxisLabel && { 
                value: yAxisLabel, 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            <Tooltip formatter={tooltipFormatter} />
            {showLegend && <Legend />}
            
            {series.map((item) => (
              <SeriesComponent
                key={item.key}
                type={item.type || "monotone"}
                dataKey={item.key}
                name={item.name || item.key}
                stroke={item.color}
                fill={item.color}
                activeDot={item.activeDot || { r: 8 }}
                strokeWidth={item.strokeWidth || 2}
              />
            ))}
          </ChartComponent>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

// PropTypes definition
MetricsChart.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.oneOf(['line', 'area', 'bar']),
  xAxisKey: PropTypes.string.isRequired,
  series: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string,
      color: PropTypes.string.isRequired,
      type: PropTypes.string,
      activeDot: PropTypes.object,
      strokeWidth: PropTypes.number
    })
  ).isRequired,
  title: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.string,
  emptyMessage: PropTypes.string,
  options: PropTypes.object
};
