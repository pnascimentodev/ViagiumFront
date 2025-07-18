// Button Component
import styled from 'styled-components';

export const Button = styled.button`
    width: 100%;
    background-color: #003194;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-weight: 700;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s;
    &:hover {
        background-color: #002377;
    }
`;