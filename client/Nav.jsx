import React from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

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
            <Nav.Link as={Link} to="/squares">
              <h3>Squares</h3>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/graphs">
              <h3>Graphs</h3>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/pie">
              <h3>Pie</h3>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/piezoom">
              <h3>Piezoom</h3>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
