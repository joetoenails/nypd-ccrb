import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Complaint } from './Complaint';
import { compileComplaints } from './utils';
import { Loading } from './Loading';
import axios from 'axios';

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

  if (!officer || !complaints.length) return <Loading />;

  const groupedComplaints = compileComplaints(complaints);
  console.log('cs', complaints, 'gcs', groupedComplaints);
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
