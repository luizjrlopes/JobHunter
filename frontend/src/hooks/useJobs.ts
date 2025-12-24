import { useContext } from 'react';
import { JobContext, jobStatuses, jobTracks } from '../context/JobContext';

export const useJobs = () => {
  const ctx = useContext(JobContext);

  if (!ctx) {
    throw new Error('useJobs must be used within JobProvider');
  }

  return ctx;
};

export { jobStatuses, jobTracks };
