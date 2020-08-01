import React from 'react';
import { toggleFilter } from './utils';

export const FilterButton = ({ ethnicity, filter, setFilter, count }) => {
  return (
    <button
      className="filter-button"
      id={`button-${ethnicity}`}
      key={ethnicity}
      type="button"
      onClick={() => toggleFilter('ethnicity', ethnicity, filter, setFilter)}
    >
      {ethnicity} ({count})
    </button>
  );
};
