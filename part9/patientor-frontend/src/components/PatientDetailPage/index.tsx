import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import axios from 'axios';

import { Patient, Diagnosis, Gender, NewEntry } from '../../types';
import patientService from '../../services/patients';
import EntryDetails from '../EntryDetails';
import AddEntryForm from '../AddEntryForm';

interface Props {
  diagnoses: Diagnosis[];
}

const PatientDetailPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const p = await patientService.getById(id);
        setPatient(p);
      }
    };
    void fetchPatient();
  }, [id]);

  const handleAddEntry = async (entry: NewEntry) => {
    try {
      if (id && patient) {
        const addedEntry = await patientService.addEntry(id, entry);
        setPatient({
          ...patient,
          entries: patient.entries.concat(addedEntry),
        });
        setShowForm(false);
        setError(undefined);
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e.response?.data && typeof e.response.data === 'object' && 'error' in e.response.data) {
          setError(String(e.response.data.error));
        } else {
          setError('Unknown error');
        }
      } else if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  const getGenderIcon = (gender: Gender) => {
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

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
        {patient.name} {getGenderIcon(patient.gender)}
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
      <Typography>date of birth: {patient.dateOfBirth}</Typography>

      {showForm ? (
        <AddEntryForm
          onSubmit={handleAddEntry}
          onCancel={() => {
            setShowForm(false);
            setError(undefined);
          }}
          diagnoses={diagnoses}
          error={error}
        />
      ) : (
        <Button
          variant="contained"
          sx={{ mt: 2, mb: 2 }}
          onClick={() => setShowForm(true)}
        >
          Add New Entry
        </Button>
      )}

      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        entries
      </Typography>
      {patient.entries.map((entry) => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </div>
  );
};

export default PatientDetailPage;
