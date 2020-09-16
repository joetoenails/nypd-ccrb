import React from 'react';
import { SunburstClassZoom } from './SunburstClassZoom';
import axios from 'axios';

export class SunburstHOCZoom extends React.Component {
  constructor() {
    super();
    this.state = {
      graphAttr: [],
      complaintGraphData: [],
      firstSlice: 'complaintEthnicity',
      secondSlice: 'complaintGender',
      thirdSlice: 'fadoType',
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
    const { firstSlice, secondSlice, thirdSlice } = this.state;
    axios
      .post('/api/burst', {
        firstSlice,
        secondSlice,
        thirdSlice,
      })
      .then((res) => {
        this.setState({
          complaintGraphData: res.data,
        });
      });
  };
  handleChange = (e) => {
    console.log('change');
    console.log(e.target.name, e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };
  isDisabled = (e) => {
    return true;
  };
  render() {
    console.log('state', this.state);
    return (
      <div>
        <p>
          Select three categories from dropdown menus to populate pie chart. The
          categories begin at the center of the chart and their subdivisions
          move further out.
        </p>
        <div>
          <form onSubmit={this.handleSubmit}>
            <select
              value={this.state.firstSlice}
              name="firstSlice"
              onChange={this.handleChange}
            >
              <option value="complaintEthnicity">Complainant Ethnicity</option>
              <option value="complaintGender">Complainant Gender</option>
              <option value="fadoType">Complaint Category</option>
              <option value="allegation">Specific Type</option>
              <option value="contactReason">Contact Reason</option>
              <option value="outcome">Outcome</option>
              <option value="boardDisposition">Board Disposition</option>
            </select>
            <select
              name="secondSlice"
              value={this.state.secondSlice}
              onChange={this.handleChange}
            >
              <option value="complaintEthnicity">Complainant Ethnicity</option>
              <option value="complaintGender">Complainant Gender</option>
              <option value="fadoType">Complaint Category</option>
              <option value="allegation">Specific Type</option>
              <option value="contactReason">Contact Reason</option>
              <option value="outcome">Outcome</option>
              <option value="boardDisposition">Board Disposition</option>
            </select>
            <select
              value={this.state.thirdSlice}
              name="thirdSlice"
              onChange={this.handleChange}
            >
              <option value="complaintEthnicity">Complainant Ethnicity</option>
              <option value="complaintGender">Complainant Gender</option>
              <option value="fadoType">Complaint Category</option>
              <option value="allegation">Specific Type</option>
              <option value="contactReason">Contact Reason</option>
              <option value="outcome">Outcome</option>
              <option value="boardDisposition">Board Disposition</option>
            </select>

            <button>make graph</button>
          </form>

          <SunburstClassZoom data={this.state.complaintGraphData} />
        </div>
      </div>
    );
    // need to have all options for complaints come in as checkable?
    // 3 dropdowns going from left to right
    // these options will inform the tree making of the data that makes the graph
  }
}
