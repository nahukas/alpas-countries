import { styled } from 'styled-components';

const $SuggestionItem = styled.li<{ isActive: boolean }>`
  padding: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.isActive ? '#f0f0f0' : 'white')};

  &:hover {
    background-color: #f0f0f0;
  }
`;

export default $SuggestionItem;
