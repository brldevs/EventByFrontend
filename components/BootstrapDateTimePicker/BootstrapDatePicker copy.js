import React from "react";

export default function BootstrapDatePicker() {
  return (
    <Row
      className="bgcolor position-absolute timerdeopdown d-flex justify-content-center d-none border w-100 rounded-bottom"
      style={{
        margin: "5px 0px",
      }}
    >
      <div className="col-sm-4 pt-2">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <i className="ri-arrow-up-s-line text-gray-2 cursor-pointer incement-hour" />
          <input
            type="text"
            min="1"
            style={{ padding: "9px 10px" }}
            className="form-control text-center form-control-sm"
            readOnly
          />
          <i className="ri-arrow-down-s-line text-gray-2 cursor-pointer decrement-hour" />
        </div>
      </div>
      <div className="col-sm-4 pt-2">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <i className="ri-arrow-up-s-line text-gray-2 cursor-pointer increment-minute" />
          <input
            type="text"
            min="1"
            style={{ padding: "9px 10px" }}
            className="form-control text-center form-control-sm"
            readOnly
          />
          <i className="ri-arrow-down-s-line text-gray-2 cursor-pointer decrement-minute" />
        </div>
      </div>
      <div className="col-sm-4 pt-2">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <i className="ri-arrow-up-s-line text-gray-2 cursor-pointer change-am" />
          <input
            type="text"
            min="1"
            style={{ padding: "9px 10px" }}
            className="form-control text-center form-control-sm"
            readOnly
          />
          <i className="ri-arrow-down-s-line text-gray-2 cursor-pointer change-am" />
        </div>
      </div>
      <button
        className="btn text-primary timer-close btn-close"
        type="button"
      ></button>
    </Row>
  );
}
