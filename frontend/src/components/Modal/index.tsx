import type { ReactNode } from 'react';
import { ModalBody, ModalContent, ModalFooter, ModalHeader, ModalTitle, Overlay } from './styles';
import Button from '../Button';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

const Modal = ({ open, title, onClose, footer, children }: ModalProps) => (
  <Overlay open={open} onClick={onClose}>
    <ModalContent open={open} onClick={(e) => e.stopPropagation()}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        <Button aria-label="Fechar" variant="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
      {footer && <ModalFooter>{footer}</ModalFooter>}
    </ModalContent>
  </Overlay>
);

export default Modal;
