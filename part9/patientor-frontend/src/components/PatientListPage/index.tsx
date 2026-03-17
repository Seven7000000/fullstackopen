import { useState } from 'react';
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Patient, PatientFormValues, Gender } from '../../types';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';

interface Props {
  patients: Patient[];
  onSubmit: (values: PatientFormValues) => void;
}

const GenderIcon = ({ gender }: { gender: Gender }) => {
  switch (gender) {
    case Gender.Male:
      return <MaleIcon />;
    case Gender.Female:
      return <FemaleIcon />;
    case Gender.Other:
      return <TransgenderIcon />;
    default:
      return null;
  }
};

const PatientListPage = ({ patients, onSubmit }: Props) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();

  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [ssn, setSsn] = useState('');
  const [gender, setGender] = useState<Gender>(Gender.Other);
  const [occupation, setOccupation] = useState('');

  const handleGenderChange = (event: SelectChangeEvent<string>) => {
    setGender(event.target.value as Gender);
  };

  const handleSubmit = () => {
    try {
      onSubmit({ name, dateOfBirth, ssn, gender, occupation });
      setOpen(false);
      setName('');
      setDateOfBirth('');
      setSsn('');
      setGender(Gender.Other);
      setOccupation('');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2, mt: 2 }}>
        Patient list
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>
                <Link to={`/patients/${patient.id}`}>{patient.name}</Link>
              </TableCell>
              <TableCell>
                <GenderIcon gender={patient.gender} />
              </TableCell>
              <TableCell>{patient.occupation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => setOpen(true)}
      >
        Add New Patient
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add a new patient</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={({ target }) => setName(target.value)}
            sx={{ mt: 1, mb: 1 }}
          />
          <TextField
            label="Date of birth"
            type="date"
            fullWidth
            value={dateOfBirth}
            onChange={({ target }) => setDateOfBirth(target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 1 }}
          />
          <TextField
            label="SSN"
            fullWidth
            value={ssn}
            onChange={({ target }) => setSsn(target.value)}
            sx={{ mb: 1 }}
          />
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel>Gender</InputLabel>
            <Select value={gender} onChange={handleGenderChange} label="Gender">
              <MenuItem value={Gender.Male}>Male</MenuItem>
              <MenuItem value={Gender.Female}>Female</MenuItem>
              <MenuItem value={Gender.Other}>Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Occupation"
            fullWidth
            value={occupation}
            onChange={({ target }) => setOccupation(target.value)}
            sx={{ mb: 2 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientListPage;
