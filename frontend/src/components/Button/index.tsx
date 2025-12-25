import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { StyledButton } from './styles';

type Variant = 'primary' | 'ghost' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
}

const Button = ({ children, variant = 'primary', ...rest }: ButtonProps) => (
  <StyledButton $variant={variant} {...rest}>
    {children}
  </StyledButton>
);

export default Button;
