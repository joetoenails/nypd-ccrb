import React, { useState, useEffect } from 'react';
import { FilterButton } from './FilterButton';
import { Link } from 'react-router-dom';
import { Loading } from './Loading';
import * as d3 from 'd3';
import axios from 'axios';

export const GraphEthnicity = (props) => {
  const {
    officers,
    setFilter,
    filter,
    ethnicities,
    setOfficers,
    setSortType,
  } = props;

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

  const xScale = d3.scaleBand().domain(ethnicityKeys).range([0, width]);
  const yScale = d3.scaleLinear().domain([0, 9000]).range([height, 0]);

  const makeEthObjWithNumOfComplaints = (officers) => {
    const complaintByEthnicity = {};
    officers.forEach((officer) => {
      if (!(officer.ethnicity in complaintByEthnicity))
        complaintByEthnicity[officer.ethnicity] = {};

      let officerEthnicityObj = complaintByEthnicity[officer.ethnicity];

      officer.complaints.forEach((complaint) => {
        if (complaint.complaintEthnicity === '') {
          officerEthnicityObj['Not Recorded']
            ? officerEthnicityObj['Not Recorded']++
            : (officerEthnicityObj['Not Recorded'] = 1);
        } else if (complaint.complaintEthnicity in officerEthnicityObj) {
          officerEthnicityObj[complaint.complaintEthnicity]++;
        } else {
          officerEthnicityObj[complaint.complaintEthnicity] = 1;
        }
      });
    });
    return complaintByEthnicity;
  };

  const complaintsWithCopEth = officers.reduce((all, cur) => {
    const complaintsWithEthnicity = cur.complaints.map((complaint) => ({
      ...complaint,
      officerEthnicity: cur.ethnicity,
    }));
    return all.concat(complaintsWithEthnicity);
  }, []);

  const bigObj = makeEthObjWithNumOfComplaints(officers);
  console.log('$%^&*(', bigObj);
  const height = 2000;
  const width = 600;

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
          {complaintsWithCopEth
            .filter((element) => {
              for (const category in filter) {
                if (filter[category] === 'all') return true;
                if (element[category] !== filter[category]) return false;
              }
              return true;
            })
            .map((officer, idx) => {
              return (
                <rect
                  id={officer.mosId}
                  y={5}
                  x={xScale(officer.ethnicity)}
                  width={5}
                  fill={colorKey[officer.ethnicity]}
                >
                  <title>{`${officer.firstName} ${officer.lastName}`}</title>
                </rect>
              );
            })}
        </svg>
      </div>
    </div>
  ) : (
    <Loading />
  );
};
