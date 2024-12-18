// Sidebar.js
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import { styled } from '@mui/material/styles'
import logo from '../../assets/logo-1.png'

const drawerWidth = 240

const StyledDrawer = styled(Drawer)(() => ({
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
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Toolbar>
          <Typography variant="h6">
            <b>MAESTRO</b>
          </Typography>
        </Toolbar>
        <Divider />
        <List sx={{ flexGrow: 1 }}>
          <ListItem>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          {/* <ListItem button>
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="Previous Runs Data" />
      </ListItem> */}
        </List>
        <Box sx={{ p: 2 }}>
          <img src={logo} width={150} />
        </Box>
      </Box>
    </StyledDrawer>
  )
}

export default Sidebar
