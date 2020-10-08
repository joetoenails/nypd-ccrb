import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Navigation } from './Nav';
import { Cops } from './Cops';
import { Cop } from './Cop';
import { Home } from './Home';
import { Bars } from './Bars';
import { Explore } from './Explore';
import { ScrollToTop } from './ScrollToTop';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import { SunburstZoomWrapper } from './Sunburst/SunburstZoom';
import { SunburstWrapper } from './Sunburst/Sunburst';
import Container from 'react-bootstrap/Container';
import { SearchPage } from './SearchPage';

const App = (props) => {
  const [officers, setOfficers] = useState([]);
  useEffect(() => {
    axios.get('/api/allegations').then(({ data }) => {
      setOfficers(data);
    });
  }, []);

  const [ethnicities, setEthnicities] = useState({});

  useEffect(() => {
    axios.get('/api/cops/ethnicity').then(({ data }) => {
      setEthnicities(data);
    });
  }, []);

  const [filter, setFilter] = useState({
    mos_ethnicity: 'all',
  });

  const [sortType, setSortType] = useState('');
  useEffect(() => {
    const sortOfficers = (type) => {
      if (type === 'complaints') {
        return officers.slice().sort((a, b) => {
          return b.count - a.count;
        });
      } else {
        return officers.slice().sort((a, b) => {
          if (a[type] < b[type]) {
            return -1;
          }
          if (a[type] > b[type]) {
            return 1;
          }
          return 0;
        });
      }
    };
    setOfficers(sortOfficers(sortType));
  }, [sortType]);

  return (
    <Router>
      <ScrollToTop />
      <Navigation />
      <Container fluid="sm" className="app-body">
        <Switch>
          <Route path="/cops/:id">
            <Cop officers={officers} />
          </Route>

          <Route path="/piezoom">
            <SunburstZoomWrapper
              officers={officers}
              setFilter={setFilter}
              filter={filter}
              ethnicities={ethnicities}
              setOfficers={setOfficers}
              setSortType={setSortType}
            />
          </Route>
          <Route path="/pie">
            <SunburstWrapper
              officers={officers}
              setFilter={setFilter}
              filter={filter}
              ethnicities={ethnicities}
              setOfficers={setOfficers}
              setSortType={setSortType}
            />
          </Route>
          <Route path="/bars">
            <Bars
              officers={officers}
              setFilter={setFilter}
              filter={filter}
              ethnicities={ethnicities}
              setOfficers={setOfficers}
              setSortType={setSortType}
            />
          </Route>
          <Route path="/squares">
            <Cops
              officers={officers}
              setFilter={setFilter}
              filter={filter}
              ethnicities={ethnicities}
              setOfficers={setOfficers}
              setSortType={setSortType}
            />
          </Route>
          <Route path="/explore">
            <Explore />
          </Route>
          <Route path="/search">
            <SearchPage />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
};

const div = document.getElementById('app');

ReactDOM.render(<App />, div);
