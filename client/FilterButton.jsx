import React from 'react';
import { toggleFilter } from './utils';

export const FilterButton = ({
  ethnicity,
  filter,
  setFilter,
  count,
  backgroundColor,
}) => {
  return (
    <button
      className="filter-button"
      id={`button-${ethnicity}`}
      key={ethnicity}
      type="button"
      onClick={() => toggleFilter('ethnicity', ethnicity, filter, setFilter)}
      style={{ backgroundColor: `${backgroundColor}`, color: 'white' }}
    >
      {ethnicity} ({count})
    </button>
  );
};
