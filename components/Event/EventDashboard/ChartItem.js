import React, { useState } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function ChartItem({
  totalViews,
  totalViewsInLastMonth,
  totalRSVP,
  totalRSVPInLastMonth,
  totalTicketSale,
  totalTicketSaleInLastMonth,
}) {
  const [option, setoption] = useState({
    series: [
      {
        name: "series1",
        data: [31, 40, 28, 51, 42, 40, 51],
      },
    ],
    options: {
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
      chart: {
        height: 350,
        type: "area",
        toolbar: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
          labels: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
    },
  });

  const [optionone, setoptionone] = useState({
    series: [
      {
        name: "series1",
        data: [31, 40, 28, 51, 42, 40, 51],
      },
    ],
    options: {
      theme: {
        mode: "light",
        palette: "palette4",
        monochrome: {
          enabled: true,
          color: "#25C8FF",
          shadeTo: "light",
          shadeIntensity: 0.65,
        },
      },
      chart: {
        height: 350,
        type: "area",
        toolbar: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
          labels: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
    },
  });

  const [optiontwo, setoptiontwo] = useState({
    series: [
      {
        name: "series1",
        data: [31, 40, 28, 51, 42, 40, 51],
      },
    ],
    options: {
      theme: {
        mode: "light",
        palette: "palette4",
        monochrome: {
          enabled: true,
          color: "#2AE4C7",
          shadeTo: "light",
          shadeIntensity: 0.65,
        },
      },
      chart: {
        height: 350,
        type: "area",
        toolbar: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
          labels: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
    },
  });

  return (
    <>
      <div className="chart-section mt-4">
        <div className="row row-cols-3">
          <div className="">
            <span className="font-weight-500 mb-2 d-block text-dark fontSize-18">
              Total Views
            </span>
            <div className="bg-white rounded position-relative">
              <div class="chart-at-dashbord">
                <div className="p-3 pb-0 ">
                  {totalViews && totalViews > 0 ? (
                    <div className=" font-weight-500 text-dark fontSize-22">
                      {totalViews}+
                    </div>
                  ) : (
                    <div className=" font-weight-500 text-dark fontSize-22">
                      0
                    </div>
                  )}

                  <div className="text-gray-2  fontSize-16">
                    {/* <i class="ri-arrow-up-circle-line text-secondary"></i>{" "} */}
                    {/* {totalViewsInLastMonth}+ In last month */}
                  </div>
                </div>
                <Chart
                  options={option.options}
                  series={option.series}
                  type="area"
                  height="140"
                  width="100%"
                />
                <div className="bottom-chart-overlap position-absolute"></div>
              </div>
            </div>
          </div>
          <div className="col">
            <span className="font-weight-500 mb-2 d-block text-dark h5 fontSize-18">
              Total RSVP
            </span>
            <div className="bg-white rounded position-relative ">
              <div class="chart-at-dashbord">
                <div className="p-3 pb-0 ">
                  {totalRSVP && totalRSVP > 0 ? (
                    <div className="font-weight-500 text-dark fontSize-22">
                      {totalRSVP}+
                    </div>
                  ) : (
                    <div className="font-weight-500 text-dark fontSize-22">
                      0
                    </div>
                  )}

                  <div className="text-gray-2 fontSize-16">
                    {/* <i class="ri-arrow-up-circle-line text-secondary"></i>{" "} */}
                    {/* {totalRSVPInLastMonth}+ In last month */}
                  </div>
                </div>
                <Chart
                  options={optionone.options}
                  series={optionone.series}
                  type="area"
                  height="140"
                  width="100%"
                />
                <div className="bottom-chart-overlap position-absolute"></div>
              </div>
            </div>
          </div>
          <div className="col">
            <span className="font-weight-500 mb-2 d-block text-dark h5 fontSize-18">
              Total Tickets Sale
            </span>
            <div className="bg-white rounded position-relative">
              <div class="chart-at-dashbord">
                <div className="p-3 pb-0 ">
                  {totalTicketSale && totalTicketSale > 0 ? (
                    <div className=" font-weight-500 text-dark fontSize-22">
                      {totalTicketSale}+
                    </div>
                  ) : (
                    <div className=" font-weight-500 text-dark fontSize-22">
                      0
                    </div>
                  )}

                  <div className="text-gray-2 fontSize-16">
                    {/* <i class="ri-arrow-up-circle-line text-secondary"></i>{" "} */}
                    {/* {totalTicketSaleInLastMonth}+ In last month */}
                  </div>
                </div>
                <Chart
                  options={optiontwo.options}
                  series={optiontwo.series}
                  type="area"
                  height="140"
                  width="100%"
                />
                <div className="bottom-chart-overlap position-absolute p-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChartItem;
