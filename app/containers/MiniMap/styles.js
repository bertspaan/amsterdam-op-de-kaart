import styled from 'styled-components'

export const StyledMiniMap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;

  cursor: pointer;
  border-radius: 3px;

  & .leaflet-container {
    border-color: rgb(196, 224, 232);
    border-style: solid;
    border-width: 2.5px;
  }

  &:hover .leaflet-container,
  & .leaflet-container:focus {
    border-color: #ffd72e;
  }
`

export const Title = styled.h2`
  z-index: 1000;
  left: 0;
  font-family: 'MiloSlab';
  font-weight: bold;

  width: 100%;
  top: 8px;

  /*TODO: use color variable*/
  text-shadow: 0 0 4px rgb(196, 224, 232);
  text-align: center;
  margin: 0;
  position: absolute;
  pointer-events: none;
  font-size: 25px;
`
