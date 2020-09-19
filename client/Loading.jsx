import React from 'react';

import Spinner from 'react-bootstrap/Spinner';

export const Loading = (props) => {
  return (
    <Spinner animation="border" role="status">
      <span className="sr-only">RELAX I'M LOADING...</span>
    </Spinner>
  );
};
