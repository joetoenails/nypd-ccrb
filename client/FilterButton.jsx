import React from 'react';
import { toggleFilter } from './utils';
import Button from 'react-bootstrap/Button';

export const FilterButton = ({
  ethnicity,
  filter,
  setFilter,
  count,
  backgroundColor,
}) => {
  const activeButton = {
    backgroundColor: `${backgroundColor}`,
    color: 'white',
    border: `1px  solid white`,
  };
  const inactiveButton = {
    color: `${backgroundColor}`,
    backgroundColor: 'white',
    border: `1px solid ${backgroundColor}`,
  };

  return (
    <Button
      className="filter-button"
      id={`button-${ethnicity}`}
      key={ethnicity}
      type="button"
      onClick={() =>
        toggleFilter('mos_ethnicity', ethnicity, filter, setFilter)
      }
      style={filter.mos_ethnicity === ethnicity ? activeButton : inactiveButton}
    >
      {ethnicity} ({count})
    </Button>
  );
};
