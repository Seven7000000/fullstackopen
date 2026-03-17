import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Typography, Button, Divider } from '@mui/material';

import { Patient, Diagnosis, PatientFormValues } from './types';
import patientService from './services/patients';
import diagnoseService from './services/diagnoses';

import PatientListPage from './components/PatientListPage';
import PatientDetailPage from './components/PatientDetailPage';

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
      const diagnoses = await diagnoseService.getAll();
      setDiagnoses(diagnoses);
    };
    void fetchData();
  }, []);

  const handleAddPatient = async (values: PatientFormValues) => {
    const newPatient = await patientService.create(values);
    setPatients(patients.concat(newPatient));
  };

  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" sx={{ mb: 1, mt: 2 }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider sx={{ mb: 2, mt: 1 }} />
          <Routes>
            <Route
              path="/"
              element={
                <PatientListPage
                  patients={patients}
                  onSubmit={handleAddPatient}
                />
              }
            />
            <Route
              path="/patients/:id"
              element={<PatientDetailPage diagnoses={diagnoses} />}
            />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
