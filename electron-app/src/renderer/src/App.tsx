import { Box, CssBaseline } from '@mui/material'
import ConfigForm from './components/ConfigForm'
import Sidebar from './components/SideBar'
import { useState } from 'react'
import { Runner } from './components/Runner'

const specollate = `${await window.electron.getEnvVariable('SPECOLLATE')} -c ${await window.electron.getEnvVariable('SPECOLLATE_CONFIG')}`

console.log(specollate)

function App(): JSX.Element {
  const [show, setShow] = useState(false)

  const runCommand = (gpu: boolean) => {
    setShow(true)
    if (gpu) {
      window.electron.runCmd(`${specollate} -u gpu`)
    } else {
      window.electron.runCmd(specollate)
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
