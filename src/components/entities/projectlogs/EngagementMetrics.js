import {useState, useEffect} from 'react'
import API from '../../api/API' // Adjust path as needed
import TabsContainer from '../../UI-MaterialUINEW/tabs-component'
import DataTable from '../../UI-MaterialUINEW/data-table'
import ScoreIndicator from '../../UI-MaterialUINEW/score-indicator'
import SectionContainer from '../../UI-MaterialUINEW/section-container'
import AttendanceTracker from '../projectlogs/AttendanceTracker'
import TaskCompletionTracker from './TaskCompletionTracker'
import {Typography} from '@mui/material'

/**
 * TeamMetricsTab - Displays metrics in a table format
 */
function TeamMetricsTab({projectId}) {
  const [metrics, setMetrics] = useState([])
  const [users, setUsers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch user information
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get('/users')
        if (response.isSuccess) {
          const userMap = response.result.reduce((map, user) => {
            map[user.UserID] = `${user.UserFirstName} ${user.UserLastName}`
            return map
          }, {})
          setUsers(userMap)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  // Fetch metrics data
  useEffect(() => {
    if (!projectId) return

    const fetchMetrics = async () => {
      setLoading(true)
      try {
        const response = await API.get(`/engagementmetrics/project/${projectId}`)
        if (response.isSuccess) {
          setMetrics(response.result)
          setError(null)
        } else {
          setError('Failed to load metrics data: ' + response.message)
        }
      } catch (error) {
        console.error('Error loading engagement metrics:', error)
        setError('Error loading engagement metrics')
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [projectId])

  // Table column definitions
  const columns = [
    {
      id: 'teamMember',
      label: 'Team Member',
    },
    {
      id: 'attendance',
      label: 'Attendance',
      align: 'center',
      format: (value) => <ScoreIndicator score={value} />,
    },
    {
      id: 'taskCompletion',
      label: 'Task Completion',
      align: 'center',
      format: (value) => <ScoreIndicator score={value} />,
    },
    {
      id: 'feedback',
      label: 'Feedback',
      align: 'center',
      format: (value) => <ScoreIndicator score={value} />,
    },
    {
      id: 'overall',
      label: 'Overall',
      align: 'center',
      format: (value) => <ScoreIndicator score={value} />,
    },
  ]

  // Prepare data for the table
  const tableData = metrics.map((metric) => ({
    id: metric.MetricID,
    teamMember: users[metric.Metric_UserID] || `User ${metric.Metric_UserID}`,
    attendance: parseFloat(metric.MetricAttendanceScore),
    taskCompletion: parseFloat(metric.MetricTaskCompletionScore),
    feedback: parseFloat(metric.MetricFeedbackScore),
    overall: parseFloat(metric.MetricTotalScore),
  }))

  return (
    <DataTable
      columns={columns}
      data={tableData}
      loading={loading}
      error={error}
      emptyMessage="No engagement metrics available for this project."
    />
  )
}

/**
 * TeamAttendanceTab - Simplified attendance tracking
 */
function TeamAttendanceTab({projectId, selectedSprint}) {
  return <AttendanceTracker sprintId={selectedSprint} />
}

export default function EngagementMetrics({projectId}) {
  // Get selectedSprint from the project context or parent component
  const [selectedSprint, setSelectedSprint] = useState(null)

  // Fetch the first sprint for this project when component mounts
  useEffect(() => {
    if (!projectId) return

    const fetchFirstSprint = async () => {
      try {
        const response = await API.get(`/sprints/project/${projectId}`)
        if (response.isSuccess && response.result.length > 0) {
          setSelectedSprint(response.result[0].SprintID)
        }
      } catch (error) {
        console.error('Error fetching sprints:', error)
      }
    }

    fetchFirstSprint()
  }, [projectId])

  /**
   * TaskCompletionsTab - Task completion tracking
   */
  function TaskCompletionsTab({projectId, selectedSprint}) {
    return <TaskCompletionTracker sprintId={selectedSprint} />
  }

  // Define tabs configuration
  const tabs = [
    {
      label: 'Team Attendance',
      content: selectedSprint ? (
        <TeamAttendanceTab projectId={projectId} selectedSprint={selectedSprint} />
      ) : (
        <Typography>Loading sprint data...</Typography>
      ),
    },
    {
      label: 'Task Completion',
      content: <TaskCompletionsTab projectId={projectId} selectedSprint={selectedSprint} />,
    },
    {
      label: 'Team Metrics',
      content: <TeamMetricsTab projectId={projectId} />,
    },
  ]

  return (
    <SectionContainer title="Engagement Metrics">
      <TabsContainer tabs={tabs} />
    </SectionContainer>
  )
}
