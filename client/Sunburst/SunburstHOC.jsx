import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const options = [
  { value: 'complaintEthnicity', description: 'Complainant Ethnicity' },
  { value: 'complaintGender', description: 'Complainant Gender' },
  { value: 'complaintAge', description: 'Complainant Age' },
  { value: 'fadoType', description: 'Complaint Category' },
  { value: 'allegation', description: 'Specific Allegation' },
  { value: 'precinct', description: 'Officer Precinct' },
  { value: 'officerAge', description: 'Officer Age at Incident' },
  { value: 'officerRank', description: 'Officer Rank at Incident' },
  { value: 'officerCommand', description: 'Officer Command' },
  { value: 'contactReason', description: 'Reason for Police Contact' },
  { value: 'outcome', description: 'Outcome of Police Interaction' },
  { value: 'boardDisposition', description: 'CCRB Board Disposition' },
];

export const SunburstHOC = (SunburstComponent) => {
  return class SunburstForm extends React.Component {
    constructor() {
      super();
      this.state = {
        graphAttr: [],
        complaintGraphData: [],
        slice1: 'complaintEthnicity',
        slice2: 'complaintGender',
        slice3: 'fadoType',
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
        .post('/api/burst', {
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
      console.log('change');
      console.log(e.target.name, e.target.value);
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
                    <Form.Label>First Slice</Form.Label>
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
                      {options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.description}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="slice2">
                    <Form.Label>Second Slice</Form.Label>
                    <Form.Control
                      as="select"
                      value={this.state.slice2}
                      name="slice2"
                      onChange={this.handleChange}
                    >
                      {options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.description}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="slice3">
                    <Form.Label>Third Slice</Form.Label>
                    <Form.Control
                      as="select"
                      value={this.state.slice3}
                      name="slice3"
                      onChange={this.handleChange}
                    >
                      {options.map((o) => (
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
