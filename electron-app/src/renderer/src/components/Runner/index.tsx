import { Box, Modal, Typography, CircularProgress, Button } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  width: '75%',
  maxHeight: '80%',
  overflow: 'auto'
}

export const Runner = ({ handleClose }: { handleClose: any }) => {
  const [result, setResult] = useState('')
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState<boolean>(true)
  const outputRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const handleCmdOutput = (data: any) => {
      setOutput((prev) => (prev ? `${prev}\n${data}` : data))

      if (data.includes('Process exited with code')) {
        if (data.includes('Process exited with code 0')) setResult('Success')
        else setResult('Failed')

        setIsRunning(false)
      }
    }

    // Add the event listener
    window.electron.onCmdOutput(handleCmdOutput)

    // Cleanup function to remove the event listener
    return () => {
      window.electron.offCmdOutput(handleCmdOutput)
    }
  }, [])

  const handleTerminate = () => {
    window.electron.terminateCmd()
    handleClose(false)
  }

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="terminal-modal-title"
      aria-describedby="terminal-modal-description"
    >
      <Box sx={style}>
        <Typography id="terminal-modal-title" variant="h6" component="h2">
          Running ProteoRift
        </Typography>
        <Typography id="terminal-modal-description" sx={{ mb: 2 }}>
          Output from command:
        </Typography>
        {isRunning ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2">Processing...</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="body2">{result}</Typography>
          </Box>
        )}
        <pre
          ref={outputRef}
          style={{
            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
            background: '#f4f4f4',
            padding: '8px',
            borderRadius: '4px',
            maxHeight: '400px',
            overflow: 'auto'
          }}
        >
          {output || 'Waiting for output...'}
        </pre>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" color="error" onClick={handleTerminate}>
            {isRunning ? 'Terminate' : 'Close'}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
