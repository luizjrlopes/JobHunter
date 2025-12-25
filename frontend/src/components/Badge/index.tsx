import type { ReactNode } from 'react';
import type { JobStatus } from '../../types';
import { BadgeWrapper, Dot } from './styles';

interface BadgeProps {
  status: JobStatus;
  children: ReactNode;
}

const Badge = ({ status, children }: BadgeProps) => (
  <BadgeWrapper $status={status}>
    <Dot />
    {children}
  </BadgeWrapper>
);

export default Badge;
