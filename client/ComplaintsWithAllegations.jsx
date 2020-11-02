import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Tablesaw from 'tablesaw';

import { AllegationRow } from './AllegationRow';

export const ComplaintsWithAllegations = ({ groupedComplaints }) => {
  useEffect(() => {
    Tablesaw.init();
  }, [groupedComplaints]);

  return Object.keys(groupedComplaints)
    .sort((a, b) => b - a)
    .map((group) => {
      return (
        <div key={group} className="complaint-container">
          <h4>
            Complaint #:{' '}
            <Link to={{ pathname: `/complaint/${group}` }}>{group}</Link>
          </h4>
          <h5>
            Date Received: {groupedComplaints[group][0].month_received}/
            {groupedComplaints[group][0].year_received}
          </h5>

          <table className="tablesaw table-hover" data-tablesaw-mode="stack">
            <thead>
              <tr>
                <th scope="col">Allegation</th>
                <th scope="col" data-tablesaw-priority="4">
                  Officer Rank
                </th>
                <th scope="col" data-tablesaw-priority="4">
                  Complainant
                </th>
                <th scope="col">Reason for Interaction</th>

                <th scope="col">Board Outcome</th>
              </tr>
            </thead>
            <tbody>
              {groupedComplaints[group].map((complaint) => {
                return (
                  <AllegationRow key={complaint.id} complaint={complaint} />
                );
              })}
            </tbody>
          </table>
        </div>
      );
    });
};
