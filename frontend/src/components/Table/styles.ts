import styled from "styled-components";
import { Link } from "react-router-dom";

export const TableContainer = styled.div`
  background: ${({ theme }) => theme.glass.panel};
  border: 1px solid ${({ theme }) => theme.glass.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.glass.shadow};
  overflow: hidden;
`;

export const ScrollArea = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
`;

export const Head = styled.thead`
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const HeadCell = styled.th`
  text-align: left;
  padding: 16px 24px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
`;

export const Body = styled.tbody`
  background: rgba(255, 255, 255, 0.3);
`;

export const Row = styled.tr`
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

export const Cell = styled.td<{ align?: "left" | "right" }>`
  padding: 16px 24px;
  font-size: 14px;
  color: #111827;
  text-align: ${({ align }) => align ?? "left"};
  border-top: 1px solid #f3f4f6;
`;

export const CompanyCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const LinkOverlay = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
`;

export const CompanyAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #6b7280;
  box-shadow: ${({ theme }) => theme.glass.shadow};
`;

export const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Position = styled.span`
  font-weight: 700;
`;

export const CompanyName = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

export const TrackTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: #f3f4f6;
  color: #111827;
  border: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 12px;
`;

export const DateText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 13px;
`;

export const EmptyState = styled.div`
  padding: 48px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  color: #6b7280;
`;

export const EmptyTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  color: #111827;
`;

export const EmptyText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
`;
