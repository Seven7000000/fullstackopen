import axios from 'axios';
import { Diagnosis } from '../types';

const baseUrl = 'http://localhost:3001/api/diagnoses';

const getAll = async (): Promise<Diagnosis[]> => {
  const { data } = await axios.get<Diagnosis[]>(baseUrl);
  return data;
};

export default {
  getAll,
};
