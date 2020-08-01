import React from 'react';

export const Complaint = (props) => {
  const { complaint } = props;

  return (
    <>
      {!complaint ? (
        'Loading'
      ) : (
        <>
          <div>
            Date Opened: {complaint.monthReceived}, {complaint.yearReceived}
          </div>
          <div>
            Date Closed: {complaint.monthClosed}, {complaint.yearClosed}
          </div>
          <div>
            Officer Info Officer Age: {complaint.officerAge}
            <div>
              <div> Officer Command: {complaint.officerCommand}</div>
              <div> Officer Rank at Incident: {complaint.officerRank}</div>
              <div> Precinct: {complaint.precinct}</div>
            </div>
          </div>

          <div>
            Victim Info
            <div>
              <div>Age: {complaint.complaintAge}</div>
              <div>Ethnicity: {complaint.complaintEthnicity}</div>
              <div>Gender: {complaint.complaintGender}</div>
            </div>
          </div>
          <div>Reason for Interaction: {complaint.contactReason}</div>
          <div>Outcome of Interaction: {complaint.outcome}</div>
          <div>Complaint General: {complaint.fadoType}</div>
          <div>Complaint Detail: {complaint.allegation}</div>
          <div>Board Outcome: {complaint.boardDisposition}</div>
        </>
      )}
    </>
  );
};
