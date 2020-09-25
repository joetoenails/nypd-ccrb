import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Complaint } from './Complaint';
import { compileComplaints } from './utils';
import { Loading } from './Loading';
import axios from 'axios';
import Tablesaw from 'tablesaw';
import { ComplaintRow } from './ComplaintRow';

export const Cop = (props) => {
  const { id } = useParams();
  const [officer, setOfficer] = useState({});
  useEffect(() => {
    axios.get(`/api/cops/${id}`).then(({ data }) => setOfficer(data));
  }, []);

  const [complaints, setComplaints] = useState([]);
  useEffect(() => {
    axios.get(`/api/complaints?officer=${id}`).then(({ data }) => {
      console.log('complaints', data);
      setComplaints(data);
    });
  }, []);

  useEffect(() => {
    Tablesaw.init();
  });
  if (!officer || !complaints.length) return <Loading />;

  const groupedComplaints = compileComplaints(complaints);
  console.log('cs', complaints, 'gcs', groupedComplaints);

  return (
    <>
      <h2>
        Name: {officer.lastName}, {officer.firstName}
      </h2>
      <h4>Ethnicity: {officer.ethnicity}</h4>
      <h4>Gender: {officer.gender === 'M' ? 'Male' : 'Female'}</h4>
      <h4>Badge #: {officer.badge === '0' ? 'Unknown' : officer.badge}</h4>

      <div>
        <ul>
          {Object.keys(groupedComplaints).map((group) => {
            return (
              <div className="complaint-container">
                <h4>
                  Complaint Received:{' '}
                  {groupedComplaints[group][0].monthReceived}/
                  {groupedComplaints[group][0].yearReceived}
                </h4>

                <table className="tablesaw" data-tablesaw-mode="stack">
                  <thead>
                    <tr>
                      <th scope="col">Allegation</th>
                      <th scope="col" data-tablesaw-priority="4">
                        Officer Rank
                      </th>
                      <th scope="col" data-tablesaw-priority="4">
                        Complaintant
                      </th>
                      <th scope="col">Reason for Interaction</th>

                      <th scope="col">Board Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedComplaints[group].map((complaint) => {
                      return <ComplaintRow complaint={complaint} />;
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </ul>
      </div>
    </>
  );
};
