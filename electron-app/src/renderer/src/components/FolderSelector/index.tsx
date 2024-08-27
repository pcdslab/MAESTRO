import React from 'react'
import { FolderOpen } from '@mui/icons-material'
import { Box, IconButton, TextField } from '@mui/material'

// eslint-disable-next-line react/display-name
const FolderSelector = React.forwardRef(
  (
    {
      label,
      onChange,
      value,
      error
    }: {
      label?: string
      onChange?: (value: string) => void
      value?: string
      error?: string
    },
    ref: React.Ref<HTMLInputElement>
  ) => {
    const handleSelectFolder = async () => {
      const folder = await window.electron.ipcRenderer.invoke('select-folder')
      if (folder) {
        onChange && onChange(folder) // Ensure onChange is called only if it exists
      }
    }

    return (
      <Box display="flex" alignItems="center">
        <TextField
          margin="normal"
          fullWidth
          label={label}
          variant="outlined"
          value={value || ''}
          error={Boolean(error)} // Correctly use error prop as a boolean
          InputLabelProps={{ shrink: Boolean(value) }}
          helperText={error} // Display error as helper text
          ref={ref} // Pass ref to TextField
          onChange={(e) => onChange && onChange(e.target.value)}
        />
        <IconButton onClick={handleSelectFolder} aria-label="Open folder">
          <FolderOpen />
        </IconButton>
      </Box>
    )
  }
)

export default FolderSelector
