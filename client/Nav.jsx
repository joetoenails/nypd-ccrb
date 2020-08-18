import React from 'react';
import { Link } from 'react-router-dom';

export const Nav = (props) => {
  return (
    <div className="nav">
      <ul>
        <li>
          <Link to={'/'}>HOME</Link>
        </li>
        <li>
          <Link to={'/squares'}>SQUARES</Link>
        </li>
        <li>
          <Link to={'/graphs'}>GRAPHS</Link>
        </li>
        <li>
          <Link to={'/graphsethnicity'}>GRAPHS Eths</Link>
        </li>
      </ul>
    </div>
  );
};
