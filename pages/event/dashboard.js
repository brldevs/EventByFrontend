import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAlert } from "react-alert";
import React, { useEffect, useState, useRef } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ChartItem from "../../components/Event/EventDashboard/ChartItem";
import CountByEventType from "../../components/Event/EventDashboard/CountByEventType";
import UpcomingEvent from "../../components/Event/Upcomingevent";
import CustomEventCalender from "../../components/CustomEventCalender";
import { useAuthData } from "../../context/auth";
import Link from "next/link";
import {
  getEventsCounter,
  getEventsFinancialCounter,
  getDefaultCheckoutMethod,
  checkUserSubscription,
} from "../../services/service";
const attendees = [
  {
    id: "1",
    name: "Chin",
  },
  { id: "2", name: "Khanh" },
  { id: "3", name: "Linh" },
  { id: "4", name: "Hai" },
];
//const localizer = momentLocalizer(moment);

function dashboard() {
  const alert = useAlert();
  const [modal, setModal] = useState(false);
  const [event, setEvent] = useState(null);
  const childRef = useRef();

  const toggle = () => {
    setModal(!modal);
    setEvent(null);
  };

  const { data, setAuthValues, removeAuthValues } = useAuthData();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [totalPublishedEvent, setTotalPublishedEvent] = useState(0);
  const [totalDraftedEvent, setTotalDraftedEvent] = useState(0);
  const [totalScheduledEvent, setTotalScheduledEvent] = useState(0);
  const [locationAddress, setLocationAddress] = useState(null);
  const [totalViews, setTotalViews] = useState(0);
  const [totalViewsInLastMonth, setTotalViewsInLastMonth] = useState(12000);
  const [totalRSVP, setTotalRSVP] = useState(0);
  const [totalRSVPInLastMonth, setTotalRSVPInLastMonth] = useState(12000);
  const [totalTicketSale, setTotalTicketSale] = useState(0);
  const [totalTicketSaleInLastMonth, setTotalTicketSaleInLastMonth] = useState(
    12000
  );
  const [checkoutMethodErrorMessage, setCheckoutMethodErrorMessage] = useState(
    null
  );
  const [subscriptionErrorMessage, setSubscriptionErrorMessage] = useState(
    null
  );
  useEffect(async () => {
    setCheckoutMethodErrorMessage(null);
    setSubscriptionErrorMessage(null);
    setIsLoading(true);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(token);

    const res = await getDefaultCheckoutMethod(token);

    if (res.status === 404) {
      alert.show("No Checkout Method Found!", { type: "error" });
      setCheckoutMethodErrorMessage(res.message);
    }

    const resSubscription = await checkUserSubscription(token);
    if (resSubscription.status === 202) {
      alert.show(resSubscription.message, { type: "error" });
      setSubscriptionErrorMessage(
        "You did not subscribe to any plan yet! Please subscribe to a package and enjoy the premium facilities."
      );
    }

    if (token) {
      const response = await getEventsCounter(token);
      if (response.status === 200) {
        setTotalPublishedEvent(response.data.total_events);
        setTotalDraftedEvent(response.data.drafted_events);
        setTotalScheduledEvent(response.data.scheduled_events);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
      const response2 = await getEventsFinancialCounter(token);
      if (response2.status === 200) {
        setTotalViews(response2.data.total_views);
        setTotalRSVP(response2.data.total_RSVP);
        setTotalTicketSale(response2.data.total_ticket_sold);
      }
    }

    const location_address = localStorage.getItem("location_address");

    if (!token) {
      router.replace("/");
      setIsLoading(false);
    } else {
      setToken(token);
      setLocationAddress(location_address);
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Event Dashboard</title>
        <meta property="og:title" content="" key="title" />
      </Head>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <section
          id="content"
          className="p-2 py-4 py-sm-5 pt-sm-0 p-sm-5 m-md-5"
        >
          <div className="mw-1370">
            <div className="dashboard-overview">
              {checkoutMethodErrorMessage && (
                <div
                  style={{
                    backgroundColor: "#f8d7da",
                    marginTop: "16px",
                    marginBottom: "16px",
                    padding: "20px",
                  }}
                >
                  {checkoutMethodErrorMessage && (
                    <span
                      style={{
                        color: "red",
                        fontSize: "16px",
                      }}
                    >
                      <b>Ticket Payment Option</b> not found! Please add a{" "}
                      <b>Ticket Payment Option</b> so that your event attendees
                      can pay for tickets!
                    </span>
                  )}
                  <Link href={`/organizer/accountsetting/paymentsetting`}>
                    <a
                      target="_blank"
                      className="btn btn-primary"
                      style={{ marginLeft: "40px" }}
                    >
                      Add Checkout Method
                    </a>
                  </Link>
                </div>
              )}

              {subscriptionErrorMessage && (
                <div
                  style={{
                    backgroundColor: "#f8d7da",
                    marginTop: "16px",
                    marginBottom: "16px",
                    padding: "20px",
                  }}
                >
                  {subscriptionErrorMessage && (
                    <span
                      style={{
                        color: "red",
                        fontSize: "16px",
                      }}
                    >
                      {subscriptionErrorMessage}
                    </span>
                  )}
                  <Link href={`/organizer/accountsetting/subscription`}>
                    <a
                      target="_blank"
                      className="btn btn-primary"
                      style={{ marginLeft: "40px" }}
                    >
                      Add Package Subscription
                    </a>
                  </Link>
                </div>
              )}

              <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                <CountByEventType
                  published={totalPublishedEvent}
                  drafted={totalDraftedEvent}
                  scheduled={totalScheduledEvent}
                />
              </div>
            </div>
            <div className="calender_and_event mt-4">
              <div className="row">
                <div className="col-lg-7 col-xl-8">
                  <CustomEventCalender />
                </div>
                <div className="col-lg-5 col-xl-4">
                  {token && (
                    <UpcomingEvent
                      organizerId={data.token && data.result.id}
                      organizerName={
                        data.token &&
                        data.result.firstName + " " + data.result.lastName
                      }
                    />
                  )}
                </div>
              </div>
            </div>
            <ChartItem
              totalViews={totalViews}
              totalViewsInLastMonth={totalViewsInLastMonth}
              totalRSVP={totalRSVP}
              totalRSVPInLastMonth={totalRSVPInLastMonth}
              totalTicketSale={totalTicketSale}
              totalTicketSaleInLastMonth={totalTicketSaleInLastMonth}
            />
          </div>
        </section>
      )}
    </>
  );
}
dashboard.layout = "Event";
export default dashboard;
