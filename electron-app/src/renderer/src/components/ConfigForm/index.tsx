import React, { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { TextField, Button, Container, Typography, Box } from '@mui/material'

const ConfigForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = useForm()

  const onSubmit = (data) => {
    console.log(data)
  }

  console.log(watch())

  const handleDirectoryChange = (event, fieldName) => {
    console.log(event)
    const directoryPath = event.target.files[0].webkitRelativePath.split('/')[0]
    setValue(fieldName, directoryPath)
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
          label="Model Name"
          variant="outlined"
          {...register('model_name', { required: true })}
          error={!!errors.model_name}
          helperText={errors.model_name ? 'This field is required' : ''}
        />
        {/* <Box margin="normal"> */}
        <input
          type="file"
          webkitdirectory="true"
          directory="true"
          // style={{ display: 'none' }}
          onChange={(e) => console.log(e.target.files?.[0])}
        />
        {/* <TextField
            margin="normal"
            fullWidth
            label="MGF Directory"
            variant="outlined"
            {...register('mgf_dir', { required: true })}
            error={!!errors.mgf_dir}
            helperText={errors.mgf_dir ? 'This field is required' : ''}
            onClick={() => directoryInputRef.current.click()}
          />
        </Box>
        <Box margin="normal">
          <input
            type="file"
            webkitdirectory="true"
            directory="true"
            style={{ display: 'none' }}
            ref={directoryInputRef}
            onChange={(e) => handleDirectoryChange(e, 'prep_dir')}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Preprocessed Directory"
            variant="outlined"
            {...register('prep_dir', { required: true })}
            error={!!errors.prep_dir}
            helperText={errors.prep_dir ? 'This field is required' : ''}
            onClick={() => directoryInputRef.current.click()}
          />
        </Box>
        <Box margin="normal">
          <input
            type="file"
            webkitdirectory="true"
            directory="true"
            style={{ display: 'none' }}
            ref={directoryInputRef}
            onChange={(e) => handleDirectoryChange(e, 'pep_dir')}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Peptide Directory"
            variant="outlined"
            {...register('pep_dir', { required: true })}
            error={!!errors.pep_dir}
            helperText={errors.pep_dir ? 'This field is required' : ''}
            onClick={() => directoryInputRef.current.click()}
          />
        </Box>
        <Box margin="normal">
          <input
            type="file"
            webkitdirectory="true"
            directory="true"
            style={{ display: 'none' }}
            ref={directoryInputRef}
            onChange={(e) => handleDirectoryChange(e, 'out_pin_dir')}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Percolator Output Directory"
            variant="outlined"
            {...register('out_pin_dir', { required: true })}
            error={!!errors.out_pin_dir}
            helperText={errors.out_pin_dir ? 'This field is required' : ''}
            onClick={() => directoryInputRef.current.click()}
          />
        </Box> */}
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
        <TextField
          margin="normal"
          fullWidth
          label="Precursor Tolerance Type"
          variant="outlined"
          {...register('precursor_tolerance_type', { required: true })}
          error={!!errors.precursor_tolerance_type}
          helperText={errors.precursor_tolerance_type ? 'This field is required' : ''}
        />
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
          Save
        </Button>
      </form>
    </Container>
  )
}

export default ConfigForm
