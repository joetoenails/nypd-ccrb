import React from 'react';
import _ from 'lodash';
import * as d3 from 'd3';
import axios from 'axios';

export class GraphDynamic extends React.Component {
  constructor(props) {
    super();
    this.createChart = this.createChart.bind(this);

    this.node = React.createRef();
  }

  componentDidUpdate(prevProps) {
    console.log('prev props', prevProps);
    console.log('now props', this.props);
    if (prevProps.data.links !== this.props.data.linksw) {
      this.createChart();
    }
  }

  createChart() {
    const height = 800;
    const width = height;

    const drag = (simulation) => {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    };

    const links = this.props.data.links.map((d) => Object.create(d));
    const nodes = this.props.data.nodes.map((d) => Object.create(d));
    // // console.log(data.nodes)
    // console.log(links);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink(links).id((d) => d.unique_mos_id)
      )
      .force('charge', d3.forceManyBody())
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    function autoBox() {
      document.body.appendChild(this);
      const { x, y, width, height } = this.getBBox();
      document.body.removeChild(this);
      return [x, y, width, height];
    }

    const svg = d3
      .create('svg')
      .attr('viewBox', [-width / 2, -height / 2, width, height]);

    const link = svg
      .append('g')
      .attr('stroke', '#ffa500')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d) => d.qty * 2);

    link.append('title').text((d) => `${d.qty} Complaints shared`);

    const node = svg
      .append('g')
      .attr('stroke', 'blue')
      .attr('stroke-width', 1)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => d.count * 0.25)
      .attr('fill', 'dodgerblue')
      .call(drag(simulation));

    node
      .append('title')
      .text(
        (d) =>
          `${d.first_name} ${d.last_name} \nTotal Allegations: ${d.count}\n${
            d.mos_ethnicity
          } ${d.mos_gender === 'M' ? 'Male' : 'Female'}, ${d.rank_now}`
      );

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });

    // invalidation.then(() => simulation.stop());

    const graph = svg.node();
    if (this.node.current.children.length) {
      this.node.current.removeChild(this.node.current.children[0]);
    }
    this.node.current.appendChild(graph);
  }

  render() {
    return (
      <div>
        <div ref={this.node}></div>
      </div>
    );
  }
}
