import styled, { css } from 'styled-components';

type Variant = 'primary' | 'ghost' | 'icon';

export const StyledButton = styled.button<{ variant: Variant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid transparent;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.glass.shadow};

  ${({ variant, theme }) =>
    variant === 'primary' &&
    css`
      background: ${theme.gradients.brand};
      color: #fff;
      box-shadow: 0 10px 25px -10px rgba(79, 70, 229, 0.45);
      border-color: rgba(255, 255, 255, 0.08);

      &:hover {
        transform: translateY(-1px);
        box-shadow: ${theme.glass.hoverShadow};
      }
    `}

  ${({ variant, theme }) =>
    variant === 'ghost' &&
    css`
      background: rgba(255, 255, 255, 0.6);
      color: ${theme.colors.muted};
      border-color: ${theme.glass.border};

      &:hover {
        color: ${theme.colors.accent};
        background: rgba(255, 255, 255, 0.75);
      }
    `}

  ${({ variant, theme }) =>
    variant === 'icon' &&
    css`
      width: 44px;
      height: 44px;
      padding: 0;
      background: rgba(255, 255, 255, 0.75);
      color: ${theme.colors.muted};
      border-color: ${theme.glass.border};

      &:hover {
        color: ${theme.colors.accent};
        background: rgba(255, 255, 255, 0.9);
      }
    `}
`;
