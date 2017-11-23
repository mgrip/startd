// @flow

import styled from "styled-components";

export default styled.button`
  color: ${props => props.theme.colors.secondary};
  background-color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.font.family}
  white-space: nowrap;
  overflow: hidden;
  padding: ${props => props.theme.spacing.small} ${props =>
  props.theme.spacing.medium};
  border: 0 none;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.font.normal};
`;
