import React from 'react';
import { useParams } from 'react-router-dom';
import { Complaint } from './Complaint';
import { compileComplaints } from './utils';
import { Loading } from './Loading';

export const Cop = ({ officers }) => {
  const { id } = useParams();

  const officer = officers.find((cop) => {
    return cop.mosId === Number(id);
  });
  if (!officer) return <Loading />;

  const groupedComplaints = compileComplaints(officer);

  return (
    <>
      <div>
        Name: {officer.lastName}, {officer.firstName}
      </div>
      <div>ID: {officer.mosId}</div>
      <div>Ethnicity: {officer.ethnicity}</div>
      <div>Gender: {officer.gender}</div>
      <div>
        Complaints:
        <ul>
          {Object.keys(groupedComplaints).map((group) => {
            return (
              <div key={group} className="complaint-group">
                Complaint #: {group}
                {groupedComplaints[group].map((complaint) => {
                  return (
                    <li key={complaint.id} className="complaint">
                      <Complaint complaint={complaint} />
                    </li>
                  );
                })}
              </div>
            );
          })}
        </ul>
      </div>
    </>
  );
};
