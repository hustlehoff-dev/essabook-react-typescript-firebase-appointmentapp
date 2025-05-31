import styled from "styled-components";

const StyledInput = styled.input.attrs({ readOnly: true })`
  padding: 10px;
  font-size: 1.2em;
  border-radius: 8px;
  background-color: #1e1e1e;
  color: #fff;
  border: 1px solid #ff7f00;
  width: 100%;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #ff7f00aa;
  }
`;

export default StyledInput;
