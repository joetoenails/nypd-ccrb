import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const dropdownOptions = [
  { value: '', description: 'Choose Layer' },
  { value: 'complainant_ethnicity', description: 'Complainant Ethnicity' },
  { value: 'complainant_gender', description: 'Complainant Gender' },
  { value: 'complainant_age_incident', description: 'Complainant Age' },
  { value: 'fado_type', description: 'Complaint Category' },
  { value: 'allegation', description: 'Specific Allegation' },
  { value: 'precinct', description: 'Officer Precinct' },
  { value: 'mos_age_incident', description: 'Officer Age at Incident' },
  { value: 'mos_gender', description: 'Officer Gender at Incident' },
  { value: 'rank_incident', description: 'Officer Rank at Incident' },
  { value: 'command_at_incident', description: 'Officer Command' },
  { value: 'contact_reason', description: 'Reason for Police Contact' },
  {
    value: 'outcome_description',
    description: 'Outcome of Police Interaction',
  },
  { value: 'board_disposition', description: 'CCRB Board Disposition' },
];

export const SunburstHOC = (SunburstComponent, options) => {
  return class SunburstForm extends React.Component {
    constructor() {
      super();
      this.state = {
        graphAttr: [],
        complaintGraphData: [],
        slice1: '',
        slice2: '',
        slice3: '',
        isLoading: false,
      };
    }

    componentDidMount() {
      // get complaints and put them in the tree order with helper func
      // pass the complaintGraphData as data down to sunburst
      // maybe keep a cached version of the json on the server to send back as init data?
    }

    // TODO: make function here to pass down to graph for fetching relevent complaint data for clickable
    // pie area
    // set that on to complaint view data and render in another component below for (probalby table) for cop data
    // make tree info on serverside and send json of tree ONLY to data

    handleSubmit = (e) => {
      e.preventDefault();
      const { slice1, slice2, slice3 } = this.state;
      this.setState({ isLoading: true });
      axios
        .post(`/api/burst?type=${options.type}`, {
          slice1,
          slice2,
          slice3,
        })
        .then((res) => {
          this.setState({
            complaintGraphData: res.data,
            isLoading: false,
          });
        });
    };
    handleChange = (e) => {
      this.setState({ [e.target.name]: e.target.value });
    };
    isDisabled = (currentSlice, value) => {
      switch (currentSlice) {
        case 'slice1':
          return this.state.slice2 === value || this.state.slice3 === value;
        case 'slice2':
          return this.state.slice3 === value || this.state.slice1 === value;
        case 'slice3':
          return this.state.slice1 === value || this.state.slice2 === value;
      }
    };

    render() {
      return (
        <div>
          <div>
            <Form className="sunburst-form" onSubmit={this.handleSubmit}>
              <Row className="form-row">
                <Col md={3}>
                  <Form.Group controlId="slice1">
                    <Form.Label>First Layer</Form.Label>
                    <Form.Control
                      as="select"
                      value={this.state.slice1}
                      name="slice1"
                      onChange={this.handleChange}
                    >
                      {/* <option
                        disabled={this.isDisabled(
                          'slice1',
                          'complaintEthnicity'
                        )}
                        value="complaintEthnicity"
                      >
                        Complainant Ethnicity
                      </option> */}
                      {dropdownOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.description}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="slice2">
                    <Form.Label>Second Layer</Form.Label>
                    <Form.Control
                      as="select"
                      value={this.state.slice2}
                      name="slice2"
                      onChange={this.handleChange}
                    >
                      {dropdownOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.description}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="slice3">
                    <Form.Label>Third Layer</Form.Label>
                    <Form.Control
                      as="select"
                      value={this.state.slice3}
                      name="slice3"
                      onChange={this.handleChange}
                    >
                      {dropdownOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.description}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  {this.state.isLoading ? (
                    <Button
                      className="form-button"
                      variant="primary"
                      block
                      disabled
                    >
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        style={{ marginRight: '10px' }}
                      />
                      Loading
                    </Button>
                  ) : (
                    <Button
                      className="form-button"
                      type="submit"
                      block
                    >{`Make \n Graph`}</Button>
                  )}
                </Col>
              </Row>
            </Form>
            <SunburstComponent
              data={this.state.complaintGraphData}
              {...this.props}
            />
          </div>
        </div>
      );
    }
  };
};
