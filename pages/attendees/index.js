import moment from "moment";
import $ from "jquery";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, compareAsc } from "date-fns";
import { useAlert } from "react-alert";
import TimeCounter from "../../components/Event/TimeCounter";
import Link from "next/link";
import Carousel from "../../components/Carousel/Carousel";
import {
  getAttendeeEvents,
  getEventPreviewDataOPVById,
  getEventBannerByEventId,
  getEventCoOrgSponsorSpeakerById,
  addEventParticipant,
} from "../../services/service";

import Upcommingeventfullwidth from "../../components/Event/Upcommingeventfullwidth";

import Image from "next/image";
import CustomEventCalender from "../../components/CustomEventCalender";
const eventlist = [
  {
    id: 0,
    title: "All Day Event very long title",
    allDay: true,
    start: new Date(2022, 3, 0),
    end: new Date(2022, 3, 1),
  },
  {
    id: 1,
    title: "Long Event",
    start: new Date(2022, 3, 7),
    end: new Date(2022, 3, 10),
  },

  {
    id: 2,
    title: "DTS STARTS",
    start: new Date(2016, 2, 13, 0, 0, 0),
    end: new Date(2016, 2, 20, 0, 0, 0),
  },

  {
    id: 3,
    title: "DTS ENDS",
    start: new Date(2016, 10, 6, 0, 0, 0),
    end: new Date(2016, 10, 13, 0, 0, 0),
  },

  {
    id: 4,
    title: "Some Event",
    start: new Date(2022, 3, 9, 0, 0, 0),
    end: new Date(2022, 3, 10, 0, 0, 0),
  },
  {
    id: 5,
    title: "Conference",
    start: new Date(2022, 3, 11),
    end: new Date(2022, 3, 13),
    desc: "Big conference for important people",
  },
  {
    id: 6,
    title: "Meeting",
    start: new Date(2022, 3, 12, 10, 30, 0, 0),
    end: new Date(2022, 3, 12, 12, 30, 0, 0),
    desc: "Pre-meeting meeting, to prepare for the meeting",
  },
  {
    id: 7,
    title: "Lunch",
    start: new Date(2022, 3, 12, 12, 0, 0, 0),
    end: new Date(2022, 3, 12, 13, 0, 0, 0),
    desc: "Power lunch",
  },
  {
    id: 8,
    title: "Meeting",
    start: new Date(2022, 3, 12, 14, 0, 0, 0),
    end: new Date(2022, 3, 12, 15, 0, 0, 0),
  },
  {
    id: 9,
    title: "Happy Hour",
    start: new Date(2022, 3, 12, 17, 0, 0, 0),
    end: new Date(2022, 3, 12, 17, 30, 0, 0),
    desc: "Most important meal of the day",
  },
  {
    id: 10,
    title: "Dinner",
    start: new Date(2022, 3, 12, 20, 0, 0, 0),
    end: new Date(2022, 3, 12, 21, 0, 0, 0),
  },
  {
    id: 11,
    title: "Planning Meeting with Paige",
    start: new Date(2022, 3, 13, 8, 0, 0),
    end: new Date(2022, 3, 13, 10, 30, 0),
  },
  {
    id: 11.1,
    title: "Inconvenient Conference Call",
    start: new Date(2022, 3, 13, 9, 30, 0),
    end: new Date(2022, 3, 13, 12, 0, 0),
  },
  {
    id: 11.2,
    title: "Project Kickoff - Lou's Shoes",
    start: new Date(2022, 3, 13, 11, 30, 0),
    end: new Date(2022, 3, 13, 14, 0, 0),
  },
  {
    id: 11.3,
    title: "Quote Follow-up - Tea by Tina",
    start: new Date(2022, 3, 13, 15, 30, 0),
    end: new Date(2022, 3, 13, 16, 0, 0),
  },
  {
    id: 12,
    title: "Late Night Event",
    start: new Date(2022, 3, 17, 19, 30, 0),
    end: new Date(2022, 3, 18, 2, 0, 0),
  },
  {
    id: 12.5,
    title: "Late Same Night Event",
    start: new Date(2022, 3, 17, 19, 30, 0),
    end: new Date(2022, 3, 17, 23, 30, 0),
  },
  {
    id: 13,
    title: "Multi-day Event",
    start: new Date(2022, 3, 20, 19, 30, 0),
    end: new Date(2022, 3, 22, 2, 0, 0),
  },
  {
    id: 14,
    title: "Today",
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },
  {
    id: 16,
    title: "Video Record",
    start: new Date(2022, 3, 14, 15, 30, 0),
    end: new Date(2022, 3, 14, 19, 0, 0),
  },
  {
    id: 17,
    title: "Dutch Song Producing",
    start: new Date(2022, 3, 14, 16, 30, 0),
    end: new Date(2022, 3, 14, 20, 0, 0),
  },
  {
    id: 18,
    title: "Itaewon Halloween Meeting",
    start: new Date(2022, 3, 14, 16, 30, 0),
    end: new Date(2022, 3, 14, 17, 30, 0),
  },
  {
    id: 19,
    title: "Online Coding Test",
    start: new Date(2022, 3, 14, 17, 30, 0),
    end: new Date(2022, 3, 14, 20, 30, 0),
  },
  {
    id: 20,
    title: "An overlapped Event",
    start: new Date(2022, 3, 14, 17, 0, 0),
    end: new Date(2022, 3, 14, 18, 30, 0),
  },
  {
    id: 21,
    title: "Phone Interview",
    start: new Date(2022, 3, 14, 17, 0, 0),
    end: new Date(2022, 3, 14, 18, 30, 0),
  },
  {
    id: 22,
    title: "Cooking Class",
    start: new Date(2022, 3, 14, 17, 30, 0),
    end: new Date(2022, 3, 14, 19, 0, 0),
  },
  {
    id: 23,
    title: "Go to the gym",
    start: new Date(2022, 3, 14, 18, 30, 0),
    end: new Date(2022, 3, 14, 20, 0, 0),
  },
];
const localizer = momentLocalizer(moment);

function eventCalender() {
  const alert = useAlert();
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [upComingEventData, setUpComingEventData] = useState([]);

  const [eventData, setEventData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [eventBannerImg, setEventBannerImg] = useState(null);

  const [organizer, setOrganizer] = useState({});

  const [lastVisitedEventID, setLastVisitedEventID] = useState(null);

  const router = useRouter();
  const [token, setToken] = useState("");

  const [participantID, setParticipantID] = useState(null);

  const [
    isShowUpcommingeventfullwidthCOMP,
    setIsShowUpcommingeventfullwidthCOMP,
  ] = useState(false);

  useEffect(async () => {
    $(".input-group .form-control").on("focus", function () {
      $(this).parent().css({
        "border-color": "#2DC774",
        color: "#2DC774",
      });
    });
    $(".input-group .form-control").on("focusout", function () {
      $(this).parent().css({
        "border-color": "#E9ECF0",
        color: "#A5ADC1",
      });
    });
    setIsLoading(true);
    const accessToken = localStorage.getItem("token");

    const result =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("result"))
        : null;

    console.log(result);

    if (!accessToken) {
      router.replace("/attendees/login");
      setIsLoading(false);
    } else {
      setToken(accessToken);
      if (result.last_visited_event !== "NA") {
        setLastVisitedEventID(result.last_visited_event);
        setIsShowUpcommingeventfullwidthCOMP(true);
      }

      if (result.last_visited_event !== "NA") {
        console.log("lastVisitedEventID: " + result.last_visited_event);
        const res = await getEventPreviewDataOPVById(result.last_visited_event);

        if (res.status === 200) {
          console.log("Test EVENT DATA: " + JSON.stringify(res.data));
          setEventData(res.data);
        }

        const resBannerImg = await getEventBannerByEventId(
          result.last_visited_event
        );

        if (resBannerImg) {
          setEventBannerImg(resBannerImg);
        }

        const resCoOrgSponsorSpeaker = await getEventCoOrgSponsorSpeakerById(
          result.last_visited_event
        );

        // if (resCoOrgSponsorSpeaker) {
        //   setOrganizer(resCoOrgSponsorSpeaker.data.organizers[0]);
        // }
      }

      // test start
      if (result.last_visited_event !== "NA") {
        const data2 = {
          event_id: result.last_visited_event,
          name: result.firstName + " " + result.lastName,
          email: result.email,
          isRSVP: false,
        };
        const addEventParticipantResponse = await addEventParticipant(data2);
        if (
          addEventParticipantResponse.status === 200 ||
          addEventParticipantResponse.status === 203
        ) {
          if (
            addEventParticipantResponse.data.name &&
            addEventParticipantResponse.data.email &&
            addEventParticipantResponse.data._id
          ) {
            localStorage.setItem(
              "participant_name",
              addEventParticipantResponse.data.name
            );
            localStorage.setItem(
              "participant_email",
              addEventParticipantResponse.data.email
            );
            localStorage.setItem(
              "participant_id",
              addEventParticipantResponse.data._id
            );
            setParticipantID(addEventParticipantResponse.data._id);
          }

          router.push(`/attendees/singleevent/${result.last_visited_event}`);
          // alert.show(res.message);
          setIsLoading(false);
        } else if (addEventParticipantResponse.status === 201) {
          console.log("setUserAlreadyJoinedAndPaymentDoneMsg()");
          // setUserAlreadyJoinedAndPaymentDoneMsg(res.message);
          alert.show(addEventParticipantResponse.message);
          setIsLoading(false);
        } else {
          alert.show(addEventParticipantResponse.message);
          setIsLoading(false);
        }
      }
      // test end

      const res = await getAttendeeEvents(accessToken);

      if (res.status === 200) {
        setUpComingEventData(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [lastVisitedEventID]);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <section
          id="content"
          className="p-2 py-3 py-sm-5 pt-sm-0 p-sm-5 m-md-5"
        >
          {/* <div
            style={{
              maxWidth: 1200,
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 64,
            }}
          >
            <div>
              <div style={{ padding: 8 }}>
                <img
                  src="https://via.placeholder.com/300x300"
                  alt="placeholder"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div>
              <div style={{ padding: 8 }}>
                <img
                  src="https://via.placeholder.com/300x300"
                  alt="placeholder"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div>
              <div style={{ padding: 8 }}>
                <img
                  src="https://via.placeholder.com/300x300"
                  alt="placeholder"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div>
              <div style={{ padding: 8 }}>
                <img
                  src="https://via.placeholder.com/300x300"
                  alt="placeholder"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div>
              <div style={{ padding: 8 }}>
                <img
                  src="https://via.placeholder.com/300x300"
                  alt="placeholder"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div>
              <div style={{ padding: 8 }}>
                <img
                  src="https://via.placeholder.com/300x300"
                  alt="placeholder"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div>
              <div style={{ padding: 8 }}>
                <img
                  src="https://via.placeholder.com/300x300"
                  alt="placeholder"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div>
              <div style={{ padding: 8 }}>
                <img
                  src="https://via.placeholder.com/300x300"
                  alt="placeholder"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div> */}

          <div className="mw-1370">
            <div className="mt-4 mt-md-0">
              <div className="mb-5 me-2">
                {isShowUpcommingeventfullwidthCOMP && (
                  <>
                    <h2>Last Visited Event</h2>
                    <Upcommingeventfullwidth
                      eventData={eventData}
                      eventBannerImg={eventBannerImg}
                      organizer={organizer}
                      eventID={lastVisitedEventID}
                      participantID={participantID}
                    />
                  </>
                )}
              </div>
              <div className="d-flex align-items-start justify-content-between flex-wrap">
                <div className="mb-2 me-2">
                  <h2>Upcoming Events</h2>
                  <span className="text-gray-2">
                    Take a look at all your upcoming events
                  </span>
                </div>
                <button className="btn btn-primary font-weight-500 px-3">
                  <i className="ri-calendar-event-line me-2" /> See All Event
                </button>
              </div>
            </div>

            {/* <span className="left-arrow">
                <i className="ri-arrow-left-s-line" />
              </span>
              <span className="right-arrow">
                <i className="ri-arrow-right-s-line" />
              </span> */}
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <Carousel show={3}>
                {upComingEventData.map((d, index) => {
                  return (
                    <div key={index}>
                      <div style={{ padding: 8 }}>
                        <div className="event">
                          <Link href={`/event/${d._id}`}>
                            <div
                              className="image p-2 cursor-pointer position-relative"
                              style={{ marginBottom: "-60px" }}
                            >
                              <Image
                                src={`${NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${d.event_banner}/image`}
                                className="border-radius-10"
                                height={300}
                                width={450}
                              />
                              {d.event_type !== "physical" && (
                                <div className="time-counter-br-tr">
                                  <TimeCounter
                                    count={new Date(d.start_date) - Date.now()}
                                  />
                                </div>
                              )}
                            </div>
                          </Link>

                          <div className="event-content bg-white border-radius-10 p-30  pt-5">
                            <div className="pt-30 d-flex justify-content-between">
                              <span className>
                                <i className="ri-calendar-check-line text-gray-2" />
                                <span className="font-12 text-gray-1">
                                  {format(
                                    new Date(d.start_date),
                                    "MMMM dd, yyyy"
                                  )}
                                </span>
                              </span>
                              <div className="dropdown custom">
                                <i
                                  className="ri-more-2-fill"
                                  type="button"
                                  id="dropdownMenuButton1"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                />
                                <ul
                                  className="dropdown-menu"
                                  aria-labelledby="dropdownMenuButton1"
                                >
                                  <li>
                                    <Link href={`/event/${d._id}`}>
                                      <a className="dropdown-item">
                                        <span>View Registration</span>
                                        <span className="icon">
                                          <i className="ri-check-line" />
                                        </span>
                                      </a>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href={`/event/${d._id}`}>
                                      <a className="dropdown-item">
                                        <span>Join Discussion</span>
                                        <span className="icon">
                                          <i className="ri-check-line" />
                                        </span>
                                      </a>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <h6 className="font-18 font-weight-700">
                              {d.name}
                            </h6>
                            <span className="text-gray-2 font-14">
                              By:{" "}
                              <span className="text-dark font-weight-700">
                                Quinton,
                              </span>{" "}
                              <i className="ri-map-pin-line ms-2 " /> San
                              Francisco Area
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Carousel>
            </div>
            {/*
            <div className="row mt-4 upcoming-events row-cols-1 row-cols-md-2 row-cols-lg-3">
              <div className="col">
                <div className="event">
                  <div className="event-content bg-white border-radius-10 p-30">
                    <div className="pt-30 d-flex justify-content-between">
                      <span className>
                        <i className="ri-calendar-check-line text-gray-2" />
                        <span className="font-12 text-gray-1">
                          July 23, 2021
                        </span>
                      </span>
                      <div className="dropdown custom">
                        <i
                          className="ri-more-2-fill"
                          type="button"
                          id="dropdownMenuButton1"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <li>
                            <a className="dropdown-item" href="">
                              <span>View Registration</span>
                              <span className="icon">
                                <i className="ri-check-line" />
                              </span>
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="">
                              <span>Join Discussion</span>
                              <span className="icon">
                                <i className="ri-check-line" />
                              </span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <h6 className="font-18 font-weight-700">
                      Global Leaders’ Conference ‘21
                    </h6>
                    <span className="text-gray-2 font-14">
                      By:{" "}
                      <span className="text-dark font-weight-700">
                        Quinton,
                      </span>{" "}
                      <i className="ri-map-pin-line ms-2 " /> San Francisco Area
                    </span>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="event">
                  <div className="image">
                    <img
                      src="/img/dashboard_event_photo_4.jpg"
                      className="border-radius-10 w-100"
                    />
                    <div className="time font-12">
                      36 Days <span>:</span> 12 Hours <span>:</span> 34 Minutes{" "}
                      <span>:</span> 23 Seconds
                    </div>
                  </div>
                  <div className="event-content bg-white border-radius-10 p-30">
                    <div className="pt-30 d-flex justify-content-between">
                      <span className>
                        <i className="ri-calendar-check-line text-gray-2" />
                        <span className="font-12 text-gray-1">
                          July 23, 2021
                        </span>
                      </span>
                      <div className="dropdown custom">
                        <i
                          className="ri-more-2-fill"
                          type="button"
                          id="dropdownMenuButton1"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <li>
                            <a className="dropdown-item" href="">
                              <span>View Registration</span>
                              <span className="icon">
                                <i className="ri-check-line" />
                              </span>
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="">
                              <span>Join Discussion</span>
                              <span className="icon">
                                <i className="ri-check-line" />
                              </span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <h6 className="font-18 font-weight-700">
                      Global Leaders’ Conference ‘21
                    </h6>
                    <span className="text-gray-2 font-14">
                      By:{" "}
                      <span className="text-dark font-weight-700">
                        Quinton,
                      </span>{" "}
                      <i className="ri-map-pin-line ms-2 " /> San Francisco Area
                    </span>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="mt-5">
              <div className="row">
                <div className="col-lg-8">
                  <div className="bg-white">
                    <div className="bg-white rounded">
                      <CustomEventCalender />...
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="event-attended">
                    <h5 className="font-24 font-weight-700">Events Attended</h5>
                    {upComingEventData &&
                      upComingEventData.slice(0, 3).map((d, index) => {
                        return (
                          <div
                            key={index}
                            className="event-attended-item border-radius-10 mt-3 bg-white p-20"
                          >
                            <div className="d-flex align-items-start">
                              <Link href={`/event/${d._id}`}>
                                <a>
                                  <img
                                    src={`${NEXT_PUBLIC_BASE_URL}/event/getEventBannerById/${d._id}`}
                                    className="border-radius-10 me-3"
                                    height="80"
                                    width="80"
                                  />
                                </a>
                              </Link>
                              <div className="flex-fill">
                                <div className="d-flex justify-content-between align-items-end">
                                  <span className="text-gray-2 font-13">
                                    {format(
                                      new Date(d.start_date),
                                      "MMMM dd, yyyy"
                                    )}
                                  </span>
                                  <div className="dropdown custom">
                                    <i
                                      className="ri-more-2-fill"
                                      type="button"
                                      id="dropdownMenuButton1"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    />
                                    <ul
                                      className="dropdown-menu"
                                      aria-labelledby="dropdownMenuButton1"
                                    >
                                      <li>
                                        <Link href={`/event/${d._id}`}>
                                          <a className="dropdown-item">
                                            <span>View Registration</span>
                                            <span className="icon">
                                              <i className="ri-check-line" />
                                            </span>
                                          </a>
                                        </Link>
                                      </li>
                                      <li>
                                        <Link href={`/event/${d._id}`}>
                                          <a className="dropdown-item">
                                            <span>Join Discussion</span>
                                            <span className="icon">
                                              <i className="ri-check-line" />
                                            </span>
                                          </a>
                                        </Link>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                <h6 className="font-16">
                                  Color Implementation in Design
                                </h6>
                                <span className="font-14 text-gray-2 d-flex">
                                  By:{" "}
                                  <span className="text-dark">Quinton,</span>
                                  San Francisco Area
                                </span>
                                <button className="btn btn-outline-primary">
                                  Send Feedback
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {/* 
                    <div className="event-attended-item border-radius-10 mt-3 bg-white p-20">
                      <div className="d-flex align-items-start">
                        <img
                          src="/img/event_2.jpg"
                          className="border-radius-10 me-3"
                        />
                        <div className="flex-fill">
                          <div className="d-flex justify-content-between align-items-end">
                            <span className="text-gray-2 font-13">
                              July 23, 2021
                            </span>
                            <div className="dropdown custom">
                              <i
                                className="ri-more-2-fill"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              />
                              <ul
                                className="dropdown-menu"
                                aria-labelledby="dropdownMenuButton1"
                              >
                                <li>
                                  <a className="dropdown-item" href="">
                                    <span>View Registration</span>
                                    <span className="icon">
                                      <i className="ri-check-line" />
                                    </span>
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="">
                                    <span>Join Discussion</span>
                                    <span className="icon">
                                      <i className="ri-check-line" />
                                    </span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <h6 className="font-16">
                            Color Implementation in Design
                          </h6>
                          <span className="font-14 text-gray-2">
                            By: <span className="text-dark">Quinton,</span>
                            San Francisco Area
                          </span>
                          <div className="text-warning">
                            <i className="ri-star-fill" />
                            <i className="ri-star-fill" />
                            <i className="ri-star-fill" />
                            <i className="ri-star-fill" />
                            <i className="ri-star-fill" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="event-attended-item border-radius-10 mt-3 bg-white p-20">
                      <div className="d-flex align-items-start">
                        <img
                          src="/img/event_3.jpg"
                          className="border-radius-10 me-3"
                        />
                        <div className="flex-fill">
                          <div className="d-flex justify-content-between align-items-end">
                            <span className="text-gray-2 font-13">
                              July 23, 2021
                            </span>
                            <div className="dropdown custom">
                              <i
                                className="ri-more-2-fill"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              />
                              <ul
                                className="dropdown-menu"
                                aria-labelledby="dropdownMenuButton1"
                              >
                                <li>
                                  <a className="dropdown-item" href="">
                                    <span>View Registration</span>
                                    <span className="icon">
                                      <i className="ri-check-line" />
                                    </span>
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="">
                                    <span>Join Discussion</span>
                                    <span className="icon">
                                      <i className="ri-check-line" />
                                    </span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <h6 className="font-16">
                            Color Implementation in Design
                          </h6>
                          <span className="font-14 text-gray-2 d-flex">
                            By: <span className="text-dark">Quinton,</span>
                            San Francisco Area
                          </span>
                          <button className="btn btn-outline-primary">
                            Send Feedback
                          </button>
                        </div>
                      </div>
                    </div>
                  */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
eventCalender.layout = "AttendeesWothoutsidebar";
export default eventCalender;
