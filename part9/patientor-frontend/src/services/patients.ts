import axios from 'axios';
import { Patient, PatientFormValues, Entry, NewEntry } from '../types';

const baseUrl = 'http://localhost:3001/api/patients';

const getAll = async (): Promise<Patient[]> => {
  const { data } = await axios.get<Patient[]>(baseUrl);
  return data;
};

const getById = async (id: string): Promise<Patient> => {
  const { data } = await axios.get<Patient>(`${baseUrl}/${id}`);
  return data;
};

const create = async (object: PatientFormValues): Promise<Patient> => {
  const { data } = await axios.post<Patient>(baseUrl, object);
  return data;
};

const addEntry = async (id: string, entry: NewEntry): Promise<Entry> => {
  const { data } = await axios.post<Entry>(`${baseUrl}/${id}/entries`, entry);
  return data;
};

export default {
  getAll,
  getById,
  create,
  addEntry,
};
