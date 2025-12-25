import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
  padding: 24px;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  color: #111827;
`;

export const Subtitle = styled.p`
  margin: 0;
  color: #6b7280;
`;

export const Toggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 4px;
  gap: 4px;

  button {
    border: none;
    background: transparent;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s ease;

    &.active {
      background: #4f46e5;
      color: #fff;
      font-weight: 600;
      box-shadow: 0 8px 18px rgba(79, 70, 229, 0.25);
    }
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: #374151;
    font-weight: 500;
  }
`;

export const Input = styled.input`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  outline: none;
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

export const Button = styled.button`
  margin-top: 4px;
  padding: 12px 14px;
  border-radius: 10px;
  border: none;
  background: #4f46e5;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.p`
  margin: 0;
  color: #ef4444;
  font-size: 14px;
`;
