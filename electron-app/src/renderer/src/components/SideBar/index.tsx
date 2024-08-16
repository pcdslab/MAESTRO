// Sidebar.js
import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ListIcon from '@mui/icons-material/List'
import { styled } from '@mui/material/styles'

const drawerWidth = 240

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box'
  }
}))

const Toolbar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2, 1),
  ...theme.mixins.toolbar
}))

const Sidebar = () => {
  return (
    <StyledDrawer variant="permanent" anchor="left">
      <Toolbar>
        <Typography variant="h6">Mastro</Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="Previous Runs Data" />
        </ListItem>
      </List>
    </StyledDrawer>
  )
}

export default Sidebar
