import {
  Entry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
  Diagnosis,
} from '../types';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealthRatingBar from './HealthRatingBar';
import { Box, Typography } from '@mui/material';

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const DiagnosisList = ({
  codes,
  diagnoses,
}: {
  codes?: string[];
  diagnoses: Diagnosis[];
}) => {
  if (!codes || codes.length === 0) return null;
  return (
    <ul>
      {codes.map((code) => {
        const diagnosis = diagnoses.find((d) => d.code === code);
        return (
          <li key={code}>
            {code} {diagnosis ? diagnosis.name : ''}
          </li>
        );
      })}
    </ul>
  );
};

const HospitalEntryDetail = ({
  entry,
  diagnoses,
}: {
  entry: HospitalEntry;
  diagnoses: Diagnosis[];
}) => {
  return (
    <Box
      sx={{ border: '1px solid grey', borderRadius: 2, p: 2, mb: 1 }}
    >
      <Typography>
        {entry.date} <LocalHospitalIcon />
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
        {entry.description}
      </Typography>
      <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
      <Typography variant="body2">
        Discharged: {entry.discharge.date} - {entry.discharge.criteria}
      </Typography>
      <Typography variant="body2">diagnose by {entry.specialist}</Typography>
    </Box>
  );
};

const OccupationalHealthcareEntryDetail = ({
  entry,
  diagnoses,
}: {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}) => {
  return (
    <Box
      sx={{ border: '1px solid grey', borderRadius: 2, p: 2, mb: 1 }}
    >
      <Typography>
        {entry.date} <WorkIcon /> {entry.employerName}
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
        {entry.description}
      </Typography>
      <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
      {entry.sickLeave && (
        <Typography variant="body2">
          Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
        </Typography>
      )}
      <Typography variant="body2">diagnose by {entry.specialist}</Typography>
    </Box>
  );
};

const HealthCheckEntryDetail = ({
  entry,
  diagnoses,
}: {
  entry: HealthCheckEntry;
  diagnoses: Diagnosis[];
}) => {
  return (
    <Box
      sx={{ border: '1px solid grey', borderRadius: 2, p: 2, mb: 1 }}
    >
      <Typography>
        {entry.date} <MedicalServicesIcon />
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
        {entry.description}
      </Typography>
      <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
      <HealthRatingBar rating={entry.healthCheckRating} showText={false} />
      <Typography variant="body2">diagnose by {entry.specialist}</Typography>
    </Box>
  );
};

const EntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Diagnosis[];
}) => {
  switch (entry.type) {
    case 'Hospital':
      return <HospitalEntryDetail entry={entry} diagnoses={diagnoses} />;
    case 'OccupationalHealthcare':
      return (
        <OccupationalHealthcareEntryDetail
          entry={entry}
          diagnoses={diagnoses}
        />
      );
    case 'HealthCheck':
      return <HealthCheckEntryDetail entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
