import React, { useState, useEffect } from "react";
import {
  getUpComingEventsData,
  getEventBannerByEventId,
} from "../../services/service";
import { format, compareAsc } from "date-fns";
import { useAuthData } from "../../context/auth";
import Link from "next/link";
function UpcomingEvent({ organizerId, organizerName }) {
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [upComingEventData, setUpComingEventData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data, setAuthValues, removeAuthValues } = useAuthData();
  useEffect(async () => {
    setIsLoading(true);
    const res = await getUpComingEventsData(organizerId);

    if (res.status === 200) {
      setUpComingEventData(res.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="upcoming-event">
          {upComingEventData > 0 && (
            <h5 className="font-20 m-0 text-dark">Upcoming Event</h5>
          )}

          {upComingEventData &&
            upComingEventData.slice(0, 3).map((dataItem, index) => {
              const { data: d, totalParticipant } = dataItem;
              return (
                <div
                  key={index}
                  className="event d-flex bg-white border-radius-10 p-4 mt-4"
                >
                  <Link href={`/event/${d._id}`}>
                    <a>
                      <img
                        src={`${NEXT_PUBLIC_BASE_URL}/event/getEventBannerById/${d._id}`}
                        className="rounded me-3"
                        alt="banner_img"
                      />
                    </a>

                    {/* <object
                    className="rounded me-3"
                    data={`http://35.238.61.43/event/getEventBannerById/${data._id}`}
                    type="image/png"
                  >
                    <img
                      src="/img/event_1.jpg"
                      alt="banner_img"
                      className="rounded me-3"
                    /> 
                  </object>*/}
                  </Link>
                  <div>
                    <span className="text-gray-2" style={{ fontSize: "13px" }}>
                      {format(new Date(d.start_date), "MMMM dd, yyyy")}
                    </span>
                    <Link href={`/event/${d._id}`}>
                      <a>
                        <h5
                          className="text-dark font-weight-500 "
                          style={{ fontSize: "16px", lineHeight: "19px" }}
                        >
                          {d.name}
                        </h5>
                      </a>
                    </Link>
                    <span className="text-gray-2">
                      By: <span className="text-primary">{organizerName}</span>,{" "}
                      {data.token && data.result.location_address}
                    </span>
                    {totalParticipant > 0 && (
                      <>
                        <div className="d-flex align-items-center mt-3">
                          <div className="followers me-2">
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
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}

export default UpcomingEvent;
