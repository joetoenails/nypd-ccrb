import React, { useEffect } from 'react';
import { parseComplaintantInfo } from './utils';
import Tablesaw from 'tablesaw';
import Pagination from 'react-bootstrap/Pagination';
import { Link } from 'react-router-dom';

export const AllegationsTable = (props) => {
  const {
    allegations,
    total,
    handleQuery,
    curOffset,
    NUMRESULTS,
    description,
  } = props;

  const isDisabled = (isNext) => {
    if (isNext) {
      return NUMRESULTS + curOffset > total;
    }
    return curOffset - NUMRESULTS < 0;
  };

  useEffect(() => {
    Tablesaw.init();
  });
  return (
    <>
      <p>{description}</p>
      <hr />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>
          Page {Math.floor(curOffset / NUMRESULTS) + 1} of{' '}
          {Math.ceil(total / NUMRESULTS)}
        </p>
        <Pagination>
          <Pagination.First
            disabled={isDisabled(false)}
            onClick={() => handleQuery({ isFirst: true })}
          />
          <Pagination.Prev
            disabled={isDisabled(false)}
            onClick={() => handleQuery({ offset: -NUMRESULTS })}
          />
          <Pagination.Next
            disabled={isDisabled(true)}
            onClick={() => handleQuery({ offset: NUMRESULTS })}
          />
          <Pagination.Last
            disabled={isDisabled(true)}
            onClick={() => handleQuery({ offset: NUMRESULTS, isLast: true })}
          />
        </Pagination>
      </div>
      <table className="tablesaw table-hover" data-tablesaw-mode="stack">
        <thead>
          <tr>
            <th scope="col">Officer</th>
            <th scope="col" data-tablesaw-priority="4">
              Officer Rank
            </th>
            <th scope="col" data-tablesaw-priority="4">
              Officer Details
            </th>
            <th scope="col">Complainant Details</th>

            <th scope="col">Board Outcome</th>
          </tr>
        </thead>
        <tbody>
          {allegations.map((a) => {
            return (
              <tr key={a.id}>
                <td>
                  <b className="tablesaw-cell-label">Officer</b>
                  <Link to={`/cop/${a.unique_mos_id}`}>
                    {a.first_name} {a.last_name}
                  </Link>
                </td>
                <td>
                  <b className="tablesaw-cell-label">Officer Rank </b>
                  {a.rank_incident}
                </td>
                <td>
                  <b className="tablesaw-cell-label">Officer Details</b>
                  {parseComplaintantInfo(a, false)}
                </td>
                <td>
                  <b className="tablesaw-cell-label">Complainant Details</b>
                  {parseComplaintantInfo(a)}
                </td>
                <td>
                  <b className="tablesaw-cell-label">Board Outcome</b>
                  {a.board_disposition}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination>
        <Pagination.First
          disabled={isDisabled(false)}
          onClick={() => handleQuery({ isFirst: true })}
        />
        <Pagination.Prev
          disabled={isDisabled(false)}
          onClick={() => handleQuery({ offset: -NUMRESULTS })}
        />
        <Pagination.Next
          disabled={isDisabled(true)}
          onClick={() => handleQuery({ offset: NUMRESULTS })}
        />
        <Pagination.Last
          disabled={isDisabled(true)}
          onClick={() => handleQuery({ offset: NUMRESULTS, isLast: true })}
        />
      </Pagination>
    </>
  );
};
