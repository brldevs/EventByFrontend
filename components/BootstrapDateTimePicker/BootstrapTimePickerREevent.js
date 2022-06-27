import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import moment from "moment";

export default function BootstrapTimePickerREvent({
  inputFields,
  index,
  setInputFields,
  inputFiledName,
}) {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(59);
  const [amPm, setAmPm] = useState("AM");

  const onChangeHourHandler = (e) => {
    if (/^\d*[1-9]\d*$/.test(e.target.value) && parseInt(e.target.value) >= 0) {
      setHour(e.target.value);
      // setInputFields(
      //   index,
      //   event,
      //   new Date(`1 Jan 1900 ${parseInt(e.target.value)}:${minute}:00 ${amPm}`)
      // );

      const values = [...inputFields];
      values[index][inputFiledName] = new Date(
        `1 Jan 1900 ${parseInt(e.target.value)}:${minute}:00 ${amPm}`
      );

      setInputFields(values);
    } else {
      setHour("");
    }
  };

  const onChangeMinuteHandler = (e) => {
    if (/^\d*[1-9]\d*$/.test(e.target.value) && parseInt(e.target.value) >= 0) {
      setMinute(e.target.value);
      // setSelectedTime(
      //   new Date(`1 Jan 1900 ${hour}:${parseInt(e.target.value)}:00 ${amPm}`)
      // );

      const values = [...inputFields];
      values[index][inputFiledName] = new Date(
        `1 Jan 1900 ${hour}:${parseInt(e.target.value)}:00 ${amPm}`
      );

      setInputFields(values);
    } else {
      setMinute("");
    }
  };

  const incrementHour = () => {
    if (parseInt(hour) >= 0 && parseInt(hour) < 12) {
      setHour(parseInt(hour) + 1);
      // setSelectedTime(
      //   new Date(`1 Jan 1900 ${parseInt(hour) + 1}:${minute}:00 ${amPm}`)
      // );

      const values = [...inputFields];
      values[index][inputFiledName] = new Date(
        `1 Jan 1900 ${parseInt(hour) + 1}:${minute}:00 ${amPm}`
      );

      setInputFields(values);
    } else {
      setHour(1);
    }
  };

  const decrementHour = () => {
    if (parseInt(hour) > 0 && parseInt(hour) <= 12) {
      setHour(parseInt(hour) - 1);
      // setSelectedTime(
      //   new Date(`1 Jan 1900 ${parseInt(hour) - 1}:${minute}:00 ${amPm}`)
      // );

      const values = [...inputFields];
      values[index][inputFiledName] = new Date(
        `1 Jan 1900 ${parseInt(hour) - 1}:${minute}:00 ${amPm}`
      );

      setInputFields(values);
    }
  };

  const incrementMinute = () => {
    if (parseInt(minute) >= 0 && parseInt(minute) < 60) {
      setMinute(parseInt(minute) + 1);
      // setSelectedTime(
      //   new Date(`1 Jan 1900 ${hour}:${parseInt(minute) + 1}:00 ${amPm}`)
      // );

      const values = [...inputFields];
      values[index][inputFiledName] = new Date(
        `1 Jan 1900 ${hour}:${parseInt(minute) + 1}:00 ${amPm}`
      );

      setInputFields(values);
    } else {
      setMinute(1);
    }
  };

  const decrementMinute = () => {
    if (parseInt(minute) > 0 && parseInt(minute) <= 60) {
      setMinute(parseInt(minute) - 1);
      // setSelectedTime(
      //   new Date(`1 Jan 1900 ${hour}:${parseInt(minute) - 1}:00 ${amPm}`)
      // );

      const values = [...inputFields];
      values[index][inputFiledName] = new Date(
        `1 Jan 1900 ${hour}:${parseInt(minute) - 1}:00 ${amPm}`
      );

      setInputFields(values);
    }
  };

  const incrementAmPm = () => {
    setAmPm(amPm == "AM" ? "PM" : "AM");
    // setSelectedTime(
    //   new Date(`1 Jan 1900 ${hour}:${minute}:00 ${amPm == "AM" ? "PM" : "AM"}`)
    // );

    const values = [...inputFields];
    values[index][inputFiledName] = new Date(
      `1 Jan 1900 ${hour}:${minute}:00 ${amPm == "AM" ? "PM" : "AM"}`
    );

    setInputFields(values);
  };

  const decrementAmPm = () => {
    setAmPm(amPm == "AM" ? "PM" : "AM");
    // setSelectedTime(
    //   new Date(`1 Jan 1900 ${hour}:${minute}:00 ${amPm == "AM" ? "PM" : "AM"}`)
    // );

    const values = [...inputFields];
    values[index][inputFiledName] = new Date(
      `1 Jan 1900 ${hour}:${minute}:00 ${amPm == "AM" ? "PM" : "AM"}`
    );

    setInputFields(values);
  };

  const closeTimeInputHandler = () => {
    const currentTime = new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    console.log("Current Time: " + currentTime);

    // 3:39 PM
    const lessThanOneHourAgo = (date) =>
      moment(date).isAfter(moment().subtract(1, "hours"));

    console.log(
      "lessThanOneHourAgo: " +
        lessThanOneHourAgo(new Date(`1 Jan 1900 ${hour}:${minute}:00 ${amPm}`))
    );

    // setSelectedTime(new Date(`1 Jan 1900 ${hour}:${minute}:00 ${amPm}`));

    const values = [...inputFields];
    values[index][inputFiledName] = new Date(
      `1 Jan 1900 ${hour}:${minute}:00 ${amPm}`
    );

    setInputFields(values);
  };
  return (
    <Row
      className="bgcolor position-absolute timerdeopdown d-flex justify-content-center d-none border w-100 rounded-bottom"
      style={{
        margin: "5px 0px",
        zIndex: "9",
      }}
    >
      <div className="col-sm-4 pt-2">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <i
            className="ri-arrow-up-s-line text-gray-2 cursor-pointer incement-hour"
            onClick={incrementHour}
          />
          <input
            name="hour"
            type="text"
            maxLength="2"
            style={{ padding: "10px 0px" }}
            className="form-control text-center form-control-sm bg-primary text-white"
            value={hour}
            onChange={onChangeHourHandler}
          />
          <i
            className="ri-arrow-down-s-line text-gray-2 cursor-pointer decrement-hour"
            onClick={decrementHour}
          />
          {parseInt(hour) > 12 && <p style={{ color: "red" }}>Hour Error!</p>}
        </div>
      </div>
      <div className="col-sm-4 pt-2">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <i
            className="ri-arrow-up-s-line text-gray-2 cursor-pointer increment-minute"
            onClick={incrementMinute}
          />
          <input
            name="minute"
            type="text"
            maxLength="2"
            style={{ padding: "10px 0px" }}
            className="form-control text-center form-control-sm bg-primary text-white"
            value={minute}
            onChange={onChangeMinuteHandler}
          />
          <i
            className="ri-arrow-down-s-line text-gray-2 cursor-pointer decrement-minute"
            onClick={decrementMinute}
          />
          {parseInt(minute) > 60 && (
            <p style={{ color: "red" }}>Minute Error!</p>
          )}
        </div>
      </div>
      <div className="col-sm-4 pt-2">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <i
            className="ri-arrow-up-s-line text-gray-2 cursor-pointer change-am"
            onClick={incrementAmPm}
          />
          <input
            name="amPm"
            type="text"
            value={amPm}
            style={{ padding: "10px 0px" }}
            className="form-control text-center form-control-sm bg-primary text-white"
            readOnly
          />
          <i
            className="ri-arrow-down-s-line text-gray-2 cursor-pointer change-am"
            onClick={decrementAmPm}
          />
        </div>
      </div>
      <button
        className="btn btn-sm text-dark text-primary timer-close btn-close"
        type="button"
        onClick={closeTimeInputHandler}
      ></button>
    </Row>
  );
}
