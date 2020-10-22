import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { FilterButton } from './FilterButton';
import { Link } from 'react-router-dom';
import { Loading } from './Loading';
import Button from 'react-bootstrap/Button';

import * as d3 from 'd3';

export const Bars = (props) => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth < 800 ? window.innerWidth - 100 : 1000,
  });
  useEffect(() => {
    const handleResize = _.debounce(() => {
      const container = document.getElementById('cop-list-container');
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
      <h1>Bars</h1>
      <p>
        Bars has the same idea as Squares: to encourage the user to actively
        peruse the data. This time each bar represents an NYPD Officer and all
        3396 officers appear on the screen at the same time. Second, the length
        of the bar represents how many allegations each officer has filed
        against them in the CCRB database: the longer the bar, the more
        allegations. Third, you can sort by the amount of complaints or by last
        name and can filter by the ethnicity of the officer. By giving the user
        a graphical interface to view all of the data with visual clues about
        key data points, they are invited to peruse the data and maybe look at
        records they might have never looked at before.
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
            onClick={() => setSortType('last_name')}
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
                  key={officer.unique_mos_id}
                  to={{ pathname: `/cop/${officer.unique_mos_id}` }}
                >
                  <rect
                    id={officer.unique_mos_id}
                    y={yScale(idx)}
                    x={0}
                    width={complaintScale(officer.count)}
                    height={15}
                    fill={colorKey[officer.mos_ethnicity]}
                  >
                    <title>{`${officer.last_name}, ${officer.first_name} | ${officer.mos_ethnicity} \nTotal Allegations: ${officer.count}`}</title>
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
