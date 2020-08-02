import React from 'react';
import { CopListItem } from './CopListItem';
import { FilterButton } from './FilterButton';

export const Cops = (props) => {
  const { officers, filter, setFilter, ethnicities, setSortType } = props;
  let ethnicityKeys = Object.keys(ethnicities);
  console.log(props);
  return (
    <div>
      <div></div>
      <svg width="1500" height="200">
        {officers.map((officer, idx) => {
          return (
            <rect
              x={`${idx + 1}`}
              y={75 - officer.complaints.length}
              width="1"
              height={`${officer.complaints.length}`}
              fill="blue"
            ></rect>
          );
        })}
      </svg>
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
        {officers.length
          ? officers
              .filter((element) => {
                for (const category in filter) {
                  if (filter[category] === 'all') return true;
                  if (element[category] !== filter[category]) return false;
                }
                return true;
              })
              .map((officer) => {
                return <CopListItem officer={officer} key={officer.mosId} />;
              })
          : 'loading pigs'}
      </div>
    </div>
  );
};
