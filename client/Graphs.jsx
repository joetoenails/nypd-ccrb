import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { FilterButton } from './FilterButton';
import { Link } from 'react-router-dom';
import { Loading } from './Loading';
import Button from 'react-bootstrap/Button';

import * as d3 from 'd3';

export const Graphs = (props) => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth < 800 ? window.innerWidth - 100 : 1000,
  });
  useEffect(() => {
    const handleResize = _.debounce(() => {
      console.log(window.innerWidth);
      const container = document.getElementById('cop-list-container');
      console.log(container.clientWidth);
      setDimensions({
        width: container.clientWidth,
      });
    }, 250);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

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

  const height = officers.length * 20;

  const yScale = d3
    .scaleLinear()
    .domain([0, officers.length])
    .range([0, height]);

  const complaintScale = d3
    .scaleLinear()
    .domain([0, 75])
    .range([0, dimensions.width]);

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
        <svg width={dimensions.width} height={height}>
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
                <Link
                  key={officer.officerMosId}
                  to={`/cops/${officer.officerMosId}`}
                >
                  <rect
                    id={officer.mosId}
                    y={yScale(idx)}
                    x={0}
                    width={complaintScale(officer.count)}
                    height={15}
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
