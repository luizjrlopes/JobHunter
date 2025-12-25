import styled from 'styled-components';
import type { JobStatus } from '../../types';

export const BadgeWrapper = styled.span<{ $status: JobStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.01em;
  background: ${({ theme, $status }) => theme.status[$status].bg};
  color: ${({ theme, $status }) => theme.status[$status].color};
  border: 1px solid ${({ theme, $status }) => theme.status[$status].border};
`;

export const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: currentColor;
  opacity: 0.75;
`;
