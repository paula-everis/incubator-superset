/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/* eslint-disable sort-keys, react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { XYChart, AreaSeries, CrossHair, LinearGradient } from '@data-ui/xy-chart';
import { BRAND_COLOR } from '@superset-ui/color';
import { smartDateVerboseFormatter } from '@superset-ui/time-format';
import { computeMaxFontSize } from '@superset-ui/dimension';

import './BigNumber.css';

const CHART_MARGIN = {
  top: 4,
  right: 4,
  bottom: 4,
  left: 4,
};

const PROPORTION = {
  HEADER: 0.3,
  SUBHEADER: 0.125,
  TRENDLINE: 0.3,
};

export function renderTooltipFactory(formatValue) {
  function renderTooltip({ datum }) {
    // eslint-disable-line
    const { x: rawDate, y: rawValue } = datum;
    const formattedDate = smartDateVerboseFormatter(rawDate);
    const value = formatValue(rawValue);

    return (
      <div style={{ padding: '4px 8px' }}>
        {formattedDate}
        <br />
        <strong>{value}</strong>
      </div>
    );
  }

  renderTooltip.propTypes = {
    datum: PropTypes.shape({
      x: PropTypes.instanceOf(Date),
      y: PropTypes.number,
    }).isRequired,
  };

  return renderTooltip;
}

function identity(x) {
  return x;
}

const propTypes = {
  className: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  bigNumber: PropTypes.number.isRequired,
  formatBigNumber: PropTypes.func,
  headerFontSize: PropTypes.number,
  subheader: PropTypes.string,
  subheaderFontSize: PropTypes.number,
  showTrendLine: PropTypes.bool,
  startYAxisAtZero: PropTypes.bool,
  trendLineData: PropTypes.array,
  mainColor: PropTypes.string,
  renderTooltip: PropTypes.func,
};
const defaultProps = {
  className: '',
  formatBigNumber: identity,
  headerFontSize: PROPORTION.HEADER,
  subheader: '',
  subheaderFontSize: PROPORTION.SUBHEADER,
  showTrendLine: false,
  startYAxisAtZero: true,
  trendLineData: null,
  mainColor: BRAND_COLOR,
  renderTooltip: renderTooltipFactory(identity),
};

class BigNumberVis extends React.PureComponent {
  constructor(props) {
    super(props);
    this.gradientId = shortid.generate();
  }

  getClassName() {
    const { className, showTrendLine } = this.props;
    const names = `superset-legacy-chart-big-number ${className}`;
    if (showTrendLine) {
      return names;
    }

    return `${names} no-trendline`;
  }

  createTemporaryContainer() {
    const container = document.createElement('div');
    container.className = this.getClassName();
    container.style.position = 'absolute'; // so it won't disrupt page layout
    container.style.opacity = 0; // and not visible

    return container;
  }

  renderHeader(maxHeight) {
    const { bigNumber, formatBigNumber, width } = this.props;
    const text = bigNumber;

    var gauge_opts = {
      angle: 30, // The span of the gauge arc
      radiusScale: 1, // Relative radius
      pointer: {
        length: 0.5, // // Relative to gauge radius
        strokeWidth: 0.024, // The thickness
        color: '#000000' // Fill color
      },
      renderTicks: {
        divisions: 5,
        divWidth: 0.8,
        divLength: 0.7,
        divColor: '#333333',
        subDivisions: 3,
        subLength: 0.5,
        subWidth: 0.6,
        subColor: '#666666'
      },
      lineWidth: 0.15,
      limitMax: true,     // If false, max value increases automatically if value > maxValue
      limitMin: false,     // If true, the min value of the gauge will be fixed
      colorStart: '#6FADCF',   // Colors
      colorStop: '#8FC0DA',    // just experiment with them
      strokeColor: [[0.0, "#a9d70b" ], [0.50, "#f9c802"], [1.0, "#ff0000"]],  // to see which ones work best for you
      generateGradient: true,
      highDpiSupport: true,     // High resolution support
      staticZones: [
        {strokeStyle: "#F03E3E", min: 0, max: 20}, // Red from 100 to 130
        {strokeStyle: "#30B32D", min: 20, max: 90}, // Green
        {strokeStyle: "#FFDD00", min: 90, max: 100}, // Yellow
      ]
  };

    const container = this.createTemporaryContainer();
    document.body.appendChild(container);
    const fontSize = computeMaxFontSize({
      text,
      maxWidth: Math.floor(width),
      maxHeight,
      className: 'header-line',
      container,
    });
    document.body.removeChild(container);

    return (
      <div
        className="header-line"
        style={{
          height: maxHeight,
        }}
      >
      <ReactCoffeeGauge
              min="0"
              max="100"
              value={text}
              opts={gauge_opts}
          />
      </div>
    );
  }

  renderSubheader(maxHeight) {
    const { subheader, width } = this.props;
    let fontSize = 0;
    if (subheader) {
      const container = this.createTemporaryContainer();
      document.body.appendChild(container);
      fontSize = computeMaxFontSize({
        text: subheader,
        maxWidth: Math.floor(width),
        maxHeight,
        className: 'subheader-line',
        container,
      });
      document.body.removeChild(container);
    }

    return (
      <div
        className="subheader-line"
        style={{
          fontSize,
          height: maxHeight,
        }}
      >
        {subheader}
      </div>
    );
  }

  renderTrendline(maxHeight) {
    const {
      width,
      trendLineData,
      mainColor,
      subheader,
      renderTooltip,
      startYAxisAtZero,
    } = this.props;

    return (
      <XYChart
        ariaLabel={`Big number visualization ${subheader}`}
        xScale={{ type: 'timeUtc' }}
        yScale={{
          type: 'linear',
          includeZero: startYAxisAtZero,
        }}
        width={Math.floor(width)}
        height={maxHeight}
        margin={CHART_MARGIN}
        renderTooltip={renderTooltip}
        snapTooltipToDataX
      >
        <LinearGradient id={this.gradientId} from={mainColor} to="#fff" />
        <AreaSeries data={trendLineData} fill={`url(#${this.gradientId})`} stroke={mainColor} />
        <CrossHair
          stroke={mainColor}
          circleFill={mainColor}
          circleStroke="#fff"
          showHorizontalLine={false}
          fullHeight
          strokeDasharray="5,2"
        />
      </XYChart>
    );
  }

  render() {
    const { showTrendLine, height, headerFontSize, subheaderFontSize } = this.props;
    const className = this.getClassName();

    if (showTrendLine) {
      const chartHeight = Math.floor(PROPORTION.TRENDLINE * height);
      const allTextHeight = height - chartHeight;

      return (
        <div className={className}>
          <div className="text-container" style={{ height: allTextHeight }}>
            {this.renderHeader(Math.ceil(headerFontSize * (1 - PROPORTION.TRENDLINE) * height))}
            {this.renderSubheader(
              Math.ceil(subheaderFontSize * (1 - PROPORTION.TRENDLINE) * height),
            )}
          </div>
          {this.renderTrendline(chartHeight)}
        </div>
      );
    }

    return (
      <div className={className} style={{ height }}>
        {this.renderHeader(Math.ceil(headerFontSize * height))}
        {this.renderSubheader(Math.ceil(subheaderFontSize * height))}
      </div>
    );
  }
}

BigNumberVis.propTypes = propTypes;
BigNumberVis.defaultProps = defaultProps;

export default BigNumberVis;
