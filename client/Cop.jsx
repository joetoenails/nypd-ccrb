import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { compileComplaints } from './utils';
import { Loading } from './Loading';
import axios from 'axios';
import Tablesaw from 'tablesaw';
import { ComplaintRow } from './ComplaintRow';
import { SunburstStaticData } from './Sunburst/SunburstStaticData';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const Cop = (props) => {
  const { id } = useParams();
  const [officer, setOfficer] = useState({});
  useEffect(() => {
    axios.get(`/api/cops/${id}`).then(({ data }) => setOfficer(data));
  }, []);

  const [complaints, setComplaints] = useState([]);
  useEffect(() => {
    axios.get(`/api/complaints?officer=${id}`).then(({ data }) => {
      setComplaints(data);
    });
  }, []);

  const [chartData, setChartData] = useState({});
  useEffect(() => {
    axios
      .post(`/api/burst?officer=${id}`, {
        firstLayer: 'fadoType',
        secondLayer: 'complaintEthnicity',
      })
      .then(({ data }) => {
        console.log(data);
        setChartData(data);
      });
  }, []);

  useEffect(() => {
    Tablesaw.init();
  });
  if (!officer || !complaints.length) return <Loading />;

  const groupedComplaints = compileComplaints(complaints);
  console.log('cs', complaints, 'gcs', groupedComplaints);
  console.log('chartData', chartData);
  return (
    <>
      <Row className="align-items-center">
        <Col md={6}>
          <h2>
            Name: {officer.lastName}, {officer.firstName}
          </h2>
          <h4>Ethnicity: {officer.ethnicity}</h4>
          <h4>Gender: {officer.gender === 'M' ? 'Male' : 'Female'}</h4>
          <h4>Badge #: {officer.badge === '0' ? 'Unknown' : officer.badge}</h4>
          <h4>Total Complaints: {Object.keys(groupedComplaints).length}</h4>
          <h4>Total Allegations: {complaints.length}</h4>
        </Col>
        <Col md={6} className="align-text-center">
          <SunburstStaticData data={chartData} />
          <div className="caption">
            <p>Allegations by category, then by complaint ethnicity</p>
          </div>
        </Col>
      </Row>

      <div>
        {Object.keys(groupedComplaints).map((group) => {
          return (
            <div key={group} className="complaint-container">
              <h4>Complaint #: {group}</h4>
              <h5>
                Complaint Received: {groupedComplaints[group][0].monthReceived}/
                {groupedComplaints[group][0].yearReceived}
              </h5>

              <table
                className="tablesaw table-hover"
                data-tablesaw-mode="stack"
              >
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
                    return (
                      <ComplaintRow key={complaint.id} complaint={complaint} />
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </>
  );
};
