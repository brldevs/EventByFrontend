import React, { useState } from "react";
import { Col } from "react-bootstrap";
import EventSpeakerDetails from "./EventSpeakerDetails";
import Popup from "../../utils/Modal";
const EventSpeakerList = (props) => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  const PopSubmitHandler = (event) => {
    event.preventDefault();
  };

  const data = (
    <div className="modal-dialog">
      <div className="modal-content">
        <h4 className="font-18 mb-5">Add New Event Speakers</h4>
        <form action method="post">
          <div className="mb-3">
            <label htmlFor>Full Name*</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="ri-user-line" />
                </span>
              </div>
              <input type="text" className="form-control" defaultValue="Mark" />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor>Email*</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="ri-mail-line" />
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Email ID"
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
        <label htmlFor className="mt-4 font-18">
          Add Existing Speakers
        </label>
        <div className="row row-cols-1 row-cols-sm-2 g-2">
          <div className="col">
            <div className="checkbox">
              <input type="checkbox" hidden id="speaker1" />
              <label htmlFor="speaker1" className="d-flex align-items-center">
                <img
                  src="/img/organizer_1.png"
                  className="rounden-circle"
                  height={60}
                  width={60}
                />
                <span>Sports &amp; Fitness</span>
                <span className="tik-icon d-none">
                  <i className="ri-check-line text-light" />
                </span>
              </label>
            </div>
          </div>
          <div className="col">
            <div className="checkbox">
              <input type="checkbox" hidden id="speaker2" />
              <label htmlFor="speaker2" className="d-flex align-items-center">
                <img
                  src="/img/organizer_2.png"
                  className="rounden-circle"
                  height={60}
                  width={60}
                />
                <span>Sports &amp; Fitness</span>
                <span className="tik-icon d-none">
                  <i className="ri-check-line text-light" />
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="row row-cols-1 row-cols-lg-2 g-3">
      <Popup
        title="title name"
        show={show}
        handleClose={() => setShow(false)}
        submitAction={PopSubmitHandler}
        data={data}
      />

      {props.speaker.map((Organizer) => (
        <EventSpeakerDetails
          key={Organizer.id}
          name={Organizer.name}
          email={Organizer.email}
          img={Organizer.img}
        />
      ))}
      <Col>
        <div
          variant="primary"
          onClick={handleShow}
          className="border-radius-10 organizer add d-flex justify-content-center align-items-center p-20 position-relative"
          data-bs-toggle="modal"
          data-bs-target="#add_event_speaker"
        >
          <div className="font-18 text-primary">
            <i className="ri-user-line" /> Add Speaker
          </div>
        </div>
      </Col>
    </div>
  );
};

export default EventSpeakerList;
