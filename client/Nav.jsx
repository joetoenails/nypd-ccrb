import React from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';

export const Navigation = (props) => {
  return (
    <Navbar
      collapseOnSelect={true}
      bg="primary"
      variant="dark"
      expand="lg"
      fixed="top"
    >
      <Navbar.Brand href="/">
        <h1 id="nav-title">NYPD-CCRB Visualized</h1>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav activeKey="/home">
          <Nav.Item>
            <LinkContainer to="/squares">
              <Nav.Link>
                <h3>Squares</h3>
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
          <Nav.Item>
            <LinkContainer to="/bars">
              <Nav.Link>
                <h3>Bars</h3>
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
          <Nav.Item>
            <LinkContainer to="/explore">
              <Nav.Link>
                <h3>Explore</h3>
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>

          <Nav.Item>
            <LinkContainer to="/pie">
              <Nav.Link>
                <h3>Pie</h3>
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
          <Nav.Item>
            <LinkContainer to="/piezoom">
              <Nav.Link>
                <h3>PieZoom</h3>
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
          <Nav.Item>
            <LinkContainer to="/graph">
              <Nav.Link>
                <h3>Graph</h3>
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
          <Nav.Item>
            <LinkContainer to="/search">
              <Nav.Link>
                <h3>Search</h3>
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
