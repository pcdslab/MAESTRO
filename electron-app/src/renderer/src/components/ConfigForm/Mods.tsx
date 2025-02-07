import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Button, MenuItem, Select, FormControl, InputLabel, Chip, Box } from '@mui/material'
import { aamass, type_ptms } from '@renderer/contant'
import { Delete, Remove } from '@mui/icons-material'

export const Mods = ({ control }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ptm_mods'
  })

  return (
    <>
      {fields.map((field, index) => (
        <Box key={field.id} display="flex" gap={2} mb={2}>
          {/* Mod Char Select */}
          <Controller
            control={control}
            name={`ptm_mods.${index}.mod_char`}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Modification</InputLabel>
                <Select {...field} label="Modification">
                  {type_ptms.map((mod) => (
                    <MenuItem key={mod.value} value={mod.value}>
                      {mod.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* AAs Multi-Select */}
          <Controller
            control={control}
            name={`ptm_mods.${index}.aas`}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="multi-select-label-ptm">AAMass</InputLabel>
                <Select
                  {...field}
                  labelId="multi-select-label-ptm"
                  id="multi-select"
                  label="AAMass"
                  multiple
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {aamass.map((aa) => (
                    <MenuItem key={aa} value={aa}>
                      {aa}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* Remove Button */}
          <Button variant="outlined" color="error" onClick={() => remove(index)}>
            <Delete />
          </Button>
        </Box>
      ))}

      <Button variant="contained" onClick={() => append({ mod_char: '', aas: [] })}>
        Add Modification
      </Button>
    </>
  )
}
