// src/components/Input.tsx
import styled from 'styled-components';
import type { ReactNode } from 'react';

interface InputProps {
  type: string;
  placeholder: string;
  icon: ReactNode;
}

export const Input = ({ type, placeholder, icon }: InputProps) => {
  return (
    <InputWrapper>
      <IconWrapper>{icon}</IconWrapper>
      <StyledInput type={type} placeholder={placeholder} />
    </InputWrapper>
  );
};

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 2px solid #1d4ed8;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;

  &::placeholder {
    color: #6b7280;
  }

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const IconWrapper = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #1d4ed8;
`;
