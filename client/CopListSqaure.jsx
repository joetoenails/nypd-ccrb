import React from 'react';
import { Link } from 'react-router-dom';

export const CopListSquare = ({ officer }) => {
  const opacity = officer.complaints.length / 75;
  const colors = {
    backgroundColor: `rgba(0,0,255,${opacity})`,
  };
  return (
    <Link to={`/cops/${officer.mosId}`}>
      <div
        key={officer.mosId}
        className="officer-list-square"
        style={colors}
        title={`${officer.lastName}, ${officer.firstName}\nTotal allegations: ${officer.complaints.length}
        `}
      ></div>
    </Link>
  );
};
