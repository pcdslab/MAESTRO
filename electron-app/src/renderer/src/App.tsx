import { Box, CssBaseline } from '@mui/material'
import ConfigForm from './components/ConfigForm'
import Sidebar from './components/SideBar'
import { useState } from 'react'
import { Runner } from './components/Runner'

const specollate = `${await window.electron.getEnvVariable('SPECOLLATE')} -c ${await window.electron.getEnvVariable('SPECOLLATE_CONFIG')}`

const proteorift = `${await window.electron.getEnvVariable('PROTEORIFT')} -c ${await window.electron.getEnvVariable('SPECOLLATE_CONFIG')}`

function App(): JSX.Element {
  const [show, setShow] = useState(false)

  const runCommand = async (gpu: boolean) => {
    setShow(true)
    const isWindows = await window.electron.isWindows();

    let cmd;

    if (gpu) {
      cmd = proteorift
    } else {
      cmd = isWindows 
            ? `cmd /c "set CUDA_VISIBLE_DEVICES= & ${proteorift}"` // Windows format
            : `CUDA_VISIBLE_DEVICES="" ${proteorift}`;     // Linux/macOS format
    }

    console.log(cmd)

    window.electron.runCmd(cmd)
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
