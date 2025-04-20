import React from 'react'
import {styled} from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import {grey} from '@mui/material/colors'
import UserInfo from '../entities/users/UserInfo'
import Avatar from '@mui/material/Avatar'
import DueProjectsTable from '../entities/users/DueProjectsTable'

const Item = styled(Paper)(({theme}) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}))

function ComponentImg() {
  return (
    <Avatar
      alt="Public_Avatar"
      src="https://avatar.iran.liara.run/public/35"
      sx={{width: 250, height: 250}}
    />
  )
}

function ComponentA() {
  return <UserInfo />
}

function ComponentB() {
  return <DueProjectsTable />
}

function ComponentC() {
  return (
    <Item>
      <Typography variant="h6">Details</Typography>
      <Typography variant="body2">Feature not added yet</Typography>
    </Item>
  )
}

function UserPage() {
  return (
    <Box sx={{flexGrow: 1, height: 'auto', backgroundColor: grey[100]}}>
      <Grid container spacing={2} style={{height: 'auto'}}>
        <Grid size={4} style={{height: 'auto'}}>
          <Grid container direction="row" style={{height: 'auto'}}>
            <Grid size={12} style={{height: 'auto', alignContent: 'auto', padding: 5}}>
              <ComponentImg />
            </Grid>
            <Grid size={12} style={{height: 'calc(auto - auto)', alignContent: 'center'}}>
              <ComponentA />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={8} style={{height: 'auto'}}>
          <Grid container direction="row" style={{height: 'auto'}}>
            <Grid size={12} style={{height: 'auto', alignContent: 'center', padding: 12}}>
              <Typography variant="h6">Due Projects</Typography>
              <ComponentB />
            </Grid>
            <Grid size={12} style={{height: 'auto', alignContent: 'center', padding: 12}}>
              <ComponentC />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default UserPage
