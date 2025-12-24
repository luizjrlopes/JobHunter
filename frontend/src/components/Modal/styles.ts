import styled from 'styled-components';

export const Overlay = styled.div<{ open: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  opacity: ${({ open }) => (open ? 1 : 0)};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 20;
`;

export const ModalContent = styled.div<{ open: boolean }>`
  width: 100%;
  max-width: 640px;
  background: #fff;
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.glass.border};
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transform: ${({ open }) => (open ? 'scale(1)' : 'scale(0.97)')};
  transition: transform 0.2s ease;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  background: #f9fafb;
`;

export const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
`;

export const ModalBody = styled.div`
  padding: 20px;
`;

export const ModalFooter = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #f3f4f6;
  background: #f9fafb;
`;
