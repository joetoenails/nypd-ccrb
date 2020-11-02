import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { compileComplaints } from './utils';
import { Loading } from './Loading';
import axios from 'axios';
import Tablesaw from 'tablesaw';
import { SunburstStaticData } from './Sunburst/SunburstStaticData';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CopAccordion } from './CopAccordion';
import { ComplaintsWithAllegations } from './ComplaintsWithAllegations';

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
  const [relatingLoading, setRelatingLoading] = useState(false);
  useEffect(() => {
    setRelatingLoading(true);
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
      setRelatingLoading(false);
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
          <CopAccordion
            relatedCops={relatedCops}
            officer={officer}
            relatingLoading={relatingLoading}
          />
        </Col>
        <Col md={6} className="align-text-center">
          <SunburstStaticData data={chartData} />
          <div className="caption">
            <p>Allegations by category, then by complaint ethnicity</p>
          </div>
        </Col>
      </Row>

      <div>
        <ComplaintsWithAllegations groupedComplaints={groupedComplaints} />
      </div>
    </>
  );
};
