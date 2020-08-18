import React from 'react';
import { Link } from 'react-router-dom';

export const Nav = (props) => {
  return (
    <>
      <Link to={'/'}>HOME</Link>
      <Link to={'/cops'}>COPS</Link>
      <Link to={'/graphs'}>GRAPHS</Link>
      <Link to={'/graphsethnicity'}>GRAPHS Eths</Link>
    </>
  );
};
