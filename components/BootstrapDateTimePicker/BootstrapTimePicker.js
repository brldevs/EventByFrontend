import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import moment from "moment";
import { useFormData } from "../../context";
export default function BootstrapTimePicker({
  setSelectedTime,
  setEndTimeValidationMsg = null,
  selectedEndDateTicketPaid = null,
  setSelectedTicketSellCurrentTime = null,
}) {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(59);
  const [amPm, setAmPm] = useState("AM");

  const { setFormValues, data } = useFormData();

  const onChangeHourHandler = (e) => {
    if (/^\d*[1-9]\d*$/.test(e.target.value) && parseInt(e.target.value) >= 0) {
      setHour(e.target.value);
      setSelectedTime(
        new Date(`1 Jan 1900 ${parseInt(e.target.value)}:${minute}:00 ${amPm}`)
      );
    } else {
      setHour("");
    }
  };

  const onChangeMinuteHandler = (e) => {
    if (/^\d*[0-9]\d*$/.test(e.target.value) && parseInt(e.target.value) >= 0) {
      setMinute(e.target.value);
      setSelectedTime(
        new Date(`1 Jan 1900 ${hour}:${parseInt(e.target.value)}:00 ${amPm}`)
      );
    } else {
      setMinute("");
    }
  };

  const incrementHour = () => {
    if (parseInt(hour) >= 0 && parseInt(hour) < 12) {
      setHour(parseInt(hour) + 1);
      setSelectedTime(
        new Date(`1 Jan 1900 ${parseInt(hour) + 1}:${minute}:00 ${amPm}`)
      );
    } else {
      setHour(1);
    }
  };

  const decrementHour = () => {
    console.log("HOUR: " + hour);
    if (parseInt(hour) > 0 && parseInt(hour) <= 12) {
      if (parseInt(hour) === 1) {
        setHour(parseInt(hour + 12) - 1);
        setSelectedTime(
          new Date(`1 Jan 1900 ${parseInt(hour + 12) - 1}:${minute}:00 ${amPm}`)
        );
      } else {
        setHour(parseInt(hour) - 1);
        setSelectedTime(
          new Date(`1 Jan 1900 ${parseInt(hour) - 1}:${minute}:00 ${amPm}`)
        );
      }
    }
  };

  const incrementMinute = () => {
    if (parseInt(minute) >= 0 && parseInt(minute) < 59) {
      if (parseInt(minute) === 59) {
        setMinute(0);
        setSelectedTime(new Date(`1 Jan 1900 ${hour}:${0}:00 ${amPm}`));
      }

      setMinute(parseInt(minute) + 1);
      setSelectedTime(
        new Date(`1 Jan 1900 ${hour}:${parseInt(minute) + 1}:00 ${amPm}`)
      );
    } else {
      setMinute(0);
      setSelectedTime(new Date(`1 Jan 1900 ${hour}:${0}:00 ${amPm}`));
    }
  };

  const decrementMinute = () => {
    if (parseInt(minute) > 0 && parseInt(minute) <= 60) {
      setMinute(parseInt(minute) - 1);
      setSelectedTime(
        new Date(`1 Jan 1900 ${hour}:${parseInt(minute) - 1}:00 ${amPm}`)
      );
    } else {
      if (parseInt(minute) <= 0) {
        setMinute(parseInt(minute + 60) - 1);
        setSelectedTime(
          new Date(`1 Jan 1900 ${hour}:${parseInt(minute + 60) - 1}:00 ${amPm}`)
        );
      }
    }
  };

  const incrementAmPm = () => {
    setAmPm(amPm == "AM" ? "PM" : "AM");
    setSelectedTime(
      new Date(`1 Jan 1900 ${hour}:${minute}:00 ${amPm == "AM" ? "PM" : "AM"}`)
    );
  };

  const decrementAmPm = () => {
    setAmPm(amPm == "AM" ? "PM" : "AM");
    setSelectedTime(
      new Date(`1 Jan 1900 ${hour}:${minute}:00 ${amPm == "AM" ? "PM" : "AM"}`)
    );
  };

  const closeTimeInputHandler = () => {
    if (setEndTimeValidationMsg) {
      const ticket_end_DATE = new Date(selectedEndDateTicketPaid);
      ticket_end_DATE.setHours(0, 0, 0, 0);
      const event_start_DATE = new Date(data.event_start_date);
      event_start_DATE.setHours(0, 0, 0, 0);
      console.log("Ticket End Date= " + ticket_end_DATE);
      console.log("Event Start Date= " + event_start_DATE);

      if (ticket_end_DATE.getTime() === event_start_DATE.getTime()) {
        console.log("hello");
        setSelectedTicketSellCurrentTime(`${hour}:${minute} ${amPm}`);
        var currentTime = `${hour}:${minute} ${amPm}`;
        var event_start_time = new Date(data.event_start_time).toLocaleString(
          "en-US",
          {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }
        );
        console.log("currentTime  " + currentTime);
        console.log("event_start_time  " + event_start_time);
        if (
          moment(currentTime, "hh:mm a") < moment(event_start_time, "hh:mm a")
        ) {
          setEndTimeValidationMsg(null);
        } else {
          setEndTimeValidationMsg(
            `Ticket must be sell before ${event_start_time}`
          );
        }
      }
    }
    setSelectedTime(new Date(`1 Jan 1900 ${hour}:${minute}:00 ${amPm}`));
    if (setSelectedTicketSellCurrentTime) {
    }
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
          {parseInt(minute) >= 60 && (
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
