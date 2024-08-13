import { Box, Button, CssBaseline, Typography } from '@mui/material'
import ConfigForm from './components/ConfigForm'
import Sidebar from './components/SideBar'
import { useEffect, useState } from 'react'
import { Runner } from './components/Runner'

const specollate = import.meta.env.VITE_SPECOLLATE

console.log(specollate)


function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const [show, setShow] = useState(false)

  const runCommand = () => {
    setShow(true)
    window.electron.runCmd(specollate)
  }

  return (
    <Box textAlign={'center'}>
      <CssBaseline />
      <Sidebar />
      <main style={{ marginLeft: 240, flexGrow: 1, padding: '16px' }}>
        <ConfigForm />
        <Button onClick={() => runCommand()}>Click</Button>

        {show && <Runner handleClose={setShow} />}
      </main>
    </Box>
  )
}

export default App
