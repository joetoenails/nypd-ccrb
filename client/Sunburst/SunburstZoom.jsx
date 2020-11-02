import React from 'react';
import _ from 'lodash';
import { SunburstHOC } from './SunburstHOC';
import data from '../../ethincity.json';
import * as d3 from 'd3';
import { SubmitButton } from './SubmitButton';
import Button from 'react-bootstrap/Button';
import { LoadingButton } from './LoadingButton';

export class SunburstZoom extends React.Component {
  constructor() {
    super();

    this.createChart = this.createChart.bind(this);
    this.getUrl = this.getUrl.bind(this);
    this.node = React.createRef();
  }

  componentDidMount() {
    // console.log('component did mount');
    this.createChart(this.props.setCurrentView);
  }

  componentDidUpdate({ data }) {
    if (data !== this.props.data) {
      this.createChart(this.props.setCurrentView);
    }
    // console.log('component did update SunburstZoom');
  }
  trySet = (currentView) => {
    this.setState({ currentView });
  };
  getUrl(obj) {
    const names = [];
    let travel = obj;
    while (travel.parent) {
      names.push(travel.data.name);
      travel = travel.parent;
    }
    //TODO: Need to figure how to get AJAX params from this and other data.
    // probably need to get the 'analyze' function out of the server area and parse it against the csv
    // or against a call to
    console.log(names.join());
  }
  createChart(setState) {
    setState(['All Allegations']);
    const width = 975;
    const radius = width / 6;
    const partition = (data) => {
      const root = d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value);
      return d3.partition().size([2 * Math.PI, root.height + 1])(root);
    };

    const color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, data.children.length + 1)
    );
    const format = d3.format(',d');
    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius((d) => d.y0 * radius)
      .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));
    const root = partition(this.props.data);

    root.each((d) => (d.current = d));

    const svg = d3
      .create('svg')
      .attr('viewBox', [0, 0, width, width])
      .style('font', '10px sans-serif');

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${width / 2})`);

    const path = g
      .append('g')
      .selectAll('path')
      .data(root.descendants().slice(1))
      .join('path')
      .attr('fill', (d) => {
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .attr('fill-opacity', (d) =>
        arcVisible(d.current) ? (d.children ? 0.7 : 0.3) : 0
      )
      .attr('d', (d) => arc(d.current));

    path
      .filter((d) => d.children)
      .style('cursor', 'pointer')
      .on('click', clicked);

    path.append('title').text(
      (d) =>
        `${d
          .ancestors()
          .map((d) => d.data.name)
          .reverse()
          .join('/')}\n${format(d.value)} Allegations`
    );

    const label = g
      .append('g')
      .attr('pointer-events', 'none') // activate pointer events here
      .attr('text-anchor', 'middle')
      .style('user-select', 'none')
      .selectAll('text')
      .data(root.descendants().slice(1))
      .join('text')
      .attr('dy', '0.35em')
      .attr('fill-opacity', (d) => +labelVisible(d.current))
      .attr('transform', (d) => labelTransform(d.current))
      .attr('font-size', '1.5em')
      .text((d) => d.data.name)
      .on('click', () => console.log('clicked23')); // can get the last piece of viewing if user clicks title

    const parent = g
      .append('circle')
      .datum(root)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('click', clicked);

    function clicked(event, p) {
      console.log('clickeddd!');
      setState(
        p
          .ancestors()
          .map((d) => d.data.name)
          .reverse()
      );

      parent.datum(p.parent || root);
      console.log('parent', parent);
      root.each(
        (d) =>
          (d.target = {
            x0:
              Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            x1:
              Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth),
          })
      );

      const t = g.transition().duration(1500);

      // Transition the data on all arcs, even the ones that aren’t visible,
      // so that if this transition is interrupted, entering arcs will start
      // the next transition from the desired position.
      path
        .transition(t)
        .tween('data', (d) => {
          const i = d3.interpolate(d.current, d.target);
          return (t) => (d.current = i(t));
        })
        .filter(function (d) {
          return +this.getAttribute('fill-opacity') || arcVisible(d.target);
        })
        .attr('fill-opacity', (d) =>
          arcVisible(d.target) ? (d.children ? 0.7 : 0.3) : 0
        )
        .attrTween('d', (d) => () => arc(d.current));

      label
        .filter(function (d) {
          return +this.getAttribute('fill-opacity') || labelVisible(d.target);
        })
        .transition(t)
        .attr('fill-opacity', (d) => +labelVisible(d.target))
        .attrTween('transform', (d) => () => labelTransform(d.current));
    }

    function arcVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      const y = ((d.y0 + d.y1) / 2) * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    const graph = svg.node();
    if (this.node.current.children.length) {
      this.node.current.removeChild(this.node.current.children[0]);
    }
    this.node.current.appendChild(graph);
  }

  render() {
    // console.log('props in SunburstClassZoom', this.props);
    // console.log('legend', legend)
    return (
      <>
        <p>
          To get a better feel for the information contained in the CCRB
          database, explore different combinations of criteria to make a
          zoomable pie chart below. Hover on each piece of the pie to get more
          detail on that particular slice or click on a slice to go deeper into
          the statistics of that slice. Click the middle of the circle to go
          back to the previous level.
        </p>
        <div>
          <p>Current view: {this.props.currentView}</p>
          <LoadingButton
            type="click"
            onClick={() => this.props.handleQuery()}
            isLoading={this.props.isQueryLoading}
            buttonText={'Submit Query For Current View'}
          />
          {/* <SubmitButton
            currentView={this.props.currentView}
            slice1={this.props.slice1}
            slice2={this.props.slice2}
            slice3={this.props.slice3}
          ></SubmitButton> */}
        </div>
        <div className="graph-container">
          <div ref={this.node}></div>
        </div>
      </>
    );
  }
}

export const SunburstZoomWrapper = SunburstHOC(SunburstZoom, { type: 'zoom' });
