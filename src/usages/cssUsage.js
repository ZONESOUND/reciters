import styled from 'styled-components'

export const FullDiv = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display:flex;
  justify-content: center;
  align-items: center;
  z-index: -10;
  background: ${props => 
    props.bgColor === undefined ? "white" : props.bgColor};  
`;