import { TextField } from '@mui/material'

const FolderSelector = ({
  label,
  onChange,
  value,
  error
}: {
  label?: string
  onChange?: any
  value?: string
  error?: any
}) => {
  const handleSelectFolder = async () => {
    const folder = await window.electron.ipcRenderer.invoke('select-folder')
    if (folder) {
      onChange(folder)
      return folder
    }
  }

  return (
    <div>
      <TextField
        margin="normal"
        fullWidth
        label={label}
        variant="outlined"
        value={value || ''}
        error={error}
        InputLabelProps={{ shrink: Boolean(value) }}
        helperText={error}
        onClick={handleSelectFolder}
      />
    </div>
  )
}

export default FolderSelector
