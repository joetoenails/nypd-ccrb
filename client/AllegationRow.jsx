import React from 'react';
import { parseComplaintantInfo } from './utils';

export const AllegationRow = (props) => {
  const { complaint } = props;
  // TODO: Write parsing function that deals with Complaintant info incase it is undefined.

  return (
    <>
      {!complaint ? (
        'Loading'
      ) : (
        <tr>
          <td>
            <b className="tablesaw-cell-label">Allegation</b>
            {complaint.fado_type}: {complaint.allegation}
          </td>
          <td>
            <b className="tablesaw-cell-label">Officer Rank </b>
            {complaint.rank_incident}
          </td>
          <td>
            <b className="tablesaw-cell-label">Complainant</b>
            {parseComplaintantInfo(complaint)}
          </td>
          <td>
            <b className="tablesaw-cell-label">Reason For Interacting</b>
            {complaint.contact_reason}
          </td>
          <td>
            <b className="tablesaw-cell-label">Board Outcome</b>
            {complaint.board_disposition}
          </td>
        </tr>
      )}
    </>
  );
};
