import { format } from "date-fns";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuthData } from "../../../context/auth";
import OnsaleFalg from "./OnSaleFlag";
import UserProgressBar from "./UserProgressBar";
import ExpiredFlag from "./ExpiredFlag";

function MyEventItem({ upComingEventsData }) {
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const { data, setAuthValues, removeAuthValues } = useAuthData();

  return (
    <React.Fragment>
      {upComingEventsData.map((item, index) => {
        const { data: d, financialInfo, totalParticipant } = item;
        return (
          <div className="col" key={index}>
            <div className="event-item">
              <div className="image">
                <img
                  src={`${NEXT_PUBLIC_BASE_URL}/event/getEventBannerById/${d._id}`}
                  className="w-100 d-block border-radius-10"
                  alt="banner_img"
                />

                <span className="online-btn">{d.event_type}</span>
              </div>
              <div className="event-content">
                <div className="all-content">
                  <div className="texts">
                    <div className="date-and-option">
                      {new Date(d.start_date).getTime() <
                      new Date().getTime() ? (
                        <ExpiredFlag
                          title="Expired"
                          date={format(new Date(d.start_date), "MMMM dd, yyyy")}
                        />
                      ) : (
                        <OnsaleFalg
                          title={d.is_event_draft ? "Drafted" : "On Sale"}
                          date={format(new Date(d.start_date), "MMMM dd, yyyy")}
                        />
                      )}
                      {/* {true && (
                      <OnsaleFalg
                        title={d.is_event_draft ? "Drafted" : "On Sale"}
                        date={format(new Date(d.start_date), "MMMM dd, yyyy")}
                      />
                      )} */}

                      <div className="dropdown dropdown-dashboard">
                        <i
                          className="ri-more-2-fill"
                          type="button"
                          id="dropdownMenuButton1"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{ color: "#B4BBCC" }}
                        />
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <li>
                            <Link href={`/event/${d._id}`}>
                              <a target="_blank" className="dropdown-item">
                                <span>View Event</span>
                                <span className="icon">
                                  <i className="ri-check-line" />
                                </span>
                              </a>
                            </Link>
                          </li>
                          <li>
                            <Link href={`/organizer/eventOverView/${d._id}`}>
                              <a target="_blank" className="dropdown-item">
                                <span>Manage Event</span>
                                <span className="icon">
                                  <i className="ri-check-line" />
                                </span>
                              </a>
                            </Link>
                          </li>
                          <li>
                            <a className="dropdown-item" href="">
                              <span>Share Event</span>
                              <span className="icon">
                                <i className="ri-check-line" />
                              </span>
                            </a>
                          </li>
                          <li>
                            <Link href={`/organizer/eventattendees/${d._id}`}>
                              <a target="_blank" className="dropdown-item">
                                <span>Event Invitee</span>
                                <span className="icon">
                                  <i className="ri-check-line" />
                                </span>
                              </a>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href={`/organizer/eventparticipants/${d._id}`}
                            >
                              <a target="_blank" className="dropdown-item">
                                <span>Event Participant</span>
                                <span className="icon">
                                  <i className="ri-check-line" />
                                </span>
                              </a>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <h6 className="font-18 title font-weight-500">
                      {d.name} {/* {JSON.stringify(upComingEventsData)} */}
                    </h6>
                    <div className="quinton">
                      <span className="text-gray-2">By: </span>
                      <span className="font-weight-500 text-dark">
                        {data.token && data.result.firstName}{" "}
                        {data.token && data.result.lastName}
                      </span>
                      <span className="text-gray-2">
                        , {data.token && data.result.location_address}
                      </span>
                    </div>
                  </div>
                  <div className="upcoming-event mt-3 flex-wrap  d-flex align-items-center justify-content-between">
                    {totalParticipant > 0 ? (
                      <>
                        <div className="d-flex flex-wrap align-items-center mb-2">
                          <div className="followers me-2 mb-2">
                            {totalParticipant === 1 && (
                              <span className="d-inline-block rounded-circle">
                                <img src="/img/organizer_1.png" />
                              </span>
                            )}

                            {totalParticipant === 2 && (
                              <>
                                <span className="d-inline-block rounded-circle">
                                  <img src="/img/organizer_1.png" />
                                </span>
                                <span className="d-inline-block rounded-circle">
                                  <img src="/img/organizer_2.png" />
                                </span>
                              </>
                            )}

                            {totalParticipant === 3 && (
                              <>
                                <span className="d-inline-block rounded-circle">
                                  <img src="/img/organizer_1.png" />
                                </span>
                                <span className="d-inline-block rounded-circle">
                                  <img src="/img/organizer_2.png" />
                                </span>
                                <span className="d-inline-block rounded-circle">
                                  <img src="/img/organizer_3.png" />
                                </span>
                              </>
                            )}

                            {totalParticipant === 4 && (
                              <>
                                <span className="d-inline-block rounded-circle">
                                  <img src="/img/organizer_1.png" />
                                </span>
                                <span className="d-inline-block rounded-circle">
                                  <img src="/img/organizer_2.png" />
                                </span>
                                <span className="d-inline-block rounded-circle">
                                  <img src="/img/organizer_3.png" />
                                </span>
                                <span className="d-inline-block rounded-circle">
                                  <img src="/img/organizer_4.png" />
                                </span>
                              </>
                            )}
                            {totalParticipant > 4 && (
                              <>
                                <span className="d-inline-block rounded-circle">
                                  <img src="/img/organizer_1.png" />
                                </span>
                                <span className="d-inline-block rounded-circle">
                                  <img src="/img/organizer_2.png" />
                                </span>
                                <span className="d-inline-block rounded-circle">
                                  <img src="/img/organizer_3.png" />
                                </span>
                                <span className="d-inline-block rounded-circle">
                                  <img src="/img/organizer_4.png" />
                                </span>
                              </>
                            )}
                          </div>
                          <span className="font-10 text-gray-2">
                            {totalParticipant > 500
                              ? `${totalParticipant}+ More`
                              : totalParticipant}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="d-flex flex-wrap align-items-center mb-2">
                          <div className="followers me-2 mb-2"></div>
                        </div>
                      </>
                    )}

                    {financialInfo.totalTickets !== null &&
                      financialInfo.totalTickets > 0 && (
                        <UserProgressBar
                          totalTicket={financialInfo.totalTickets}
                          soldTicket={financialInfo.sold}
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
}
export default MyEventItem;
