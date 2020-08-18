import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Nav } from './Nav';
import { Cops } from './Cops';
import { Cop } from './Cop';
import { Home } from './Home';
import { Graphs } from './Graphs';
import { GraphEthnicity } from './GraphEthnicity';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { compileComplaints } from './utils';

const App = (props) => {
  const [officers, setOfficers] = useState([]);
  const [ethnicities, setEthnicities] = useState({});
  useEffect(() => {
    axios.get('/api/cops').then(({ data }) => {
      data.forEach((d) => {
        d.uniqueComplaints = compileComplaints(d);
      });
      setOfficers(data);
      const allEthnicities = data.reduce((ethnicities, cop) => {
        if (!(cop.ethnicity in ethnicities)) {
          ethnicities[cop.ethnicity] = 1;
        } else {
          ethnicities[cop.ethnicity]++;
        }
        return ethnicities;
      }, {});
      setEthnicities(allEthnicities);
    });
  }, []);

  const [filter, setFilter] = useState({
    ethnicity: 'all',
  });

  const [sortType, setSortType] = useState('');
  useEffect(() => {
    const sortOfficers = (type) => {
      if (type === 'complaints') {
        return officers.slice().sort((a, b) => {
          return b[type].length - a[type].length;
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
  console.log(officers, ethnicities);
  return (
    <>
      <Router>
        <Nav />
        <div>
          These are all of the officers in the CCRB database that have
          complaints against them. The data is from 1985 to 2019.
        </div>
        <Switch>
          <Route path="/cops/:id">
            <Cop officers={officers} />
          </Route>
          <Route path="/graphsethnicity">
            <GraphEthnicity
              officers={officers}
              setFilter={setFilter}
              filter={filter}
              ethnicities={ethnicities}
              setOfficers={setOfficers}
              setSortType={setSortType}
            />
          </Route>

          <Route path="/graphs">
            <Graphs
              officers={officers}
              setFilter={setFilter}
              filter={filter}
              ethnicities={ethnicities}
              setOfficers={setOfficers}
              setSortType={setSortType}
            />
          </Route>

          <Route path="/cops">
            <Cops
              officers={officers}
              setFilter={setFilter}
              filter={filter}
              ethnicities={ethnicities}
              setOfficers={setOfficers}
              setSortType={setSortType}
            />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

const div = document.getElementById('app');

ReactDOM.render(<App />, div);
