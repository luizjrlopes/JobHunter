import styled from "styled-components";

export const Page = styled.div`
  padding-bottom: 64px;
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(14px);
  background: ${({ theme }) => theme.glass.panel};
  border-bottom: 1px solid ${({ theme }) => theme.glass.border};
  box-shadow: ${({ theme }) => theme.glass.shadow};
`;

export const HeaderInner = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const BrandIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.gradients.brand};
  display: grid;
  place-items: center;
  color: #fff;
  box-shadow: 0 12px 25px -10px rgba(79, 70, 229, 0.55);
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const BrandTitle = styled.h1`
  font-size: 22px;
  font-weight: 800;
  background: ${({ theme }) => theme.gradients.brand};
  -webkit-background-clip: text;
  color: transparent;
`;

export const BrandSubtitle = styled.span`
  font-size: 11px;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 700;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Container = styled.main`
  margin: 0 auto;
  max-width: 1200px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
`;

export const Panel = styled.div`
  background: ${({ theme }) => theme.glass.panel};
  border: 1px solid ${({ theme }) => theme.glass.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 18px;
  box-shadow: ${({ theme }) => theme.glass.shadow};
`;

export const FiltersRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 14px 12px 44px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.8);
  color: #111827;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);

  &:focus {
    outline: none;
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 360px;
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  color: #9ca3af;
`;

export const FiltersGroup = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  flex-wrap: wrap;
`;

export const Select = styled.select`
  min-width: 160px;
  padding: 11px 12px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: border 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
  }
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 10px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: #374151;
`;

export const Input = styled.input`
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  color: #111827;

  &:focus {
    outline: none;
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
  }
`;

export const TextArea = styled.textarea`
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  color: #111827;
  font-family: inherit;
  min-height: 80px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
