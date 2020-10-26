import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export const CopAccordion = ({ relatedCops, officer }) => {
  return (
    <Accordion>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
          Other Officers listed in complaints with {officer.last_name} &#9660;
        </Accordion.Toggle>

        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <ul className="related-officer-table">
              {Object.keys(relatedCops)
                .sort((a, b) => relatedCops[b].length - relatedCops[a].length)
                .map((key, i) => (
                  <li key={key + i}>
                    <span className="officer-name">
                      <Link to={`/cop/${relatedCops[key][0].unique_mos_id}`}>
                        {relatedCops[key][0].last_name},{' '}
                        {relatedCops[key][0].first_name}
                      </Link>
                    </span>
                    :{' '}
                    {relatedCops[key].map((complaint, i, self) => {
                      return (
                        <span key={complaint.complaint_id}>
                          <Link to={`/complaint/${complaint.complaint_id}`}>
                            {complaint.complaint_id}
                          </Link>
                          {i !== self.length - 1 && ', '}
                        </span>
                      );
                    })}
                  </li>
                ))}
            </ul>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};
