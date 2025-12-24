import styled, { css } from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  padding: 48px 0 64px;
  background: ${({ theme }) => theme.gradients.header};
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 700;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 24px;
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    transform: translateX(-2px);
  }
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1100px) {
    grid-template-columns: 1fr 320px;
    align-items: start;
  }
`;

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Panel = styled.div`
  background: ${({ theme }) => theme.glass.panel};
  border: 1px solid ${({ theme }) => theme.glass.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 24px;
  box-shadow: ${({ theme }) => theme.glass.shadow};
  backdrop-filter: blur(12px);
`;

export const JobHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

export const JobIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const Logo = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: ${({ theme }) => theme.gradients.brand};
  display: grid;
  place-items: center;
  color: #fff;
  box-shadow: 0 14px 30px -12px rgba(79, 70, 229, 0.55);
`;

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Title = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.01em;
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 600;
  font-size: 14px;
`;

export const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const badgeStyles = {
  yellow: css`
    background: #fef3c7;
    color: #b45309;
    border-color: #fcd34d;
  `,
  green: css`
    background: #dcfce7;
    color: #15803d;
    border-color: #86efac;
  `,
  blue: css`
    background: #e0e7ff;
    color: #4338ca;
    border-color: #c7d2fe;
  `,
};

export const StatusBadge = styled.span<{ tone?: "yellow" | "green" | "blue" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.02em;
  border: 1px solid transparent;
  ${({ tone = "yellow" }) => badgeStyles[tone]};
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`;

export const InfoCard = styled.div`
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.glass.card};
  border: 1px solid ${({ theme }) => theme.glass.border};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const InfoLabel = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.muted};
`;

export const InfoValue = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`;

export const InfoLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 14px;
  text-decoration: none;
  transition: transform 0.2s ease, color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    color: ${({ theme }) => theme.colors.accentStrong};
  }
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 12px;

  svg {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const Notes = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.7;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.6);
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.glass.border};
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 110px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.glass.border};
  padding: 12px;
  font-size: 14px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text};
  background: #fff;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
  }
`;

export const TextInput = styled.input`
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.glass.border};
  padding: 10px 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: #fff;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
  }
`;

export const Select = styled.select`
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.glass.border};
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  background: #fff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
  }
`;

export const InlineForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`;

export const FormActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const SmallButton = styled.button<{
  variant?: "primary" | "ghost" | "danger";
}>`
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
  background: #fff;
  color: ${({ theme }) => theme.colors.accent};
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  ${({ variant, theme }) =>
    variant === "primary"
      ? css`
          background: ${theme.gradients.brand};
          color: #fff;
          border-color: ${theme.glass.border};
          box-shadow: 0 10px 20px -14px rgba(79, 70, 229, 0.55);
        `
      : variant === "danger"
      ? css`
          background: #fff5f5;
          color: #b91c1c;
          border-color: rgba(244, 63, 94, 0.35);
        `
      : css`
          background: #fff;
          color: ${theme.colors.text};
          border-color: ${theme.glass.border};
        `}

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.glass.hoverShadow};
  }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.glass.border};
  background: ${({ theme }) => theme.glass.card};
`;

export const ListItemText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
`;

export const ListEmpty = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

export const EditableTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const EditField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 200px;
`;

export const EditLabel = styled.label`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.muted};
`;

export const EditGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

export const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

export const TimelineItem = styled.div`
  display: flex;
  gap: 12px;
  position: relative;
  padding-bottom: 12px;
  align-items: flex-start;

  &:last-child {
    padding-bottom: 0;
  }
`;

export const TimelineConnector = styled.span`
  position: absolute;
  left: 14px;
  top: 28px;
  bottom: 0;
  width: 2px;
  background: #e5e7eb;
`;

export const TimelineIconWrapper = styled.div`
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: #fff;
  border: 2px solid ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.accent};
  display: grid;
  place-items: center;
  z-index: 1;
`;

export const TimelineText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TimelineTitle = styled.p`
  font-weight: 800;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

export const TimelineSubtitle = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

export const ResourceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ResourceButton = styled.button`
  width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid transparent;
  background: ${({ theme }) => theme.glass.card};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  cursor: pointer;
  transition: border 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.glass.border};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.glass.hoverShadow};
  }

  svg {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const ReminderCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.gradients.brand};
  color: #fff;
  padding: 20px 18px;
  box-shadow: 0 20px 35px -18px rgba(79, 70, 229, 0.6);
`;

export const ReminderEyebrow = styled.p`
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.85;
  font-weight: 800;
  margin: 0 0 6px;
`;

export const ReminderText = styled.p`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.6;
  margin: 0;
  position: relative;
  z-index: 1;
`;

export const ReminderIcon = styled.div`
  position: absolute;
  right: -6px;
  bottom: -10px;
  opacity: 0.08;
  transform: rotate(-6deg);
  transition: transform 0.2s ease, opacity 0.2s ease;

  ${ReminderCard}:hover & {
    transform: rotate(0deg) scale(1.05);
    opacity: 0.12;
  }
`;

export const ArchiveCard = styled(Panel)`
  border-color: rgba(244, 63, 94, 0.25);
  background: rgba(254, 226, 226, 0.35);
`;

export const ArchiveButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid rgba(244, 63, 94, 0.35);
  background: #fff;
  color: #b91c1c;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: rgba(244, 63, 94, 0.08);
    transform: translateY(-1px);
    box-shadow: 0 12px 24px -18px rgba(185, 28, 28, 0.55);
  }
`;

export const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.glass.border};
  background: #fff;
  color: ${({ theme }) => theme.colors.text};
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.glass.hoverShadow};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const TimelineItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex: 1;
  gap: 8px;
`;
