import { useState, SyntheticEvent } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Alert,
  Box,
  Typography,
  OutlinedInput,
  Chip,
} from '@mui/material';
import { NewEntry, EntryType, HealthCheckRating, Diagnosis } from '../types';

interface Props {
  onSubmit: (entry: NewEntry) => void;
  onCancel: () => void;
  diagnoses: Diagnosis[];
  error?: string;
}

const AddEntryForm = ({ onSubmit, onCancel, diagnoses, error }: Props) => {
  const [type, setType] = useState<EntryType>('HealthCheck');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  // HealthCheck
  const [healthCheckRating, setHealthCheckRating] = useState<string>('0');

  // Hospital
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  // OccupationalHealthcare
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setType(event.target.value as EntryType);
  };

  const handleDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setDiagnosisCodes(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes,
    };

    switch (type) {
      case 'HealthCheck':
        onSubmit({
          ...baseEntry,
          type: 'HealthCheck',
          healthCheckRating: Number(healthCheckRating) as HealthCheckRating,
        });
        break;
      case 'Hospital':
        onSubmit({
          ...baseEntry,
          type: 'Hospital',
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        });
        break;
      case 'OccupationalHealthcare':
        onSubmit({
          ...baseEntry,
          type: 'OccupationalHealthcare',
          employerName,
          ...(sickLeaveStart && sickLeaveEnd
            ? {
                sickLeave: {
                  startDate: sickLeaveStart,
                  endDate: sickLeaveEnd,
                },
              }
            : {}),
        });
        break;
    }
  };

  return (
    <Box
      sx={{
        border: '2px dashed grey',
        borderRadius: 2,
        p: 3,
        mb: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        New entry
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Type</InputLabel>
          <Select value={type} onChange={handleTypeChange} label="Type">
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">
              Occupational Healthcare
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Date"
          type="date"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Diagnosis codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={handleDiagnosisChange}
            input={<OutlinedInput label="Diagnosis codes" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {diagnoses.map((d) => (
              <MenuItem key={d.code} value={d.code}>
                {d.code} - {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {type === 'HealthCheck' && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Health check rating</InputLabel>
            <Select
              value={healthCheckRating}
              onChange={({ target }) => setHealthCheckRating(target.value)}
              label="Health check rating"
            >
              <MenuItem value="0">Healthy</MenuItem>
              <MenuItem value="1">Low Risk</MenuItem>
              <MenuItem value="2">High Risk</MenuItem>
              <MenuItem value="3">Critical Risk</MenuItem>
            </Select>
          </FormControl>
        )}

        {type === 'Hospital' && (
          <>
            <TextField
              label="Discharge date"
              type="date"
              fullWidth
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Discharge criteria"
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
              sx={{ mb: 2 }}
            />
          </>
        )}

        {type === 'OccupationalHealthcare' && (
          <>
            <TextField
              label="Employer name"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Sick leave start"
              type="date"
              fullWidth
              value={sickLeaveStart}
              onChange={({ target }) => setSickLeaveStart(target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Sick leave end"
              type="date"
              fullWidth
              value={sickLeaveEnd}
              onChange={({ target }) => setSickLeaveEnd(target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            color="secondary"
            variant="contained"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Add
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddEntryForm;
