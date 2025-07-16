import styled from 'styled-components';

export const Input = styled.input`
  width: 100%;
  margin-bottom: 12px;
  padding: 8px 16px;
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