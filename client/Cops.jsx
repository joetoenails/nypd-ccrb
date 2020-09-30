import React from 'react';
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
      <h1>Squares</h1>
      <p>
        The idea behind squares is encourage the user to actively peruse the
        data. Often when confronted with a big set of data the user is presented
        with a lonely search bar and they have to figure out what kind of search
        queries will work, or what they are actually looking for. Squares aims
        to take away the search bar and instead present all officers at once and
        breaks down the information about each officer in a couple of ways.
        First, each square represents an NYPD Officer and all 3396 officers
        appear on the screen at the same time. Second, the shade of blue
        represents how many allegations each officer has filed against them in
        the CCRB database: the darker the square, the more allegations. Third,
        you can filter the officer squares in view by the officer's ethnicity
        and can sort them by last name or by the amount of allegations against
        them. by the ethnicity of the officer. By giving the user a graphical
        interface to view all of the data with visual clues about key data
        points, they are invited to peruse the data and maybe look at records
        they might have never looked at before.
      </p>
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
