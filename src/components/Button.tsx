// src/components/Button.tsx
import styled from 'styled-components';

export const Button = styled.button`
  width: 100%;
  background-color: #0033a0;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.3s;

  &:hover {
    background-color: #002377;
  }
`;
