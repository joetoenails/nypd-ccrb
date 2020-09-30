import React from 'react';
import { CopListItem } from './CopListItem';
import { CopListSquare } from './CopListSqaure';
import { FilterButton } from './FilterButton';
import { Loading } from './Loading';
import Button from 'react-bootstrap/Button';

export const Cops = (props) => {
  const { officers, filter, setFilter, ethnicities, setSortType } = props;
  let ethnicityKeys = Object.keys(ethnicities).sort(
    (a, b) => ethnicities[b] - ethnicities[a]
  );
  const count = Object.keys(ethnicities).reduce(
    (acc, cur) => ethnicities[cur] + acc,
    0
  );
  const colorKey = {
    White: 'red',
    Black: 'orange',
    Asian: 'green',
    Hispanic: 'indigo',
    'American Indian': 'blue',
  };
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
          backgroundColor={colorKey[ethnicity]}
        />
      ))}
      <FilterButton
        ethnicity={'all'}
        filter={filter}
        setFilter={setFilter}
        count={count}
        key={'all'}
        backgroundColor={'gray'}
      />
      <div>
        Sort by:
        <div>
          <Button
            className="sort-button"
            type="button"
            onClick={() => setSortType('complaints')}
          >
            Amount of Complaints
          </Button>
          <Button
            className="sort-button"
            type="button"
            onClick={() => setSortType('lastName')}
          >
            Last Name
          </Button>
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
            return <CopListSquare officer={officer} key={officer.mosId} />;
          })}
      </div>
    </div>
  ) : (
    <Loading />
  );
};
