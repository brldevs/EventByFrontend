import Head from "next/head";
import dynamic from "next/dynamic";
import CountByEvent from "../../../components/Event/EventDashboard/SingalEventadmin/countByEvent";
import Image from "next/image";
import EventDashboard from "../../../components/layout/EventDashboard";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import EventCard from "../../../components/Event/EventCard";
import { getEventSummary } from "../../../services/service";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
function singleevent() {
  const [option, setoption] = useState({
    options: {
      theme: {
        mode: "light",
        palette: "palette4",
        monochrome: {
          enabled: true,
          color: "#EE4157",
          shadeTo: "light",
          shadeIntensity: 0.65,
        },
      },
      chart: {
        height: 280,
        type: "area",
        toolbar: false,
      },
      dataLabels: {
        enabled: true,
      },
      series: [
        {
          name: "Series 1",
          data: [10, 52, 38, 45, 19, 23, 50, 45, 19, 23, 50],
        },
      ],
      grid: {
        show: true,
        borderColor: "#D2D2D2",
        strokeDashArray: 4,
        position: "back",
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        position: "top",
        categories: [
          "MON",
          "TUE",
          "WED",
          "THU",
          "FRI",
          "SAT",
          "SUN",
          "THU",
          "FRI",
          "SAT",
          "SUN",
        ],
      },
    },
  });

  const [eventId, setEventId] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  console.log("EventID : " + id);

  const [totalAttendees, setTotalAttendees] = useState(0);
  const [totalEventViews, setTotalEventViews] = useState(0);
  const [totalRSVP, setTotalRSVP] = useState(0);
  const [totalTicketSold, setTotalTicketSold] = useState(0);
  useEffect(async () => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap.bundle.js")
      : null;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      router.replace("/");
    }

    if (id) {
      setEventId(id);
      if (token) {
        const data = { event_id: id };
        const response = await getEventSummary(data, token);
        if (response.status === 200) {
          setTotalAttendees(response.total_attendess);
          setTotalEventViews(response.total_event_views);
          setTotalRSVP(response.total_RSVP);
          setTotalTicketSold(response.total_ticket_sold);
        }
      }
    }
  }, [id]);

  return (
    <EventDashboard eventId={eventId}>
      <>
        <Head>
          <title>Organizer Dashboard</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>

        <EventCard eventId={eventId} />

        <CountByEvent
          totalAttendees={totalAttendees}
          totalEventViews={totalEventViews}
          totalRSVP={totalRSVP}
          totalTicketSold={totalTicketSold}
        />
        {/* <div className="bg-white py-5 p-30 mt-4 border-radius-10">
          <Chart
            options={option.options}
            series={option.options.series}
            type="area"
            height="500"
            width="100%"
          />
        </div> */}
      </>
    </EventDashboard>
  );
}
// singleevent.layout = "Empty";
singleevent.layout = "Event";
export default singleevent;
