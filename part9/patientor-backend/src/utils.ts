import {
  NewPatient,
  Gender,
  NewEntry,
  Diagnosis,
  HealthCheckRating,
} from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return [0, 1, 2, 3].includes(param);
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};

const parseDiagnosisCodes = (
  object: unknown
): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object
  ) {
    const newPatient: NewPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: [],
    };

    return newPatient;
  }

  throw new Error('Incorrect data: some fields are missing');
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (!('type' in object)) {
    throw new Error('Missing entry type');
  }

  if (
    !('description' in object) ||
    !('date' in object) ||
    !('specialist' in object)
  ) {
    throw new Error('Missing base entry fields');
  }

  const baseFields = {
    description: parseName(
      (object as { description: unknown }).description
    ),
    date: parseDate((object as { date: unknown }).date),
    specialist: parseName(
      (object as { specialist: unknown }).specialist
    ),
    diagnosisCodes: parseDiagnosisCodes(object),
  };

  switch ((object as { type: string }).type) {
    case 'Hospital': {
      if (!('discharge' in object)) {
        throw new Error('Missing discharge for Hospital entry');
      }
      const discharge = object.discharge as {
        date: unknown;
        criteria: unknown;
      };
      if (!discharge || typeof discharge !== 'object') {
        throw new Error('Incorrect discharge data');
      }
      return {
        ...baseFields,
        type: 'Hospital',
        discharge: {
          date: parseDate(discharge.date),
          criteria: parseName(discharge.criteria),
        },
      };
    }
    case 'OccupationalHealthcare': {
      if (!('employerName' in object)) {
        throw new Error(
          'Missing employerName for OccupationalHealthcare entry'
        );
      }
      const entry: NewEntry = {
        ...baseFields,
        type: 'OccupationalHealthcare',
        employerName: parseName(
          (object as { employerName: unknown }).employerName
        ),
      };
      if ('sickLeave' in object && object.sickLeave) {
        const sickLeave = object.sickLeave as {
          startDate: unknown;
          endDate: unknown;
        };
        entry.sickLeave = {
          startDate: parseDate(sickLeave.startDate),
          endDate: parseDate(sickLeave.endDate),
        };
      }
      return entry;
    }
    case 'HealthCheck': {
      if (!('healthCheckRating' in object)) {
        throw new Error('Missing healthCheckRating for HealthCheck entry');
      }
      const rating = Number(
        (object as { healthCheckRating: unknown }).healthCheckRating
      );
      if (isNaN(rating) || !isHealthCheckRating(rating)) {
        throw new Error('Incorrect healthCheckRating: ' + rating);
      }
      return {
        ...baseFields,
        type: 'HealthCheck',
        healthCheckRating: rating,
      };
    }
    default:
      throw new Error(
        'Incorrect entry type: ' + (object as { type: string }).type
      );
  }
};
