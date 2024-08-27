import { useForm } from 'react-hook-form'
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import FolderSelector from '../FolderSelector'
import { configBuilder } from '@renderer/utils/helper'
import { useState } from 'react'

const ConfigForm = ({ run }: any) => {
  const [useGpu, setUseGpu] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      spec_batch_size: 16384,
      pep_batch_size: 4096,

      search_spec_batch_size: 1024,

      precursor_tolerance: 20,
      precursor_tolerance_type: 'ppm',

      keep_psms: 5,
      num_mods: 1,
      charge: 8
    } as any
  })

  console.log(errors)
  const onSubmit = (data) => {
    configBuilder(data)
    run()
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" gutterBottom>
        Configuration Settings
      </Typography>
      <Box sx={{ textAlign: 'left' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={useGpu}
              onChange={(e) => setUseGpu(e.target.checked)}
              name="useGpu"
              color="primary"
            />
          }
          label="Use GPU"
        />
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <FolderSelector
            label="MGF Directory"
            {...register('mgf_dir', { required: true })}
            error={errors.mgf_dir ? 'This field is required' : ''}
            onChange={(path) => setValue('mgf_dir', path, { shouldValidate: true })}
            value={watch('mgf_dir')}
          />
        </Box>
        <Box margin="normal">
          <FolderSelector
            label="Preprocessed Directory"
            {...register('prep_dir', { required: true })}
            error={errors.prep_dir ? 'This field is required' : ''}
            onChange={(path) => setValue('prep_dir', path, { shouldValidate: true })}
            value={watch('prep_dir')}
          />
        </Box>
        <Box margin="normal">
          <FolderSelector
            label="Peptide Directory"
            error={errors.pep_dir ? 'This field is required' : ''}
            {...register('pep_dir', { required: true })}
            onChange={(path) => setValue('pep_dir', path, { shouldValidate: true })}
            value={watch('pep_dir')}
          />
        </Box>
        <Box margin="normal">
          <FolderSelector
            label="Percolator Output Directory"
            {...register('out_pin_dir', { required: true })}
            error={errors.out_pin_dir ? 'This field is required' : ''}
            onChange={(path) => setValue('out_pin_dir', path, { shouldValidate: true })}
            value={watch('out_pin_dir')}
          />
        </Box>
        <TextField
          margin="normal"
          fullWidth
          label="Spectra Batch Size"
          variant="outlined"
          type="number"
          {...register('spec_batch_size', { required: true })}
          error={!!errors.spec_batch_size}
          helperText={errors.spec_batch_size ? 'This field is required' : ''}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Peptide Batch Size"
          variant="outlined"
          type="number"
          {...register('pep_batch_size', { required: true })}
          error={!!errors.pep_batch_size}
          helperText={errors.pep_batch_size ? 'This field is required' : ''}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Search Spectra Batch Size"
          variant="outlined"
          type="number"
          {...register('search_spec_batch_size', { required: true })}
          error={!!errors.search_spec_batch_size}
          helperText={errors.search_spec_batch_size ? 'This field is required' : ''}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Precursor Tolerance"
          variant="outlined"
          type="number"
          {...register('precursor_tolerance', { required: true })}
          error={!!errors.precursor_tolerance}
          helperText={errors.precursor_tolerance ? 'This field is required' : ''}
        />
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="precursor-tolerance-type-label">Precursor Tolerance Type</InputLabel>
          <Select
            sx={{ textAlign: 'left' }}
            labelId="precursor-tolerance-type-label"
            value={watch('precursor_tolerance_type')}
            onChange={(e) => setValue('precursor_tolerance_type', e.target.value)}
            label="Precursor Tolerance Type" // This is important to link the label
          >
            <MenuItem value="ppm">ppm</MenuItem>
            <MenuItem value="da">da</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          fullWidth
          label="Number of Top Scoring PSMs to Keep"
          variant="outlined"
          type="number"
          {...register('keep_psms', { required: true })}
          error={!!errors.keep_psms}
          helperText={errors.keep_psms ? 'This field is required' : ''}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Number of Modified Peptides to Generate"
          variant="outlined"
          type="number"
          {...register('num_mods', { required: true })}
          error={!!errors.num_mods}
          helperText={errors.num_mods ? 'This field is required' : ''}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Charge"
          variant="outlined"
          type="number"
          {...register('charge', { required: true })}
          error={!!errors.charge}
          helperText={errors.charge ? 'This field is required' : ''}
        />
        <Button type="submit" variant="contained" color="primary">
          Run SpeCollate
        </Button>
      </form>
    </Container>
  )
}

export default ConfigForm
