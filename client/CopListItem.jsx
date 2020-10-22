import React from 'react';
import { Link } from 'react-router-dom';

export const CopListItem = ({ officer }) => {
  const opacity = officer.complaints.length / 75;
  const colors = {
    backgroundColor: `rgba(0,0,255,${opacity})`,
  };
  return (
    <Link to={{ pathname: `/cop/${officer.mosId}` }}>
      <div key={officer.mosId} className="officer-list-item" style={colors}>
        <div>
          {officer.lastName}, {officer.firstName}
        </div>
        <div>{officer.rankNow}</div>
        <div>Ethnicity: {officer.ethnicity}</div>
        <div>Total Allegations: {officer.complaints.length}</div>
        <div>
          Total Complaints: {Object.keys(officer.uniqueComplaints).length}
        </div>
      </div>
    </Link>
  );
};
