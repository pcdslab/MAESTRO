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
  Checkbox,
  Grid
} from '@mui/material'
import FolderSelector from '../FolderSelector'
import { configBuilderV2 } from '@renderer/utils/helper'
import { useState } from 'react'
import Divider from '@mui/material/Divider'

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
      spec_batch_size: 4,
      pep_batch_size: 1,

      search_spec_batch_size: 0.5,

      precursor_tolerance: 20,
      precursor_tolerance_type: 'ppm',

      keep_psms: 5,
      num_mods: 1,
      charge: 4,

      length_filter: true,
      len_tol_neg: -1,
      len_tol_pos: 1,
      missed_cleavages_filter: true,
      modification_filter: true
    } as any
  })

  const onSubmit = async (data: any) => {
    configBuilderV2(data)
    run(useGpu)
  }

  return (
    <Container>
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
            label="Spectra Directory (MGF)"
            {...register('mgf_dir', { required: true })}
            error={errors.mgf_dir ? 'This field is required' : ''}
            onChange={(path) => setValue('mgf_dir', path, { shouldValidate: true })}
            value={watch('mgf_dir')}
          />
        </Box>
        <Box margin="normal">
          <FolderSelector
            label="Peptide Database Directory (fasta)"
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

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              margin="normal"
              fullWidth
              label="Spectra Batch Size (GiB)"
              variant="outlined"
              type="number"
              inputProps={{
                step: 0.01
              }}
              {...register('spec_batch_size', { required: true })}
              error={!!errors.spec_batch_size}
              helperText={errors.spec_batch_size ? 'This field is required' : ''}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="normal"
              fullWidth
              label="Peptide Batch Size (GiB)"
              variant="outlined"
              type="number"
              inputProps={{
                step: 0.01
              }}
              {...register('pep_batch_size', { required: true })}
              error={!!errors.pep_batch_size}
              helperText={errors.pep_batch_size ? 'This field is required' : ''}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="normal"
              fullWidth
              label="Search Spectra Batch Size (GiB)"
              variant="outlined"
              type="number"
              inputProps={{
                step: 0.01
              }}
              {...register('search_spec_batch_size', { required: true })}
              error={!!errors.search_spec_batch_size}
              helperText={errors.search_spec_batch_size ? 'This field is required' : ''}
            />
          </Grid>
          <Grid item xs={6}>
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
          </Grid>
          <Grid item xs={6}>
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
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="precursor-tolerance-type-label">Precursor Tolerance Type</InputLabel>
              <Select
                sx={{ textAlign: 'left' }}
                labelId="precursor-tolerance-type-label"
                value={watch('precursor_tolerance_type')}
                onChange={(e) => setValue('precursor_tolerance_type', e.target.value)}
                label="Precursor Tolerance Type"
              >
                <MenuItem value="ppm">ppm</MenuItem>
                <MenuItem value="da">da</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
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
          </Grid>
          <Grid item xs={6}>
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
          </Grid>

          <Box width={'100%'} sx={{ marginLeft: 2, marginTop: 2, fontFamily: 500 }}>
            <Divider />
            <Typography variant="h5" mt={2} mb={2}>
              Search space reduction using the following
            </Typography>
          </Box>
          {/* Filters */}
          <Box display="flex" justifyContent="center" width={'100%'}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={watch('length_filter')}
                  onChange={(e) => setValue('length_filter', e.target.checked)}
                />
              }
              label="Length Filter"
            />
          </Box>
          {watch('length_filter') && (
            <>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Length Tolerance Negative"
                  variant="outlined"
                  type="number"
                  {...register('len_tol_neg', { required: true })}
                  error={!!errors.len_tol_neg}
                  helperText={errors.len_tol_neg ? 'This field is required' : ''}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Length Tolerance Positive"
                  variant="outlined"
                  type="number"
                  {...register('len_tol_pos', { required: true })}
                  error={!!errors.len_tol_pos}
                  helperText={errors.len_tol_pos ? 'This field is required' : ''}
                />
              </Grid>
            </>
          )}
          <Box></Box>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={watch('missed_cleavages_filter')}
                    onChange={(e) => setValue('missed_cleavages_filter', e.target.checked)}
                  />
                }
                label="Missed Cleavages Filter"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={watch('modification_filter')}
                    onChange={(e) => setValue('modification_filter', e.target.checked)}
                  />
                }
                label="Modification Filter"
              />
            </Box>
          </Grid>

          {/* Text fields at the bottom */}
        </Grid>

        <Button sx={{ marginTop: 2 }} type="submit" variant="contained" color="primary">
          Run Maestro
        </Button>
      </form>
    </Container>
  )
}

export default ConfigForm
