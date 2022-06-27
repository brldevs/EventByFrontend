import $ from "jquery";
import Head from "next/head";
import Image from "next/image";
import DateFnsUtils from "@date-io/date-fns";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Row, Form, Button, Col } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAlert } from "react-alert";
import { ErrorMessage } from "@hookform/error-message";
import EventDashboard from "../../../components/layout/EventDashboard";
import Link from "next/link";
const PREFIX_URL =
  "https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/";
import {
  eventAddInviteeByEventId,
  eventGetInviteeByEventId,
  sendRSVPInviteeEmail,
} from "../../../services/service";
import EventCard from "../../../components/Event/EventCard";
import ReactPaginate from "react-paginate";

// const tempDATA = [
//   {
//     _id: "625fa403302966a84485913d",
//     name: "Turzo Invitee",
//     email: "turzoinvitee@gmail.com",
//     profile_image: "1650435075201_speaker1.jpeg",
//     isRSVP: "Yes",
//     event_id: "624d4dc9d0879189bd3af900",
//     created_at: "2022-04-20T00:00:00.000Z",
//     modified_at: "2022-04-20T00:00:00.000Z",
//     __v: 0,
//   },
//   {
//     _id: "625fa418302966a844859142",
//     name: "Shohag Ahmed",
//     email: "shohag@gmail.com",
//     profile_image: "1650435096939_speaker1.jpeg",
//     isRSVP: "No",
//     event_id: "624d4dc9d0879189bd3af900",
//     created_at: "2022-04-20T00:00:00.000Z",
//     modified_at: "2022-04-20T00:00:00.000Z",
//     __v: 0,
//   },
//   {
//     _id: "625fa42a302966a844859147",
//     name: "Ratul Sinha",
//     email: "ratul@gmail.com",
//     profile_image: "1650435114712_speaker1.jpeg",
//     isRSVP: "Pending",
//     event_id: "624d4dc9d0879189bd3af900",
//     created_at: "2022-04-20T00:00:00.000Z",
//     modified_at: "2022-04-20T00:00:00.000Z",
//     __v: 0,
//   },
//   {
//     _id: "6267a66146807cf69789a8c4",
//     name: "Tove Mintram",
//     email: "tmintram14@dyndns.org",
//     profile_image: "1650959969307_speaker4.jpeg",
//     isRSVP: "No",
//     event_id: "624d4dc9d0879189bd3af900",
//     created_at: "2022-04-26T00:00:00.000Z",
//     modified_at: "2022-04-26T00:00:00.000Z",
//     __v: 0,
//   },
//   {
//     _id: "6267a68946807cf69789a8d8",
//     name: "Phineas Franciottoi",
//     email: "pfranciottoi0@hostgator.com",
//     profile_image: "1650960009309_speaker4.jpeg",
//     isRSVP: "No",
//     event_id: "624d4dc9d0879189bd3af900",
//     created_at: "2022-04-26T00:00:00.000Z",
//     modified_at: "2022-04-26T00:00:00.000Z",
//     __v: 0,
//   },
// ];
const BootyCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
  <div className="form-check">
    <input
      htmlFor="booty-check"
      type="checkbox"
      className="form-check-input"
      ref={ref}
      onClick={onClick}
      {...rest}
    />
    <label className="form-check-label" id="booty-check" />
  </div>
));
function eventattendees() {
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const alert = useAlert();
  const [eventId, setEventId] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  console.log("EventID : " + id);
  const {
    setValue,
    setError,
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm({
    criteriaMode: "all",
  });

  const [token, setToken] = useState(null);
  const [isAddInviteeError, setIsAddInviteeError] = useState(false);
  const [inviteeList, setInviteeList] = useState([]);
  const [inviteeListDisplay, setInviteeListDisplay] = useState([]);

  const [selectedInviteeData, setSelectedInviteeData] = useState({});

  const onSubmit = async (data) => {
    setIsAddInviteeError(false);
    console.table(data);
    data = {
      eventId,
      name: data.inviteeName,
      email: data.inviteeEmail,
      profilePhoto: inviteePhoto,
      isRSVP: false,
    };
    const res = await eventAddInviteeByEventId(data, token);

    if (res.status === 200) {
      alert.show(res.message);
      router.reload();
    } else {
      setIsAddInviteeError(true);
    }
  };

  const onSubmitInvitation = async (data) => {
    data = {
      eventId,
      email: data.addInviteEmail,
      subject: data.addInviteSubject,
      body: data.addInviteMessage,
    };
    console.table(data);

    const res = await sendRSVPInviteeEmail(data, token);

    if (res.status === 200) {
      alert.show(res.message);
      router.reload();
    } else {
      router.reload();
      alert.show(res.message);
    }
  };

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
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap.bundle.js")
      : null;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(token);

    if (!token) {
      router.replace("/");
    }

    if (id && token) {
      setEventId(id);
      const res = await eventGetInviteeByEventId(id, token, currentPage, limit);

      if (res.status === 200) {
        setInviteeList(res.data);
        setInviteeListDisplay(res.data);
        setTotalItem(res.total);
        setPageCount(Math.ceil(res.total / limit));
      }
    }
  }, [id]);

  const [inviteePhotoPreview, setInviteePhotoPreview] = useState(null);
  const [inviteePhoto, setInviteePhoto] = useState(null);

  const handleChange = (event) => {
    setInviteePhotoPreview(URL.createObjectURL(event.target.files[0]));
    setInviteePhoto(event.target.files[0]);
  };

  const [selectedStartDate, setSelectedStartDate] = useState(new Date());

  const [isActiveFilter, setActiveFilter] = useState(false);
  const HandlerStatus = () => {
    setActiveFilter(!isActiveFilter);
    //alert(showResults);
  };

  const [isActiveFilterBulkAction, setActiveFilterBulkAction] = useState(false);
  const HandlerBulkAction = () => {
    setActiveFilterBulkAction(!isActiveFilterBulkAction);
    //alert(showResults);
  };

  const [isActiveFilterEntryPerPage, setActiveFilterEntryPerPage] =
    useState(false);
  const HandlerEntryPerPage = () => {
    setActiveFilterEntryPerPage(!isActiveFilterEntryPerPage);
    //alert(showResults);
  };

  const [bulkActionSelectedValue, setBulkActionSelectedValue] = useState(null);
  const [statusSelectedValue, setStatusSelectedValue] = useState(null);
  const [entryPerPageSelectedValue, setEntryPerPageSelectedValue] =
    useState(null);
  const bulkActionRadioHandler = (e) => {
    setActiveFilterBulkAction(false);
    setBulkActionSelectedValue(e.target.value);
  };
  const statusRadioHandler = (e) => {
    setActiveFilter(false);
    setStatusSelectedValue(e.target.value);
    filterEventAttendeesByStatus(e.target.value);
  };
  const entryPerPageRadioHandler = (e) => {
    setActiveFilterEntryPerPage(false);
    setEntryPerPageSelectedValue(e.target.value);
    filterEventAttendeesByEntryPerPage(e.target.value);
  };

  // filtering by Status
  const filterEventAttendeesByStatus = async (status) => {
    setIsLoading(true);

    const res = await eventGetInviteeByEventId(id, token, currentPage, limit);

    if (res.status === 200) {
      setInviteeListDisplay(
        res.data.filter((item) => item["isRSVP"] === status)
      );
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  // filtering by Entry Per Page
  const filterEventAttendeesByEntryPerPage = async (entryPerPage) => {
    setIsLoading(true);
    setLimit(entryPerPage);
    setPageCount(Math.ceil(totalItem / entryPerPage));

    const res = await eventGetInviteeByEventId(
      id,
      token,
      currentPage,
      entryPerPage
    );

    if (res.status === 200) {
      setInviteeListDisplay(
        res.data.filter((item) => item["isRSVP"] === statusSelectedValue)
      );
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  // ////////////////////////////////////--PAGINATION CODE START
  const [totalItem, setTotalItem] = useState(0); //NEED TO CHANGE AFTER TURZO VAI GIVE TOTAL DATA COUNT
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const changePage = async ({ selected }) => {
    setIsLoading(true);
    setCurrentPage(selected);
    const res = await eventGetInviteeByEventId(id, token, selected, limit);

    if (res.status === 200) {
      setInviteeListDisplay(
        res.data.filter((item) => item["isRSVP"] === statusSelectedValue)
      );
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };
  // ////////////////////////////////////--PAGINATION CODE END
  return (
    <EventDashboard eventId={eventId}>
      <Head>
        <title>Event Attendee</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <EventCard eventId={eventId} />

      {/* ADD ATTENDEE BUTTON */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h2>Event Invitee</h2>
        <button
          className="btn btn-secondary text-white font-weight-500"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#add-attendance"
        >
          Add Invitee
        </button>
      </div>
      {/* SEARCH / FILTER */}
      {/* <div className="search-event bg-white border-radius-10 p-30 pb-4 mt-4">
        <div className="d-flex justify-content-between flex-wrap align-items-start">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search Attendees"
            />
            <div className="input-group-append">
              <span className="input-group-text text-primary cursor-pointer">
                <i className="ri-search-line" />
              </span>
            </div>
          </div>
          <div className="d-flex flex-wrap flex-sm-nowrap">
            {/* BULK ACTION START 
            <div
              className="input-group me-0 me-sm-2"
              style={{ overflow: "visible" }}
            >
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="ri-calendar-line" />
                </span>
              </div>
              <div
                onClick={HandlerBulkAction}
                className={`wrapper-dropdown-4 ${
                  isActiveFilterBulkAction ? "active" : ""
                } form-select form-control form-control-sm`}
              >
                {bulkActionSelectedValue
                  ? bulkActionSelectedValue
                  : "Bulk Action"}
                <ul
                  className="dropdown ps-0 rounded-bottom"
                  style={{ width: "200px", marginLeft: "-58px" }}
                >
                  <li>
                    <input
                      type="radio"
                      id="ba-1"
                      onChange={(e) => {
                        bulkActionRadioHandler(e);
                      }}
                      defaultValue="Send Email"
                      name="bulkAction"
                      className="form-check-input"
                    />
                    <label htmlFor="ba-1">Send Email</label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="ba-2"
                      onChange={(e) => {
                        bulkActionRadioHandler(e);
                      }}
                      defaultValue="Send Message"
                      name="bulkAction"
                      className="form-check-input"
                    />
                    <label htmlFor="ba-2">Send Message</label>
                  </li>
                </ul>
              </div>
            </div>
            {/* BULK ACTION END */}
      {/* STATUS START 
            <div
              className="input-group me-0 me-sm-2"
              style={{ overflow: "visible" }}
            >
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="ri-filter-line" />
                </span>
              </div>
              <div
                onClick={HandlerStatus}
                className={`wrapper-dropdown-4 ${
                  isActiveFilter ? "active" : ""
                } form-select form-control form-control-sm`}
              >
                {statusSelectedValue ? statusSelectedValue : "Status"}
                <ul
                  className="dropdown ps-0 rounded-bottom"
                  style={{ width: "200px", marginLeft: "-58px" }}
                >
                  <li>
                    <input
                      type="radio"
                      id="st-1"
                      onChange={(e) => {
                        statusRadioHandler(e);
                      }}
                      name="status"
                      defaultValue="Yes"
                      className="form-check-input"
                    />
                    <label htmlFor="st-1">Yes</label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="st-2"
                      onChange={(e) => {
                        statusRadioHandler(e);
                      }}
                      name="status"
                      defaultValue="No"
                      className="form-check-input"
                    />
                    <label htmlFor="st-2">No</label>
                  </li>
                </ul>
              </div>
            </div>
            {/* STATUS END */}
      {/* ENTRY PER PAGE START 
            <div className="d-flex align-items-center justify-content-end">
              <label className="text-end me-2" style={{ width: "110px" }}>
                Entry Per Page
              </label>
            </div>
            <div
              className="input-group me-0 me-sm-2"
              style={{ overflow: "visible" }}
            >
              <div
                onClick={HandlerEntryPerPage}
                className={`wrapper-dropdown-4 ${
                  isActiveFilterEntryPerPage ? "active" : ""
                } form-select form-control form-control-sm`}
              >
                {entryPerPageSelectedValue ? entryPerPageSelectedValue : ""}
                <ul
                  className="dropdown ps-0 rounded-bottom"
                  style={{ width: "200px" }}
                >
                  <li>
                    <input
                      type="radio"
                      id="epp-1"
                      onChange={(e) => {
                        entryPerPageRadioHandler(e);
                      }}
                      name="entryPerPage"
                      defaultValue="25"
                      className="form-check-input"
                      hidden
                    />
                    <label htmlFor="epp-1">25</label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="epp-2"
                      onChange={(e) => {
                        entryPerPageRadioHandler(e);
                      }}
                      name="entryPerPage"
                      defaultValue="50"
                      className="form-check-input"
                      hidden
                    />
                    <label htmlFor="epp-2">50</label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="epp-3"
                      onChange={(e) => {
                        entryPerPageRadioHandler(e);
                      }}
                      name="entryPerPage"
                      defaultValue="100"
                      className="form-check-input"
                      hidden
                    />
                    <label htmlFor="epp-3">100</label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="epp-4"
                      onChange={(e) => {
                        entryPerPageRadioHandler(e);
                      }}
                      name="entryPerPage"
                      defaultValue="500"
                      className="form-check-input"
                      hidden
                    />
                    <label htmlFor="epp-4">500</label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="epp-5"
                      onChange={(e) => {
                        entryPerPageRadioHandler(e);
                      }}
                      name="entryPerPage"
                      defaultValue="1000"
                      className="form-check-input"
                      hidden
                    />
                    <label htmlFor="epp-5">1000</label>
                  </li>
                </ul>
              </div>
            </div>
            {/* ENTRY PER PAGE END 
          </div>
        </div>
      </div> */}
      {/* TABLE */}
      <div className="event-attendance mt-4">
        <div>
          <div className="event-attendance mt-4 text-dark">
            <table>
              <tbody>
                <tr className="text-gray-2">
                  <th>
                    <input
                      type="checkbox"
                      className="form-check-input all attendance-check"
                    />
                  </th>
                  <th className="px-3 py-4">Attendee Name</th>
                  <th>RSVP</th>
                  <th>Invite</th>
                  <th>Contact Info</th>
                  {/* <th className="text-center">Action</th> */}
                </tr>
                {!isLoading &&
                  inviteeListDisplay.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input attendance-check"
                          />
                        </td>
                        <td>
                          <div>
                            <img
                              src="/img/avata.png"
                              className="rounded-circle"
                            />
                            <span className="font-16">{item.name}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`rsvip-badge rounded-pill ${
                              item.isRSVP === "Yes"
                                ? "success"
                                : item.isRSVP === "Pending"
                                ? "warning"
                                : "danger"
                            }`}
                          >
                            {item.isRSVP}
                          </span>
                        </td>
                        <td>
                          {item.isRSVP !== "Yes" && (
                            <span
                              className="invite-badge rounded font-16"
                              data-bs-toggle="modal"
                              data-bs-target="#add-invite"
                              onClick={() => setSelectedInviteeData(item)}
                            >
                              Invite
                            </span>
                          )}
                        </td>
                        <td className="font-16">{item.email}</td>
                        {/* <td className="text-center">
                          <div className="dropdown">
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
                                <a className="dropdown-item" href="#">
                                  <span>View Event</span>
                                  <span className="icon">
                                    <i className="ri-check-line" />
                                  </span>
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  <span>Manage Event</span>
                                  <span className="icon">
                                    <i className="ri-check-line" />
                                  </span>
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  <span>Share Event</span>
                                  <span className="icon">
                                    <i className="ri-check-line" />
                                  </span>
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  <span>Event Attendees</span>
                                  <span className="icon">
                                    <i className="ri-check-line" />
                                  </span>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td> */}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {inviteeListDisplay && inviteeListDisplay.length > 0 && (
        <nav className="dashboard page mt-4">
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={""}
            pageRangeDisplayed={5}
            marginPagesDisplayed={0}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </nav>
      )}

      {/* Add attendee modal start */}
      <div
        className="modal fade"
        id="add-attendance"
        tabIndex={-1}
        aria-labelledby="add-attendance-label"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content border-radius-10">
            <div className="modal-body p-30">
              <div className="font-18 mb-4 font-weight-700">
                Add An Attendee For Your Event
              </div>
              {isAddInviteeError && (
                <p style={{ color: "red" }}>Invitee already exists!</p>
              )}

              {/* Add An Attendee For Your Event Form start */}
              <form key={1} onSubmit={handleSubmit(onSubmit)}>
                <div className="row mb-3 g-3">
                  <div className="col-sm-12">
                    <label htmlFor>Full Name*</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ri-user-line" />
                        </span>
                      </div>
                      <input
                        type="text"
                        {...register("inviteeName", {
                          // required: "This is required.",
                        })}
                        placeholder="Full Name"
                        className="form-control"
                      />
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="inviteeName"
                      render={({ messages }) =>
                        messages &&
                        Object.entries(messages).map(([type, message]) => (
                          <p key={type} style={{ color: "red" }}>
                            {message}
                          </p>
                        ))
                      }
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor className="font-14">
                    Email*
                  </label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="ri-mail-line" />
                      </span>
                    </div>
                    <input
                      type="text"
                      {...register("inviteeEmail", {
                        required: "This is required.",
                        pattern: {
                          value:
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: "Please enter a valid email",
                        },
                      })}
                      className="form-control"
                      placeholder="Enter Email ID"
                    />
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="inviteeEmail"
                    render={({ messages }) =>
                      messages &&
                      Object.entries(messages).map(([type, message]) => (
                        <p key={type} style={{ color: "red" }}>
                          {message}
                        </p>
                      ))
                    }
                  />
                </div>

                <button
                  type="button"
                  className="btn me-2 font-weight-500 btn-primary"
                  onClick={handleSubmit(onSubmit)}
                >
                  Add Invitee
                </button>
                <button
                  type="button"
                  className="btn font-weight-500 btn-outline-primary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </form>
              {/* Add An Attendee For Your Event Form end */}
            </div>
          </div>
        </div>
      </div>
      {/* Add attendee modal end */}

      {/* Add invite modal start */}
      <div
        className="modal fade"
        id="add-invite"
        tabIndex={-1}
        aria-labelledby="add-invite-label"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content border-radius-10">
            <div className="modal-body p-30">
              <div className="font-18 mb-4 font-weight-700">
                Add A Message With Your Invitation
              </div>

              {/* Add A Message Form start */}
              <form key={2} onSubmit={handleSubmit2(onSubmitInvitation)}>
                <div className="row mb-3 g-3">
                  <div className="mb-3">
                    <label htmlFor className="font-14">
                      Email*
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ri-mail-line" />
                        </span>
                      </div>
                      {selectedInviteeData.email && (
                        <input
                          readOnly
                          type="email"
                          {...register2("addInviteEmail", {
                            required: "This is required.",
                            pattern: {
                              value:
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                              message: "Please enter a valid email",
                            },
                          })}
                          className="form-control"
                          value={selectedInviteeData.email}
                        />
                      )}
                    </div>
                    <ErrorMessage
                      errors={errors2}
                      name="addInviteEmail"
                      render={({ messages }) =>
                        messages &&
                        Object.entries(messages).map(([type, message]) => (
                          <p key={type} style={{ color: "red" }}>
                            {message}
                          </p>
                        ))
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor>Subject*</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i class="ri-pencil-fill"></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        {...register2("addInviteSubject", {
                          required: "This is required.",
                        })}
                        className="form-control"
                      />
                    </div>
                    <ErrorMessage
                      errors={errors2}
                      name="addInviteSubject"
                      render={({ messages }) =>
                        messages &&
                        Object.entries(messages).map(([type, message]) => (
                          <p key={type} style={{ color: "red" }}>
                            {message}
                          </p>
                        ))
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor className="font-14">
                      Message
                    </label>
                    <div className="input-group">
                      {eventId && (
                        <textarea
                          className="form-control"
                          {...register2("addInviteMessage", {
                            required: "This is required.",
                          })}
                          // value={
                          //   eventId
                          //     ? `http://localhost:3000/event/` + `${eventId}`
                          //     : ""
                          // }
                        />
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn me-2 font-weight-500 btn-primary"
                  onClick={handleSubmit2(onSubmitInvitation)}
                >
                  Send Invitation
                </button>
                <button
                  type="button"
                  className="btn font-weight-500 btn-outline-primary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </form>
              {/* Add A Message Form end */}
            </div>
          </div>
        </div>
      </div>
      {/* Add invite modal end */}
    </EventDashboard>
  );
}
// eventattendees.layout = "Empty";
eventattendees.layout = "Event";
export default eventattendees;
