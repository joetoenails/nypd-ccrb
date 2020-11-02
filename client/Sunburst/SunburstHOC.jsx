import React from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { legend, dropdownOptions } from './formOptions';
import { LoadingButton } from './LoadingButton';
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
      const { slice1, slice2, slice3, currentView } = this.state;
      const currentViews = currentView.slice(1);
      let arr = [];
      for (let i = 0; i < currentViews.length; i++) {
        const key = this.state['slice' + [i + 1]];
        let str = '';
        str += this.state['slice' + [i + 1]];
        str += '=';
        str += currentViews[i];
        arr.push(str);
      }
      arr.push(`offset=${offset}`);

      return arr.join('&');
    };
    currentViewDisplay = () => {
      // grab the slice of this.state.currentView from 1
      // if that has a length, continue
      const { slice1, slice2, slice3, currentView } = this.state;
      let arr = [];
      const currentViews = currentView.slice(1);
      for (let i = 0; i < currentViews.length; i++) {
        const key = this.state['slice' + [i + 1]];
        let str = '';
        str += legend[this.state['slice' + [i + 1]]];
        str += ' is ';
        str += currentViews[i];
        arr.push(str);
      }
      if (arr.length === 0) return '';

      return 'All Allegations where ' + arr.join(' and ');
    };

    handleQuery = (options) => {
      const { offset, isFirst, isLast } = options;
      const { curOffset, totalQueryCount } = this.state;
      let actualOffset = offset + curOffset;
      if (isFirst) {
        actualOffset = curOffset * 0;
      }
      if (isLast) {
        actualOffset = Math.floor(totalQueryCount / offset) * offset;
      }
      this.setState({ isQueryLoading: true });
      axios
        .get(`/api/allegations?${this.makeString(actualOffset)}`)
        .then(({ data }) => {
          this.setState((state) => ({
            queryResults: data.data,
            isQueryLoading: false,
            totalQueryCount: data.count,
            curOffset: actualOffset,
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
              currentViewDisplay={this.currentViewDisplay}
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
                NUMRESULTS={30}
                description={this.currentViewDisplay()}
              />
            ) : null}
          </div>
        </div>
      );
    }
  };
};
