import React from 'react';
import { CopListItem } from './CopListItem';
import { FilterButton } from './FilterButton';
import { Loading } from './Loading';

export const Cops = (props) => {
  const { officers, filter, setFilter, ethnicities, setSortType } = props;
  let ethnicityKeys = Object.keys(ethnicities).sort(
    (a, b) => ethnicities[b] - ethnicities[a]
  );

  return officers.length ? (
    <div>
      <div>Filter By Officer Ethnicity (choose 1)</div>
      {ethnicityKeys.map((ethnicity) => (
        <FilterButton
          ethnicity={ethnicity}
          filter={filter}
          setFilter={setFilter}
          count={ethnicities[ethnicity]}
          key={ethnicity}
        />
      ))}
      <div>
        Sort by:
        <div>
          <button
            className="sort-button"
            type="button"
            onClick={() => setSortType('complaints')}
          >
            Amount of Complaints
          </button>
          <button
            className="sort-button"
            type="button"
            onClick={() => setSortType('lastName')}
          >
            Last Name
          </button>
        </div>
      </div>

      <div id="cop-list-container">
        {officers
          .filter((element) => {
            for (const category in filter) {
              if (filter[category] === 'all') return true;
              if (element[category] !== filter[category]) return false;
            }
            return true;
          })
          .map((officer) => {
            return <CopListItem officer={officer} key={officer.mosId} />;
          })}
      </div>
    </div>
  ) : (
    <Loading />
  );
};
