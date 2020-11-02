import React from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { compileComplaints } from '../utils';
import { legend, dropdownOptions } from './formOptions';
import { LoadingButton } from './LoadingButton';
import { ComplaintsWithAllegations } from '../ComplaintsWithAllegations';
import { AllegationsTable } from '../AllegationsTable';

export const SunburstHOC = (SunburstComponent, options) => {
  return class SunburstForm extends React.Component {
    constructor() {
      super();
      this.state = {
        graphAttr: [],
        complaintGraphData: [],
        queryResults: [],
        currentView: [],
        slice1: '',
        slice2: '',
        slice3: '',
        isLoading: false,
        isQueryLoading: false,
        curOffset: 0,
        totalQueryCount: 0,
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

    setCurrentView = (currentView) => {
      this.setState({ currentView });
    };
    makeString = (offset = 0) => {
      console.log('offset in makestr', offset);
      const { slice1, slice2, slice3, currentView } = this.state;
      const currentViews = currentView.slice(1);
      let arr = [];
      for (let i = 0; i < currentViews.length; i++) {
        const key = this.state['slice' + [i + 1]];
        // console.log('LLLL', legend);
        // console.log('KKKK', key);
        // console.log(legend[key]);
        let str = '';
        str += this.state['slice' + [i + 1]];
        str += '=';
        str += currentViews[i];
        arr.push(str);
      }
      arr.push(`offset=${offset}`);
      console.log('arrrrrrr', arr);
      return arr.join('&');
    };
    currentViewDisplay = () => {
      // grab the slice of this.state.currentView from 1
      // if that has a length, continue
      const { slice1, slice2, slice3 } = this.state;
      let str = '';
      const curView = this.state.currentView.slice(1);
      if (curView.length) {
        let sub = legend[this.state.slice1] + curView[0];
      }
    };

    handleQuery = (offset = 0) => {
      // send query to API to get all allegations where up to 3 things are true
      // set these allegations on state, and then use the complaints component to list all complaints
      const { curOffset } = this.state;
      console.log('this.state in handleQuery', this.state);
      console.log('offsetWhat?', offset);
      this.setState({ isQueryLoading: true });
      axios
        .get(`/api/allegations?${this.makeString(offset + curOffset)}`)
        .then(({ data }) => {
          this.setState((state) => ({
            queryResults: data.data,
            isQueryLoading: false,
            totalQueryCount: data.count,
            curOffset: state.curOffset + offset,
          }));
        })
        .catch((e) => console.error(e));
    };
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

    navigate = (change) => {
      this.handleQuery(change);
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
                  <LoadingButton
                    isLoading={this.state.isLoading}
                    buttonText="Make Graph"
                    type="submit"
                  />
                </Col>
              </Row>
            </Form>
            <SunburstComponent
              currentView={this.state.currentView}
              setCurrentView={this.setCurrentView}
              handleQuery={this.handleQuery}
              data={this.state.complaintGraphData}
              {...this.state}
              {...this.props}
            />

            {/* <ComplaintsWithAllegations
              groupedComplaints={this.state.queryResults}
            /> */}
            {this.state.queryResults.length ? (
              <AllegationsTable
                allegations={this.state.queryResults}
                total={this.state.totalQueryCount}
                handleQuery={this.handleQuery}
                curOffset={this.state.curOffset}
              />
            ) : null}
          </div>
        </div>
      );
    }
  };
};
