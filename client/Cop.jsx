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
import { CopAccordion } from './CopAccordion';
import { Link } from 'react-router-dom';

export const Cop = (props) => {
  const { id } = useParams();
  const [error, setError] = useState({});
  const [officer, setOfficer] = useState({});
  useEffect(() => {
    axios
      .get(`/api/cops/${id}`)
      .then(({ data }) => {
        setOfficer(data);
      })
      .catch((e) => {
        console.error('dis error', e.message);
        setError(e);
      });
  }, [id]);

  const [allegations, setAllegations] = useState([]);
  useEffect(() => {
    axios.get(`/api/allegations?officer=${id}`).then(({ data }) => {
      setAllegations(data);
    });
  }, [id]);

  const [chartData, setChartData] = useState({});
  useEffect(() => {
    axios
      .post(`/api/burst?officer=${id}`, {
        firstLayer: 'fado_type',
        secondLayer: 'complainant_ethnicity',
      })
      .then(({ data }) => {
        setChartData(data);
      })
      .catch((e) => {
        console.log('error in setChart', e);
      });
  }, [id]);

  const [relatedCops, setRelatedCops] = useState({});
  useEffect(() => {
    axios.get(`/api/cops/related?officer=${id}`).then(({ data }) => {
      const groupById = data.reduce((copsById, allegation) => {
        if (allegation.unique_mos_id in copsById) {
          copsById[allegation.unique_mos_id].push(allegation);
        } else {
          copsById[allegation.unique_mos_id] = [allegation];
        }
        return copsById;
      }, {});

      setRelatedCops(groupById);
    });
  }, [id]);

  useEffect(() => {
    Tablesaw.init();
  });
  if (error.message) return error.message;
  if (!officer || !allegations.length || !chartData.name) return <Loading />;

  const groupedComplaints = compileComplaints(allegations);

  return (
    <>
      <Row className="align-items-center">
        <Col md={6} className="officer-box">
          <h2>
            {officer.last_name}, {officer.first_name}
          </h2>
          <h5>
            {officer.mos_ethnicity}{' '}
            {officer.mos_gender === 'M' ? 'Male' : 'Female'}
          </h5>
          <h5>
            Badge #: {officer.shield_no === 0 ? 'Unknown' : officer.shield_no}
          </h5>
          <h5>Total Complaints: {Object.keys(groupedComplaints).length}</h5>
          <h5>Total Allegations: {allegations.length}</h5>
          <h5>
            Current: {officer.rank_now} at {officer.command_now}
          </h5>
          <CopAccordion relatedCops={relatedCops} officer={officer} />
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
                  Complaint #:{' '}
                  <Link to={{ pathname: `/complaint/${group}` }}>{group}</Link>
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
