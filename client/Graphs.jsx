import React from 'react';
import { FilterButton } from './FilterButton';
import { Link } from 'react-router-dom';
import { Loading } from './Loading';
import * as d3 from 'd3';

export const Graphs = (props) => {
  const { officers, filter, setFilter, ethnicities, setSortType } = props;
  const ethnicityKeys = Object.keys(ethnicities).sort(
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
  const height = 20000;
  const width = 1000;
  const yScale = d3
    .scaleLinear()
    .domain([0, officers.length])
    .range([0, height * 2]);

  const complaintScale = d3.scaleLinear().domain([0, 75]).range([0, width]);
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
        <svg width={width} height={height * 2}>
          {officers
            .filter((element) => {
              for (const category in filter) {
                if (filter[category] === 'all') return true;
                if (element[category] !== filter[category]) return false;
              }
              return true;
            })
            .map((officer, idx) => {
              return (
                <Link key={officer.mosId} to={`/cops/${officer.mosId}`}>
                  <rect
                    id={officer.mosId}
                    y={yScale(idx)}
                    x={0}
                    width={complaintScale(officer.complaints.length)}
                    height={5}
                    fill={colorKey[officer.ethnicity]}
                  >
                    <title>{`${officer.firstName} ${officer.lastName}`}</title>
                  </rect>
                </Link>
              );
            })}
        </svg>
      </div>
    </div>
  ) : (
    <Loading />
  );
};
