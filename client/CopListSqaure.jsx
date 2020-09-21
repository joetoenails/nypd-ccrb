import React from 'react';
import { Link } from 'react-router-dom';

export const CopListSquare = ({ officer }) => {
  const opacity = officer.count / 75;
  const colors = {
    backgroundColor: `rgba(0,0,255,${opacity})`,
  };
  return (
    <Link to={`/cops/${officer.officerMosId}`}>
      <div
        key={officer.mosId}
        className="officer-list-square"
        style={colors}
        title={`${officer.lastName}, ${officer.firstName}\nTotal allegations: ${officer.count}
        `}
      ></div>
    </Link>
  );
};
