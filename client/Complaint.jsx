import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loading } from './Loading';
import { parseComplaintantInfo } from './utils';
import Tablesaw from 'tablesaw';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const Complaint = (props) => {
  const { id } = useParams();
  const [allegations, setAllegations] = useState([]);
  const [officers, setOfficers] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(`/api/complaint/${id}`);
        setAllegations(data);
        const officerIds = getUniqueOfficers(data);
        const officerResponse = await Promise.all(
          officerIds.map((id) => axios.get(`/api/allegations?officer=${id}`))
        );

        setOfficers(officerResponse.map((r) => r.data));
      } catch (error) {}
    }
    fetchData();
  }, []);
  const getUniqueOfficers = (complaints) => {
    const officers = {};
    complaints.forEach((c) => {
      if (!(c.unique_mos_id in officers)) {
        officers[c.unique_mos_id] = true;
      }
    });
    return Object.keys(officers);
  };

  useEffect(() => {
    Tablesaw.init();
  });
  console.log('officers', officers);
  return (
    <>
      {!allegations.length ? (
        <Loading />
      ) : (
        <>
          <Row>
            <Col>
              <h2>Complaint #: {allegations[0].complaint_id}</h2>
              <div>
                <span className="complaint-descriptor">Date Opened: </span>
                {allegations[0].month_received}, {allegations[0].year_received}
              </div>
              <div>
                <span className="complaint-descriptor">Date Closed: </span>
                {allegations[0].month_closed}, {allegations[0].year_closed}
              </div>
              <div>
                <span className="complaint-descriptor">
                  Reason for Police contact:{' '}
                </span>{' '}
                {allegations[0].contact_reason}
              </div>
              <div>
                <span className="complaint-descriptor">
                  Outcome of Police contact:{' '}
                </span>
                {allegations[0].outcome_description}
              </div>
              <div>
                <span className="complaint-descriptor">Precinct: </span>
                {allegations[0].precinct}
              </div>
            </Col>
            <Col>
              <h2>Officers Involved : Total Allegations</h2>
              {officers.map((o) => {
                return (
                  <div
                    key={o[0].unique_mos_id}
                    className="complaint-officer-detail"
                  >
                    <span>
                      {o[0].first_name} {o[0].last_name}: {o.length}
                    </span>
                  </div>
                );
              })}
            </Col>
          </Row>
          <table className="tablesaw table-hover" data-tablesaw-mode="stack">
            <thead>
              <tr>
                <th scope="col">Officer</th>
                <th scope="col" data-tablesaw-priority="4">
                  Officer Details at Incident
                </th>
                <th scope="col">Complainant Details</th>
                <th scope="col">Allegations</th>
                <th scope="col">Board Outcome</th>
              </tr>
            </thead>
            <tbody>
              {allegations.map((allegation) => {
                return (
                  <tr key={allegation.id}>
                    <td>
                      <b className="tablesaw-cell-label">Officer</b>
                      <Link
                        to={{ pathname: `/cop/${allegation.unique_mos_id}` }}
                      >
                        {allegation.first_name} {allegation.last_name}{' '}
                      </Link>
                    </td>
                    <td>
                      <b className="tablesaw-cell-label">Officer Details</b>
                      {parseComplaintantInfo(allegation, false)}.{' '}
                      {allegation.rank_incident}
                    </td>
                    <td>
                      <b className="tablesaw-cell-label">Complainant Details</b>
                      {parseComplaintantInfo(allegation)}
                    </td>
                    <td>
                      <b className="tablesaw-cell-label">Allegations</b>
                      {allegation.fado_type}: {allegation.allegation}
                    </td>

                    <td>
                      <b className="tablesaw-cell-label">Board Outcome</b>
                      {allegation.board_disposition}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};
