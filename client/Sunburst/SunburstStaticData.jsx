import React from 'react';
import * as d3 from 'd3';
/**
 * Needs a prop called data that looks like [{name: String, children:[]}]
 *
 *
 */
export class SunburstStaticData extends React.Component {
  constructor() {
    super();
    this.createChart = this.createChart.bind(this);
    this.node = React.createRef();
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.data.name) {
      this.createChart();
    }
  }

  createChart() {
    if (!this.props.data.name) return;

    const width = 975;
    const radius = width / 2;
    const format = d3.format(',d');
    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius / 2)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1 - 1);

    const color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, this.props.data.children.length + 1)
    );
    const partition = (data) =>
      d3.partition().size([2 * Math.PI, radius])(
        d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value)
      );

    function autoBox() {
      document.body.appendChild(this);
      const { x, y, width, height } = this.getBBox();
      document.body.removeChild(this);
      return [x, y, width, height];
    }

    const root = partition(this.props.data);

    const svg = d3.create('svg');

    const arcContent = svg
      .append('g')
      .attr('fill-opacity', 0.6)
      .selectAll('path')
      .data(root.descendants().filter((d) => d.depth))
      .join('path')
      .attr('fill', (d) => {
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .attr('d', arc);

    arcContent.append('title').text(
      (d) =>
        `${d
          .ancestors()
          .map((d) => d.data.name)
          .reverse()
          .join('/')}\n${format(d.value)} Allegations`
    );

    svg
      .append('g')
      .attr('pointer-events', 'auto')
      .attr('text-anchor', 'middle')

      .attr('font-family', 'sans-serif')
      .selectAll('text')
      .data(
        root
          .descendants()
          .filter((d) => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
      )

      .join('text')
      .attr('transform', function (d) {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${
          x - 90
        }) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr('dy', '0.35em')
      .attr('font-size', '1.20rem')
      .text((d) => d.data.name);

    const graph = svg.attr('viewBox', autoBox).node();
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
