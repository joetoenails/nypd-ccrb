import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import InputGroup from 'react-bootstrap/InputGroup';

import axios from 'axios';

class SearchPage extends React.Component {
  constructor() {
    super();
    this.state = {
      badgeOrName: '',
      results: [],
      noResults: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // get search results
    this.setState({ noResults: false, results: [] });
    axios
      .post('/api/search', { searchTerm: this.state.badgeOrName })
      .then(({ data }) => {
        // if array is empty set no results
        console.log('DATA', data);
        if (data.length === 0) {
          this.setState({ noResults: true });
        } else {
          this.setState({ results: data });
        }
        // if arr has thing, set results
      });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  render() {
    console.log(this.state);
    return (
      <>
        <h1>Search</h1>
        <p>
          Enter exact badge number or part of a name to get a list of officers
        </p>
        <Form onSubmit={this.handleSubmit}>
          <Form.Row className="align-items-center">
            <Col>
              <Form.Label htmlFor="badgeOrName" srOnly>
                Badge # or Name
              </Form.Label>
              <Form.Control
                onChange={this.handleChange}
                type="text"
                name="badgeOrName"
                value={this.state.badgeOrName}
                placeholder="Badge # or Name"
              />
            </Col>
            <Col>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Col>
          </Form.Row>
        </Form>
        <div id="search-results">
          {this.state.noResults ? (
            <p>No results, please search again</p>
          ) : (
            <ul>
              {this.state.results.map((result) => {
                return (
                  <li key={result.unique_mos_id}>
                    <Link to={`cop/${result.unique_mos_id}`}>
                      {result.last_name}, {result.first_name} | Badge #:{' '}
                      {result.shield_no == '0' ? 'Unknown' : result.shield_no}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </>
    );
  }
}

export { SearchPage };
