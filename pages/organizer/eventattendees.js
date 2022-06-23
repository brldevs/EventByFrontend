import Head from "next/head";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import EventItem from "../../components/Event/EventDashboard/SingalEventadmin/EventItem";

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
  useEffect(() => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap.bundle.js")
      : null;
  }, []);
  const [fileAttendee, setFilefileAttendee] = useState(null);
  const handleChange = (event) => {
    setFilefileAttendee(URL.createObjectURL(event.target.files[0]));
  };

  const [isInvite, setisInvite] = useState(false);
  const columns = [
    {
      name: "Attendee Name",
      selector: (row) => (
        <div>
          <img
            src="/img/organizer_1.png"
            className="rounded-circle p-1"
            alt=""
          />
          &nbsp;
          <span className="font-16">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "RSVP",
      selector: (row) =>
        row.rsvp ? (
          <span className="rsvip-badge rounded-pill success">Yes</span>
        ) : (
          <span className="rsvip-badge rounded-pill danger">No</span>
        ),
      sortable: true,
    },
    {
      name: "Invite",
      selector: "invite",
      sortable: true,
      button: true,
      cell: (row) =>
        !row.invite && (
          <div className="App">
            <div className="openbtn text-center">
              <span
                className="invite-badge rounded font-16"
                data-bs-toggle="modal"
                data-bs-target="#add-attendance"
                onClick={() => setisInvite(row.id)}
              >
                Invite
              </span>
            </div>
          </div>
        ),
    },
    {
      name: "Contact Info",
      selector: "email",
      sortable: true,
      right: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="dropdown">
          <i
            className="ri-more-2-fill"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          />
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li>
              <a className="dropdown-item" href="">
                <span>View Event</span>
                <span className="icon">
                  <i className="ri-check-line" />
                </span>
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="">
                <span>Manage Event</span>
                <span className="icon">
                  <i className="ri-check-line" />
                </span>
              </a>
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
              <a className="dropdown-item" href="">
                <span>Event Attendees</span>
                <span className="icon">
                  <i className="ri-check-line" />
                </span>
              </a>
            </li>
          </ul>
        </div>
      ),
      sortable: true,
      right: true,
    },
  ];

  const movi = [
    {
      id: 1,
      name: "Beetlejuice",
      img: "/img/organizer_1.png",
      rsvp: true,
      invite: true,
      email: "test@email.com",
    },
    {
      id: 2,
      name: "Beetlejuice",
      rsvp: true,
      invite: false,
      img: "/img/organizer_1.png",
      email: "test@email.com",
    },
    {
      id: 3,
      name: "Beetlejuice",
      rsvp: false,
      invite: true,
      img: "/img/organizer_1.png",
      email: "test@email.com",
    },
    {
      id: 4,
      name: "Beetlejuice",
      rsvp: true,
      invite: false,
      img: "/img/organizer_1.png",
      email: "test@email.com",
    },
  ];

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.js");
  }, []);

  return (
    <>
      <Head>
        <title>Event Attendee</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <EventItem />
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h2>Event Attendees</h2>
        <button
          className="btn btn-secondary text-white font-weight-500"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#add-attendance"
          onClick={() => setisInvite(false)}
        >
          Add Attendee
        </button>
      </div>
      <div className="search-event bg-white border-radius-10 p-30 pb-4 mt-4">
        <div className="d-flex justify-content-between flex-wrap align-items-start">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search Events"
            />
            <div className="input-group-append">
              <span className="input-group-text text-primary cursor-pointer">
                <i className="ri-search-line" />
              </span>
            </div>
          </div>
          <div className="d-flex flex-wrap flex-sm-nowrap">
            <div className="input-group me-0 me-sm-2">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="ri-filter-line" />
                </span>
              </div>
              <select className="form-control form-select">
                <option>Bulk Action</option>
                <option>Send Email</option>
                <option
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#send-message"
                >
                  Send Message
                </option>
              </select>
            </div>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="ri-calendar-line" />
                </span>
              </div>
              <input type="date" className="form-control ps-0" />
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <label
                htmlFor
                className="text-end me-2"
                style={{ width: "225px" }}
              >
                Entry Per Page
              </label>
              <select className="form-select form-control">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
                <option>500</option>
                <option>1000</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="event-attendance mt-4">
        <DataTable
          columns={columns}
          data={movi}
          defaultSortFieldID={1}
          pagination
          selectableRows
          selectableRowsComponent={BootyCheckbox}
        />
      </div>
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
              <form action method="post">
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
                        placeholder="Full Name"
                        className="form-control"
                      />
                    </div>
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
                      type="email"
                      className="form-control"
                      placeholder="Enter Email ID"
                    />
                  </div>
                </div>
                {isInvite && (
                  <div className="mb-3">
                    <label htmlFor className="font-14">
                      Message
                    </label>
                    <div className="input-group">
                      <textarea className="form-control" />
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className="btn me-2 font-weight-500 btn-primary"
                >
                  Add Attendee
                </button>
                <button
                  type="button"
                  className="btn font-weight-500 btn-outline-primary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
eventattendees.layout = "EventDashboard";
export default eventattendees;
