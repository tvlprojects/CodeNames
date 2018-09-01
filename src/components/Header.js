import React from 'react';
import { Segment } from 'semantic-ui-react';

function Header(props) {
  return (
    <Segment inverted={true} color={props.color} textAlign={'center'}>
      <h1>{props.label}</h1>
    </Segment>
  );
}

export default Header;
