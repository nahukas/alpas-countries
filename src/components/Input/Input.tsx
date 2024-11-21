import { styled } from 'styled-components';

export const $Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  color: #333;

  &:focus {
    outline: none;
    border: 1px solid #ccc;
  }
`;
