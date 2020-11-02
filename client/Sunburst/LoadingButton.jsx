import React from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export const LoadingButton = (props) => {
  const { isLoading, onClick, type, buttonText } = props;
  return isLoading ? (
    <Button className="form-button" variant="primary" block disabled>
      <Spinner
        as="span"
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
        style={{ marginRight: '10px' }}
      />
      Loading
    </Button>
  ) : (
    <Button
      onClick={onClick ? onClick : undefined}
      className="form-button"
      type={type}
      block
    >
      {buttonText}
    </Button>
  );
};
