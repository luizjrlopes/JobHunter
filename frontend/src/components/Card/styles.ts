import styled, { css } from "styled-components";

export type StatTone = "indigo" | "amber" | "green" | "gray";

export const CardContainer = styled.div<{ $clickable?: boolean }>`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.glass.panel};
  border: 1px solid ${({ theme }) => theme.glass.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 24px;
  min-height: 150px;
  box-shadow: ${({ theme }) => theme.glass.shadow};
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;
      outline: none;
      &:focus {
        box-shadow: ${({ theme }) => theme.glass.hoverShadow},
          0 0 0 3px rgba(79, 70, 229, 0.25);
      }
    `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.glass.hoverShadow};
    background: rgba(255, 255, 255, 0.8);
  }
`;

export const IconWatermark = styled.div<{ $tone: StatTone }>`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 12px;
  opacity: 0.08;

  svg {
    width: 120px;
    height: 120px;

    ${({ $tone }) =>
      $tone === "indigo" &&
      css`
        color: #4f46e5;
      `}
    ${({ $tone }) =>
      $tone === "amber" &&
      css`
        color: #f59e0b;
      `}
    ${({ $tone }) =>
      $tone === "green" &&
      css`
        color: #16a34a;
      `}
    ${({ $tone }) =>
      $tone === "gray" &&
      css`
        color: #9ca3af;
      `}
  }
`;

export const StatContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StatLabel = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
`;

export const StatValue = styled.h3`
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

export const StatChip = styled.span<{ $tone: StatTone }>`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radii.full};

  ${({ $tone }) =>
    $tone === "indigo" &&
    css`
      color: #4338ca;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
    `}
  ${({ $tone }) =>
    $tone === "amber" &&
    css`
      color: #b45309;
      background: #fef3c7;
      border: 1px solid #fcd34d;
    `}
  ${({ $tone }) =>
    $tone === "green" &&
    css`
      color: #15803d;
      background: #dcfce7;
      border: 1px solid #86efac;
    `}
  ${({ $tone }) =>
    $tone === "gray" &&
    css`
      color: #4b5563;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
    `}
`;
