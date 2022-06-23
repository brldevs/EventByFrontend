import dynamic from "next/dynamic";
import React, { Component } from "react";
// https://github.com/apexcharts/react-apexcharts/issues/240
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

class ChartItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          categories: [],
        },
        theme: {
          mode: "light",
          palette: "palette4",
          monochrome: {
            enabled: true,
            color: "#EE4157",
            shadeTo: "light",
            shadeIntensity: 65,
          },
        },
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
      ],
    };
  }

  render() {
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="area"
              width="500"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ChartItem;
