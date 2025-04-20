import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import Chip from '@mui/material/Chip'

/**
 * Determine background color based on score threshold
 * 
 * @param {number} score - The score to evaluate
 * @param {Object} thresholds - Custom thresholds for color ranges
 * @returns {string} - The appropriate background color
 */
const getColorByScore = (score, thresholds) => {
  const { high, good, medium } = thresholds;
  
  if (score >= high) {
    return '#81c784'; // Green for high scores
  } else if (score >= good) {
    return '#aed581'; // Light green for good scores
  } else if (score >= medium) {
    return '#ffd54f'; // Yellow for medium scores
  } else {
    return '#e57373'; // Red for low scores
  }
};

/**
 * A reusable score indicator component that shows scores with appropriate coloring
 */
export default function ScoreIndicator({ 
  score,
  format = 'percent',
  thresholds = { high: 90, good: 80, medium: 70 },
  size = 'medium'
}) {
  // Format the score based on format type
  const formattedScore = formatScore(score, format);
  
  // Get the color based on the score value
  const backgroundColor = getColorByScore(score, thresholds);
  
  return (
    <Chip
      label={formattedScore}
      sx={{
        backgroundColor,
        color: backgroundColor === '#ffd54f' ? '#000' : '#fff',
        fontWeight: 'bold',
        height: size === 'small' ? '24px' : '32px',
        fontSize: size === 'small' ? '0.75rem' : '0.875rem'
      }}
    />
  );
}

/**
 * Format score value based on the specified format
 */
export const formatScore = (score, format) => {
  switch (format) {
    case 'percent':
      return `${Number(score).toFixed(0)}%`;
    case 'decimal':
      return Number(score).toFixed(1);
    case 'raw':
      return score.toString();
    default:
      return `${Number(score).toFixed(0)}%`;
  }
};

// PropTypes definition
ScoreIndicator.propTypes = {
  score: PropTypes.number.isRequired,
  format: PropTypes.oneOf(['percent', 'decimal', 'raw']),
  thresholds: PropTypes.shape({
    high: PropTypes.number,
    good: PropTypes.number,
    medium: PropTypes.number
  }),
  size: PropTypes.oneOf(['small', 'medium'])
};
