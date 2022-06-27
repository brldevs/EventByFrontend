import $ from "jquery";
import React, { useEffect, useState } from "react";

function CoOrganizer(props) {
  useEffect(() => {
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
  });
  return (
    <div className="modal-content">
      <h4 className="font-18 my-3">Add New Event Co-Organizer</h4>
      <form onSubmit={props.PopSubmitHandler} method="post">
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
              type="email"
              className="form-control"
              placeholder="Enter Email ID"
            />
          </div>
        </div>
        <button type="button" className="btn btn-primary me-2 px-4">
          Add
        </button>
        <button
          className="btn light-btn btn-outline-primary"
          onClick={() => setShow(false)}
        >
          Cancel
        </button>
      </form>
      <label htmlFor className="mt-4 font-18">
        Add Existing Co-Organizer
      </label>
      <div className="row row-cols-1 row-cols-sm-2 g-2">
        <div className="col">
          <div className="checkbox">
            <input type="checkbox" hidden id="organizer1" />
            <label htmlFor="organizer1" className="d-flex align-items-center">
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
            <input type="checkbox" hidden id="organizer2" />
            <label htmlFor="organizer2" className="d-flex align-items-center">
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
  );
}

export default CoOrganizer;
