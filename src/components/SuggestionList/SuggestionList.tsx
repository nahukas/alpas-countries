import { styled } from 'styled-components';

const $SuggestionList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  color: black;
  max-height: 200px;
  overflow-y: auto;
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  background-color: white;
  z-index: 1;
`;

export default $SuggestionList;
