import React from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export const Navigation = (props) => {
  return (
    <Navbar
      collapseOnSelect
      bg="primary"
      variant="dark"
      expand="sm"
      fixed="top"
    >
      <Navbar.Brand href="/">
        <h1>NYPD-CCRB Visualized</h1>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav activeKey="/home">
          <Nav.Item>
            <Nav.Link href="/squares">
              <h3>Squares</h3>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/graphs">
              <h3>Graphs</h3>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/pie">
              <h3>Pie</h3>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/piezoom">
              <h3>Piezoom</h3>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    // <div className="nav">

    //   <ul>
    //     <li>
    //       <Link to={'/'}>HOME</Link>
    //     </li>
    //     <li>
    //       <Link to={'/squares'}>SQUARES</Link>
    //     </li>
    //     <li>
    //       <Link to={'/graphs'}>GRAPHS</Link>
    //     </li>
    //     <li>
    //       <Link to={'/pie'}>PIE</Link>
    //     </li>
    //     <li>
    //       <Link to={'/piezoom'}>PIEZOOM</Link>
    //     </li>
    //   </ul>
    // </div>
  );
};
