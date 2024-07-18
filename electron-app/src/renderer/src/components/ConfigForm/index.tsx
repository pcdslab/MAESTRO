/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useForm } from 'react-hook-form'
import { TextField, Button, FormControlLabel, Checkbox, Container, Typography } from '@mui/material'

const ConfigForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" gutterBottom>
        Configuration Settings
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          margin="normal"
          fullWidth
          label="Spectrum Size"
          variant="outlined"
          {...register('spec_size', { required: true })}
          error={!!errors.spec_size}
          helperText={errors.spec_size ? 'This field is required' : ''}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Max Charge"
          variant="outlined"
          {...register('charge', { required: true })}
          error={!!errors.charge}
          helperText={errors.charge ? 'This field is required' : ''}
        />
        <FormControlLabel
          control={<Checkbox {...register('use_mods')} />}
          label="Use Modifications"
        />
        <TextField
          margin="normal"
          fullWidth
          label="Max Mods per Peptide"
          variant="outlined"
          {...register('num_mods', { required: true })}
          error={!!errors.num_mods}
          helperText={errors.num_mods ? 'This field is required' : ''}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Master Port"
          variant="outlined"
          {...register('master_port', { required: true })}
          error={!!errors.master_port}
          helperText={errors.master_port ? 'This field is required' : ''}
        />
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </form>
    </Container>
  )
}

export default ConfigForm
