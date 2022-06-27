import React, { useState } from "react";
import EventSponsorDetails from "./EventSponsorDetails";
import Popup from "../../utils/Modal";
import { Col } from "react-bootstrap";
const EventSponsorList = (props) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const PopSubmitHandler = (event) => {
    event.preventDefault();
  };
  const data = (
    <>
      <h4 className="font-18 mb-5">Add New Event Sponsor</h4>
      <form action method="post">
        <div className="row mb-3 g-3">
          <div className="col-sm-9">
            <label htmlFor>Full Name*</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="ri-briefcase-line" />
                </span>
              </div>
              <input
                type="text"
                className="form-control ps-0"
                placeholder="Enter Name"
              />
            </div>
          </div>
          <div className="col-sm-3">
            <label htmlFor>Logo</label>
            <input type="file" hidden id="logo" />
            <label htmlFor="logo" className="m-0 d-block">
              <img src="/img/upload_icon.png" width={100} className />
            </label>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor>Website Link</label>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="ri-link" />
              </span>
            </div>
            <input
              type="text"
              className="form-control ps-0"
              placeholder="Paste link here"
            />
          </div>
        </div>
        <button type="button" className="btn btn-primary me-2">
          Add
        </button>
        <button
          className="btn light-btn btn-outline-primary"
          data-bs-dismiss="modal"
          type="button"
        >
          Cancel
        </button>
      </form>
    </>
  );

  return (
    <div className="row row-cols-2 g-2 bg-white row-cols-sm-3 row-cols-lg-4 row-cols-xl-5">
      <Popup
        title="title name"
        show={show}
        handleClose={() => setShow(false)}
        submitAction={PopSubmitHandler}
        data={data}
      />

      {props.sponsor.map((sponsor) => (
        <EventSponsorDetails key={sponsor.id} img={sponsor.img} />
      ))}

      <Col>
        <div
          variant="primary"
          onClick={handleShow}
          className="sponsor border-radius-10 organizer add d-flex justify-content-center align-items-center p-20 position-relative"
          data-bs-toggle="modal"
          data-bs-target="#add_event_sponsor"
        >
          <div className="font-18 text-primary">Add New</div>
        </div>
      </Col>
    </div>
  );
};

export default EventSponsorList;
