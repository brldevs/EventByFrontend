import Flags from "country-flag-icons/react/3x2";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuthData } from "../../context/auth";
import {
  getAssetWithPath,
  logOut,
  checkUserSubscription,
  checkEventCreationFacility,
  userPersonalDetails,
} from "../../services/service";
import { useRouter } from "next/router";
import { useAlert } from "react-alert";
const NavMenu = (params) => {
  const alert = useAlert();
  const router = useRouter();
  const { data, setAuthValues, removeAuthValues } = useAuthData();
  const [profileImgView, setProfileImgView] = useState(null);

  const [isSignUpWithoutEventBy, setIsSignUpWithoutEventBy] = useState(null);
  const [participantName, setParticipantName] = useState(null);
  const [participantEmail, setParticipantEmail] = useState(null);

  const [userFirstName, setUserFirstName] = useState(null);
  const [userLastName, setUserLastName] = useState(null);
  const [userEmailAddress, setUserEmailAddress] = useState(null);
  const [profileImgPath, setProfileImgPath] = useState(null);
  useEffect(async () => {
    console.log("Calling useEffect-> ");
    const result =
      typeof window !== "undefined" ? localStorage.getItem("result") : null;
    const resultParse = JSON.parse(result);
    if (resultParse) {
      setUserFirstName(resultParse.firstName);
      setUserLastName(resultParse.lastName);
      setUserEmailAddress(resultParse.email);
    }

    import("bootstrap/dist/js/bootstrap.bundle.js");
    const accessToken = localStorage.getItem("token");

    setIsSignUpWithoutEventBy(localStorage.getItem("isSignUpWithoutEventBy"));

    setParticipantName(localStorage.getItem("participant_name"));

    setParticipantEmail(localStorage.getItem("participant_email"));

    if (accessToken) {
      const responseUserPersonalDetails = await userPersonalDetails(
        accessToken
      );
      if (responseUserPersonalDetails?.data?.profile_picture) {
        // setProfileImgPath(responseUserPersonalDetails.data.profile_picture);
        // localStorage.setItem(
        //   "profileImage",
        //   responseUserPersonalDetails.data.profile_picture
        // );

        if (accessToken && responseUserPersonalDetails.data.profile_picture) {
          const res = await getAssetWithPath(
            accessToken,
            responseUserPersonalDetails.data.profile_picture
          );
          setProfileImgView(res);
        }
      }
    }
  }, [data]);

  const redirectToCreateEvent = async () => {
    const accessToken = localStorage.getItem("token");
    const response = await checkEventCreationFacility(accessToken);

    console.log("checkEventCreationFacility RESPONSE: ");
    console.log(response);
    if (response.status === 200) {
      router.push("/event/create");
    } else if (response.status === 203 || response.status === 204) {
      alert.show(
        "Please subscribe to a package and setup your Ticket Payment Option first!",
        { type: "error" }
      );
    } else {
      alert.show(response.message, { type: "error" });
    }
  };

  const redirectToMyEvents = async () => {
    const accessToken = localStorage.getItem("token");
    const response = await checkEventCreationFacility(accessToken);
    if (response.status === 200) {
      router.push("/organizer/myevent");
    } else if (response.status === 203 || response.status === 204) {
      alert.show(
        "Please subscribe to a package and setup your Ticket Payment Option first!",
        { type: "error" }
      );
    } else {
      alert.show(response.message, { type: "error" });
    }
  };

  return (
    <header id="nav">
      <nav className="navbar navbar-expand-xl navbar-light bg-white py-4">
        <div className="container">
          {data.token && data.result.role === "organizer" ? (
            <Link href="/event/dashboard">
              <a className="navbar-brand">
                <object
                  data="/img/logo.svg"
                  width={140}
                  type="image/svg+xml"
                  style={{ pointerEvents: "none" }}
                />
              </a>
            </Link>
          ) : data.token && data.result.role === "attendee" ? (
            <Link href="/attendees">
              <a className="navbar-brand">
                <object
                  data="/img/logo.svg"
                  width={140}
                  type="image/svg+xml"
                  style={{ pointerEvents: "none" }}
                />
              </a>
            </Link>
          ) : (
            <Link href="/">
              <a className="navbar-brand">
                <object
                  data="/img/logo.svg"
                  width={140}
                  type="image/svg+xml"
                  style={{ pointerEvents: "none" }}
                />
              </a>
            </Link>
          )}

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mt-3 mt-md-0">
              {data.token && data.result.role === "attendee" && (
                <li className="nav-item">
                  <a className="nav-link" href="/attendees">
                    Home
                  </a>
                </li>
              )}
              {data.token && data.result.role === "organizer" && (
                <li className="nav-item">
                  <a className="nav-link" href="/event/dashboard">
                    Home
                  </a>
                </li>
              )}
              {/* HELP, ABOUT, MY EVENTS AND EVENT CALENDAR */}
              <li className="nav-item dropdown">
                {/* <a
                  className="nav-link"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Help
                  <i className="ri-arrow-down-s-line" />
                </a> */}
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {/* <li>
                    <a className="dropdown-item" href="#">
                      about
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      a
                    </a>
                  </li> */}
                </ul>
              </li>
              <li className="nav-item">
                {/* <a className="nav-link" href="#">
                  About
                </a> */}
              </li>
              <li className="nav-item">
                {/* <a className="nav-link" href="#">
                  Create Event
                </a> */}
              </li>

              {/* MY EVENTS AND EVENT CALENDAR START */}
              {data.token && data.result.role === "organizer" && (
                <>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      onClick={redirectToMyEvents}
                      style={{ cursor: "pointer" }}
                    >
                      My Events
                    </a>
                  </li>
                  {/* <li className="nav-item">
                    <Link href="/organizer/eventattendees">
                      <a className="nav-link">Manage Events</a>
                    </Link>
                  </li> */}

                  <li className="nav-item">
                    <Link href="/event/dashboard">
                      <a className="nav-link">Event Calendar</a>
                    </Link>
                  </li>
                </>
              )}
              {/* MY EVENTS AND EVENT CALENDAR END */}
            </ul>
            {/* LOGIN BUTTON AND LANGUAGE SWITCH BUTTON START */}
            {!data.token && (
              <>
                {/* CONDITIONAL LOGIN / SIGNUP BUTTON START */}
                {router.pathname === "/organizer/login" && (
                  <Link href="/organizer/registration">
                    <a className="btn btn-primary me-4">Sign Up</a>
                  </Link>
                )}

                {router.pathname === "/organizer/registration" && (
                  <Link href="/organizer/login">
                    <a className="btn btn-primary me-4">Login</a>
                  </Link>
                )}
                {router.pathname === "/organizer/forgetpassword" && (
                  <Link href="/organizer/login">
                    <a className="btn btn-primary me-4">Login</a>
                  </Link>
                )}
                {router.pathname.includes("/organizer/reset-password") && (
                  <Link href="/organizer/login">
                    <a className="btn btn-primary me-4">Login</a>
                  </Link>
                )}

                {/* attendee */}

                {router.pathname === "/attendees/login" && (
                  <Link href="/attendees/registration">
                    <a className="btn btn-primary me-4">Sign Up</a>
                  </Link>
                )}

                {router.pathname === "/attendees/registration" && (
                  <Link href="/attendees/login">
                    <a className="btn btn-primary me-4">Login</a>
                  </Link>
                )}
                {router.pathname === "/attendees/forgetpassword" && (
                  <Link href="/attendees/login">
                    <a className="btn btn-primary me-4">Login</a>
                  </Link>
                )}
                {router.pathname.includes("/attendees/reset-password") && (
                  <Link href="/attendees/login">
                    <a className="btn btn-primary me-4">Login</a>
                  </Link>
                )}
                {/* CONDITIONAL LOGIN / SIGNUP BUTTON END */}
              </>
            )}
            {!data.token &&
              router.pathname.includes("event") &&
              !isSignUpWithoutEventBy && (
                <Link href="/attendees/login">
                  <a className="btn btn-primary px-3 me-4">
                    <i className="ri-calendar-line " /> Sign Up With EventBy{" "}
                  </a>
                </Link>
              )}

            {!data.token && !isSignUpWithoutEventBy && (
              <span className="dropdown flag">
                {/* <button
                  className="btn d-flex align-items-center justify-content-center font-weight-500"
                  data-bs-toggle="dropdown"
                >
                  <Flags.US
                    title="United States"
                    className="rounded-sm m-1 "
                    width="25"
                  />
                  ENG
                  <i className="ri-arrow-down-s-line" />
                </button>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="#">
                    <Flags.CA className="rounded-sm m-1" width="25" />
                    CA
                  </a>
                  <a className="dropdown-item" href="#">
                    <Flags.BD className="rounded-sm m-1" width="25" />
                    BAN
                  </a>
                </div>
               */}
              </span>
            )}

            {/* PARTICIPANT NAME, EMAIL & LOGOUT BUTTON START*/}
            {isSignUpWithoutEventBy && (
              <>
                {/* NOTIFICATION DROPDOWN START */}
                <span className="position-relative notification dropdown cursor-pointer me-4">
                  {/* <i
                    className="ri-notification-3-line"
                    type="button"
                    id="notification"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  />
                  <span className="active rounded-circle position-absolute bg-secondary" />
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="notification"
                  >
                   
                  </ul> */}
                </span>
                {/* NOTIFICATION DROPDOWN END */}

                {/* USER NAME AND PROFILE IMAGE START */}
                <span className="user-panel dropdown">
                  <div
                    className="d-flex align-items-center cursor-pointer"
                    type="button"
                    id="user"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={
                        profileImgView
                          ? URL.createObjectURL(profileImgView)
                          : `/img/organizer_1.png`
                      }
                      height={40}
                      width={40}
                      className="rounded-circle me-2"
                    />
                    <span>{participantName}</span>
                    <i className="ms-2 ri-arrow-down-s-line" />
                  </div>
                  {/* ****************************DROPDOWN MENU START *****************************/}
                  <div
                    className="dropdown-menu logout dropdown-menu-end"
                    aria-labelledby="user"
                  >
                    <div className="logged-user">
                      <div className="d-flex justify-content-between">
                        <div className="d-flex">
                          <div className="user-photo">
                            <img
                              src={
                                profileImgView
                                  ? URL.createObjectURL(profileImgView)
                                  : `/img/organizer_1.png`
                              }
                            />
                          </div>
                          <div>
                            <span className="font-18 d-block">
                              {participantName}
                            </span>
                            <span className="text-gray-2 font-13">
                              {participantEmail}
                            </span>
                          </div>
                        </div>
                        <i className="ri-checkbox-circle-fill font-20 text-secondary" />
                      </div>
                    </div>

                    <div className="logout-menu">
                      <Link href="/">
                        <a
                          className="d-block text-gray-2 font-14 py-1 ps-4"
                          onClick={() => {
                            logOut();
                            removeAuthValues();
                          }}
                        >
                          <i className="ri-logout-box-r-line me-2" />
                          Logout {participantName}
                        </a>
                      </Link>
                    </div>
                  </div>
                </span>
              </>
            )}
            {/* PARTICIPANT NAME, EMAIL & LOGOUT BUTTON END*/}

            {/* LOGIN BUTTON AND LANGUAGE SWITCH BUTTON END */}
            {data.token && (
              <>
                {/* CREATE EVENT BUTTON START */}
                {data.result.role === "organizer" && (
                  <a
                    className="btn btn-primary px-3 me-4 font-weight-500"
                    onClick={redirectToCreateEvent}
                  >
                    <i className="ri-calendar-line " /> Create Event
                  </a>
                )}
                {/* CREATE EVENT BUTTON END */}

                {/* NOTIFICATION DROPDOWN START */}
                <span className="position-relative notification dropdown cursor-pointer me-4">
                  {/* <i
                    className="ri-notification-3-line"
                    type="button"
                    id="notification"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  />
                  <span className="active rounded-circle position-absolute bg-secondary" />
                  <ul
                    className="mx-3 notificationlist shadow dropdown-menu dropdown-menu-end"
                    aria-labelledby="notification"
                  >
                    <div className="p-3 d-flex flex-row justify-content-between">
                      <div>Notification</div>
                      <div className="text-primary fontSize-12 pt-1 me-3">
                        <i class="ri-check-double-line"></i> Mark as read
                      </div>
                    </div>
                    <li>
                      <div className="row m-2 text-dark cursor-pointer">
                        <div className="col-1 text-end p-1">
                          <i class="ri-checkbox-blank-circle-fill fontSize-12  text-secondary"></i>
                        </div>
                        <div className="col-10 font-weight-40 fontSize-14 p-0">
                          Your password has been successfully changed
                          <br />
                          <span className="text-gray-2 fontSize-12">
                            Feb 23, 2022 at 09:15 AM
                          </span>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="row m-2  text-dark">
                        <div className="col-1 text-end p-1">
                          <i class="ri-checkbox-blank-circle-fill fontSize-12  text-secondary"></i>
                        </div>
                        <div className="col-10 font-weight-40 fontSize-14 p-0">
                          Your password has been successfully changed
                          <br />
                          <span className="text-gray-2 fontSize-12">
                            Feb 23, 2022 at 09:15 AM
                          </span>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="row m-2 text-gray-2">
                        <div className="col-1 text-end p-1">
                          <i class="ri-checkbox-blank-circle-fill fontSize-12 "></i>
                        </div>
                        <div className="col-10 font-weight-40 fontSize-14 p-0">
                          Your password has been successfully changed
                          <br />
                          <span className="text-gray-2 fontSize-12">
                            Feb 23, 2022 at 09:15 AM
                          </span>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="row m-2 text-gray-2">
                        <div className="col-1 text-end p-1">
                          <i class="ri-checkbox-blank-circle-fill fontSize-12 "></i>
                        </div>
                        <div className="col-10 font-weight-40 fontSize-14 p-0">
                          Your password has been successfully changed
                          <br />
                          <span className="text-gray-2 fontSize-12">
                            Feb 23, 2022 at 09:15 AM
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <ul
                    className="notificationlist shadow dropdown-menu dropdown-menu-end  "
                    aria-labelledby="notification"
                  >
                    <li>
                      <a className="dropdown-item" href="#">
                        Action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Another action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item text-dark" href="#">
                        Your password has been successfully changed
                        <span className="text-scoundery"></span>Feb 23, 2022 at
                        09:15 AM
                      </a>
                    </li>
                  </ul> */}
                </span>
                {/* NOTIFICATION DROPDOWN END */}

                {/* USER NAME AND PROFILE IMAGE START */}
                <span className="user-panel dropdown">
                  <div
                    className="d-flex align-items-center cursor-pointer"
                    type="button"
                    id="user"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={
                        profileImgView
                          ? URL.createObjectURL(profileImgView)
                          : `/img/organizer_1.png`
                      }
                      height={40}
                      width={40}
                      className="rounded-circle me-2"
                    />
                    <span>
                      {`${userFirstName} ${userLastName}`}
                      {/* {data.result.firstName} {data.result.lastName}{" "} */}
                      {data.participant_name}
                    </span>
                    <i className="ms-2 ri-arrow-down-s-line" />
                  </div>
                  {/* ****************************DROPDOWN MENU START *****************************/}
                  <div
                    className="dropdown-menu logout dropdown-menu-end"
                    aria-labelledby="user"
                  >
                    <div className="logged-user">
                      <div className="d-flex justify-content-between">
                        <div className="d-flex">
                          <div className="user-photo">
                            <img
                              src={
                                profileImgView
                                  ? URL.createObjectURL(profileImgView)
                                  : `/img/organizer_1.png`
                              }
                            />
                          </div>
                          <div>
                            <span className="font-18 d-block">
                              {data.token && `${userFirstName} ${userLastName}`}
                              {/* {data.token && data.result.firstName}
                              {data.token && data.result.lastName} */}
                            </span>
                            <span className="text-gray-2 font-13">
                              {data.token && userEmailAddress}
                              {/* {data.token && data.result.email} */}
                            </span>
                          </div>
                        </div>
                        <i className="ri-checkbox-circle-fill font-20 text-secondary" />
                      </div>
                    </div>

                    {data.token && data.result.role === "organizer" && (
                      <Link href="/organizer/accountsetting/personalinfo">
                        <a>
                          <div className="account-setting text-white text-center bg-primary">
                            Account Settings
                          </div>
                        </a>
                      </Link>
                    )}

                    {data.token && data.result.role === "attendee" && (
                      <Link href="/attendees/accountsetting/personalinfo">
                        <a>
                          <div className="account-setting text-white text-center bg-primary">
                            Account Settings
                          </div>
                        </a>
                      </Link>
                    )}

                    <div className="logout-menu">
                      {data.token && data.result.role === "organizer" && (
                        <Link href="/organizer/login">
                          <a
                            className="d-block text-gray-2 font-14 py-1 ps-4"
                            onClick={() => {
                              logOut();
                              removeAuthValues();
                            }}
                          >
                            <i className="ri-logout-box-r-line me-2" />
                            Logout{" "}
                            {data.token && `${userFirstName} ${userLastName}`}
                            {/* {`(${data.token && data.result.firstName} ${
                              data.token && data.result.lastName
                            })`} */}
                          </a>
                        </Link>
                      )}

                      {data.token && data.result.role === "attendee" && (
                        <Link href="/attendees/login">
                          <a
                            className="d-block text-gray-2 font-14 py-1 ps-4"
                            onClick={() => {
                              logOut();
                              removeAuthValues();
                            }}
                          >
                            <i className="ri-logout-box-r-line me-2" />
                            Logout{" "}
                            {`(${data.token && data.result.firstName} ${
                              data.token && data.result.lastName
                            })`}
                          </a>
                        </Link>
                      )}
                      {/* <Link href="/organizer">
                        <a
                          href
                          className="d-block text-gray-2 font-14 py-1 ps-4"
                          onClick={logOut}
                        >
                          <i className="ri-logout-box-r-line me-2" />
                          Logout{" "}
                          {`(${data.token && data.result.firstName} ${data.token && data.result.lastName
                            })`}
                        </a>
                      </Link> */}

                      {/* <Link href="/organizer">

                      <Link href="/organizer">

                        <a className="d-block text-gray-2 font-14 py-1 ps-4">
                          <i className="ri-logout-box-r-line me-2" />
                          Switch to{" "}
                          {data.token && data.result.role === "organizer"
                            ? "Attendee"
                            : "Organizer"}
                        </a>
                      </Link> */}
                    </div>
                  </div>
                </span>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
export default NavMenu;
