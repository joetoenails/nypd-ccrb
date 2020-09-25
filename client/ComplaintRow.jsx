import React from 'react';

export const ComplaintRow = (props) => {
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
            {complaint.fadoType}: {complaint.allegation}
          </td>
          <td>
            <b className="tablesaw-cell-label">Officer Rank </b>
            {complaint.officerRank}
          </td>
          <td>
            <b className="tablesaw-cell-label">Complaintant</b>
            {complaint.complaintEthnicity} {complaint.complaintGender},{' '}
            {complaint.complaintAge} years old.
          </td>
          <td>
            <b className="tablesaw-cell-label">Reason For Interacting</b>
            {complaint.contactReason}
          </td>
          <td>
            <b className="tablesaw-cell-label">Board Outcome</b>
            {complaint.boardDisposition}
          </td>
        </tr>
      )}
    </>
  );
};
