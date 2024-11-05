import { Box, CssBaseline } from '@mui/material'
import ConfigForm from './components/ConfigForm'
import Sidebar from './components/SideBar'
import { useState } from 'react'
import { Runner } from './components/Runner'

const specollate = `${await window.electron.getEnvVariable('SPECOLLATE')} -c ${await window.electron.getEnvVariable('SPECOLLATE_CONFIG')}`

const proteorift = `${await window.electron.getEnvVariable('PROTEORIFT')} -c ${await window.electron.getEnvVariable('SPECOLLATE_CONFIG')}`

function App(): JSX.Element {
  const [show, setShow] = useState(false)

  const runCommand = (gpu: boolean) => {
    setShow(true)
    if (gpu) {
      window.electron.runCmd(`CUDA_VISIBLE_DEVICES="" ${proteorift}`)
    } else {
      window.electron.runCmd(proteorift)
    }
  }

  return (
    <Box textAlign={'center'}>
      <CssBaseline />
      <Sidebar />
      <main style={{ marginLeft: 240, flexGrow: 1, padding: '16px' }}>
        <ConfigForm run={runCommand} />

        {show && <Runner handleClose={setShow} />}
      </main>
    </Box>
  )
}

export default App
