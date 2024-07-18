import { Box, Typography } from '@mui/material'
import ConfigForm from './components/ConfigForm'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <Box textAlign={'center'}>
      <Typography variant="h2">Mastro</Typography>
      <ConfigForm />
    </Box>
  )
}

export default App
