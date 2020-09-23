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
      expand="lg"
      fixed="top"
    >
      <Navbar.Brand href="/">NYPD-CCRB Visualized</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav activeKey="/home">
          <Nav.Item>
            <Nav.Link href="/squares">Squares</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/graphs">Graphs</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/pie">Pie</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/piezoom">piezoom</Nav.Link>
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
