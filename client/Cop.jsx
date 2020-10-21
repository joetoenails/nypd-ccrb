import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { compileComplaints } from './utils';
import { Loading } from './Loading';
import axios from 'axios';
import Tablesaw from 'tablesaw';
import { AllegationRow } from './AllegationRow';
import { SunburstStaticData } from './Sunburst/SunburstStaticData';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

export const Cop = (props) => {
  const { id } = useParams();
  const [officer, setOfficer] = useState({});
  useEffect(() => {
    axios.get(`/api/cops/${id}`).then(({ data }) => setOfficer(data));
  }, []);

  const [allegations, setAllegations] = useState([]);
  useEffect(() => {
    axios.get(`/api/allegations?officer=${id}`).then(({ data }) => {
      setAllegations(data);
    });
  }, []);

  const [chartData, setChartData] = useState({});
  useEffect(() => {
    axios
      .post(`/api/burst?officer=${id}`, {
        firstLayer: 'fado_type',
        secondLayer: 'complainant_ethnicity',
      })
      .then(({ data }) => {
        setChartData(data);
      });
  }, []);

  useEffect(() => {
    Tablesaw.init();
  });
  if (!officer || !allegations.length || !chartData.name) return <Loading />;

  const groupedComplaints = compileComplaints(allegations);
  return (
    <>
      <Row className="align-items-center">
        <Col md={6}>
          <h2>
            Name: {officer.last_name}, {officer.first_name}
          </h2>
          <h4>Ethnicity: {officer.mos_ethnicity}</h4>
          <h4>Gender: {officer.mos_gender === 'M' ? 'Male' : 'Female'}</h4>
          <h4>
            Badge #: {officer.shield_no === 0 ? 'Unknown' : officer.shield_no}
          </h4>
          <h4>Total Complaints: {Object.keys(groupedComplaints).length}</h4>
          <h4>Total Allegations: {allegations.length}</h4>
          <h4>Current Command: {officer.command_now}</h4>
        </Col>
        <Col md={6} className="align-text-center">
          <SunburstStaticData data={chartData} />
          <div className="caption">
            <p>Allegations by category, then by complaint ethnicity</p>
          </div>
        </Col>
      </Row>

      <div>
        {Object.keys(groupedComplaints)
          .sort((a, b) => b - a)
          .map((group) => {
            return (
              <div key={group} className="complaint-container">
                <h4>
                  Complaint #: <Link to={`/complaint/${group}`}>{group}</Link>
                </h4>
                <h5>
                  Date Received: {groupedComplaints[group][0].month_received}/
                  {groupedComplaints[group][0].year_received}
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
                        Complainant
                      </th>
                      <th scope="col">Reason for Interaction</th>

                      <th scope="col">Board Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedComplaints[group].map((complaint) => {
                      return (
                        <AllegationRow
                          key={complaint.id}
                          complaint={complaint}
                        />
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
