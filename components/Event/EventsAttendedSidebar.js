import React, { useEffect, useState, useRef } from "react";
function EventsAttendedSidebar() {
  const [isParticipantExists, setIsParticipantExists] = useState(false);
  useEffect(async () => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsParticipantExists(false);
    } else {
      const result =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("result"))
          : null;

      if (!result) {
        setIsParticipantExists(true);
      }
    }
  }, []);
  return (
    <>
      {!isParticipantExists && (
        <div className="col-lg-4">
          <div className="event-attended">
            <h5 className="font-24 font-weight-700">Events Attended</h5>
            <div className="event-attended-item border-radius-10 mt-3 bg-white p-20">
              <div className="d-flex align-items-start">
                <img
                  src="/img/event_1.jpg"
                  className="border-radius-10 me-3"
                  alt=""
                />
                <div className="flex-fill">
                  <div className="d-flex justify-content-between align-items-end">
                    <span className="text-gray-2 font-13">July 23, 2021</span>
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
                  <h6 className="font-16">Color Implementation in Design</h6>
                  <span className="font-14 text-gray-2">
                    By: <span className="text-dark">Quinton,</span>
                    San Francisco Area
                  </span>
                  <br />
                  <button className="btn btn-primary ">Send Feedback</button>
                </div>
              </div>
            </div>
            <div className="event-attended-item border-radius-10 mt-3 bg-white p-20">
              <div className="d-flex align-items-start">
                <img
                  src="/img/event_2.jpg"
                  className="border-radius-10 me-3"
                  alt=""
                />
                <div className="flex-fill">
                  <div className="d-flex justify-content-between align-items-end">
                    <span className="text-gray-2 font-13">July 23, 2021</span>
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
                  <h6 className="font-16">Color Implementation in Design</h6>
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
                  alt=""
                />
                <div className="flex-fill">
                  <div className="d-flex justify-content-between align-items-end">
                    <span className="text-gray-2 font-13">July 23, 2021</span>
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
                  <h6 className="font-16">Color Implementation in Design</h6>
                  <span className="font-14 text-gray-2">
                    By: <span className="text-dark">Quinton,</span>
                    San Francisco Area
                  </span>
                  <br />
                  <button className="btn btn-outline-primary">
                    Send Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventsAttendedSidebar;
