import React from 'react';
import { Link } from 'react-router-dom';

export const CopListSquare = ({ officer }) => {
  const opacity = officer.count / 75;
  const colors = {
    backgroundColor: `rgba(0,0,255,${opacity})`,
  };
  return (
    <Link to={{ pathname: `/cop/${officer.unique_mos_id}` }}>
      <div
        key={officer.unique_mos_id}
        className="officer-list-square"
        style={colors}
        title={`${officer.last_name}, ${officer.first_name} | ${officer.mos_ethnicity}\nTotal allegations: ${officer.count}`}
      ></div>
    </Link>
  );
};
