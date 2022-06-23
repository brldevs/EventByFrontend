import DateFnsUtils from "@date-io/date-fns";
import { ErrorMessage } from "@hookform/error-message";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { Col, Form } from "react-bootstrap";
import { Controller, useForm, useFormState } from "react-hook-form";
import CategoryItem from "../../../components/Event/Category/CategoryItem";
import FromAppendPrepend from "../../../components/utils/FromAppendPrepend";
import { useFormData } from "../../../context";
import {
  eventTicketCreate,
  getEventPreviewDataOPVById,
} from "../../../services/service";
import { getEventTicketApiData } from "../../../services/setUpData";
import FormProgress from "../../utils/FormProgress";

import moment from "moment";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BootstrapTimePicker from "../../BootstrapDateTimePicker/BootstrapTimePicker";

function EventTicketForm({
  currentStep,
  totalStep,
  nextFormStep,
  prevFormStep,
}) {
  const { setFormValues, data } = useFormData();

  const alert = useAlert();

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

  const [token, setToken] = useState(null);
  const [currentEventID, setCurrentEventID] = useState(null);
  useEffect(async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(token);

    const current_event_id =
      typeof window !== "undefined"
        ? localStorage.getItem("currentEventID")
        : null;
    setCurrentEventID(current_event_id);

    if (current_event_id) {
      const response = await getEventPreviewDataOPVById(current_event_id);

      console.log("RESPONSE: " + JSON.stringify(response));

      if (response.status === 200) {
        if (response.data.ticket) {
          if (response.data.ticket.ticket_type === "paid") {
            setIsPaidTicket(true);
            setIsFreeTicket(false);

            if (response.data.ticket.custom_ticket.length > 0) {
              const defaultCustomTicket = response.data.ticket.custom_ticket.map(
                (item) => {
                  return {
                    name: item.name,
                    price: item.price,
                    currency: item.currency,
                    totalTickets: item.totalTickets,
                    borderColor: getRandomClassNameForBorderColor(),
                  };
                }
              );
              console.log("defaultCustomTicket-------");
              console.log(defaultCustomTicket);
              setInputFields(defaultCustomTicket);
            }

            if (response.data.ticket.sale_start_date) {
              setSelectedStartDateTicketPaid(
                new Date(response.data.ticket.sale_start_date)
              );
              setSelectedStartTimeTicketPaid(
                new Date(response.data.ticket.sale_start_date)
              );
            }
            if (response.data.ticket.sale_end_date) {
              setSelectedEndDateTicketPaid(
                new Date(response.data.ticket.sale_end_date)
              );
              setSelectedEndTimeTicketPaid(
                new Date(response.data.ticket.sale_end_date)
              );
            }
          }
        } else {
          setIsPaidTicket(false);
          setIsFreeTicket(true);
        }
      }
    }
  }, []);

  const [isCustomTicketError, setIsCustomTicketError] = useState(false);
  const [customTicketErrorMsg, setCustomTicketErrorMsg] = useState(null);
  const [isDisableNextButton, setIsDisableNextButton] = useState(false);
  const [isDisableBackButton, setIsDisableBackButton] = useState(false);
  const onSubmit = async (d) => {
    // return nextFormStep(); //temporary blocked below code
    // setIsDisableNextButton(true);
    isTicketSellEndDateError();
    if (!endTimeValidationMsg) {
      if (
        isPaidTicket &&
        (!inputFields[0].name ||
          !inputFields[0].price ||
          !inputFields[0].currency)
      ) {
        setIsCustomTicketError(true);
      } else if (isTicketNameSame()) {
        setCustomTicketErrorMsg("Ticket name can not be same");
      } else {
        setIsCustomTicketError(false);
        setCustomTicketErrorMsg(null);
        data = {
          ...data,
          ...d,
          isFreeTicket,
          isPaidTicket,
          custom_ticket: inputFields,
        };
        console.table(data);
        setFormValues(data);

        if (currentEventID) {
          // EVENT TICKET START
          const ticketData = await getEventTicketApiData(data);

          const res = await eventTicketCreate(
            ticketData,
            token,
            currentEventID
          );
          // EVENT TICKET END

          if (res.status === 200) {
            alert.show("Data Updated Successfully", {
              type: "success",
            });
            nextFormStep();
          } else {
            alert.show(res.message, { type: "error" });
          }
        }
      }
    }
  };
  const [isFreeTicket, setIsFreeTicket] = useState(true);
  const [isPaidTicket, setIsPaidTicket] = useState(false);

  function singleEventHandler() {
    setIsFreeTicket(!isFreeTicket);
    setIsPaidTicket(!isPaidTicket);
  }

  const [
    selectedStartDateTicketPaid,
    setSelectedStartDateTicketPaid,
  ] = useState(new Date());
  const [
    selectedStartTimeTicketPaid,
    setSelectedStartTimeTicketPaid,
  ] = useState(new Date());
  const [selectedEndDateTicketPaid, setSelectedEndDateTicketPaid] = useState(
    new Date()
  );
  const [selectedEndTimeTicketPaid, setSelectedEndTimeTicketPaid] = useState(
    new Date()
  );
  const [
    selectedStartDateTicketFree,
    setSelectedStartDateTicketFree,
  ] = useState(new Date());
  const [
    selectedStartTimeTicketFree,
    setSelectedStartTimeTicketFree,
  ] = useState(new Date());

  const [selectedEndDateTicketFree, setSelectedEndDateTicketFree] = useState(
    new Date()
  );
  const [selectedEndTimeTicketFree, setSelectedEndTimeTicketFree] = useState(
    new Date()
  );

  //   dynamic start
  const [inputFields, setInputFields] = useState([
    {
      name: "",
      price: "",
      currency: "",
      totalTickets: 1,
      borderColor: "silver",
    },
  ]);

  const handleAddFields = () => {
    if (
      !inputFields[0].name ||
      !inputFields[0].price ||
      !inputFields[0].currency
    ) {
      setIsCustomTicketError(true);
    } else {
      if (isTicketNameSame()) {
        setCustomTicketErrorMsg("Ticket name can not be same");
      } else {
        const values = [...inputFields];
        values.push({
          name: "",
          price: "",
          currency: "",
          totalTickets: 1,
          borderColor: getRandomClassNameForBorderColor(),
        });
        setInputFields(values);
        setCustomTicketErrorMsg(null);
      }
      setIsCustomTicketError(false);
    }
  };

  const handleRemoveFields = (index) => {
    if (inputFields.length === 1) {
      return;
    }
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
    setCustomTicketErrorMsg(null);
  };

  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    if (event.target.name === "name") {
      values[index].name = event.target.value;
    }
    if (event.target.name === "price") {
      values[index].price = event.target.value;
    }
    if (event.target.name === "currency") {
      values[index].currency = event.target.value;
    }
    if (event.target.name === "totalTickets") {
      values[index].totalTickets = Number(event.target.value);
    }
    setInputFields(values);
    setIsCustomTicketError(false);
    setCustomTicketErrorMsg(null);
  };

  // dynamic end

  const isTicketNameSame = () => {
    let valueArr = inputFields.map(function (item) {
      return item.name;
    });
    let isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx;
    });
    return isDuplicate;
  };

  const getRandomClassNameForBorderColor = () => {
    const borderColor = ["silver", "gold", "platinum"];

    const random = Math.floor(Math.random() * borderColor.length);
    // console.log(random, borderColor[random]);
    return borderColor[random];
  };

  const incrementTotalTicket = (index) => {
    const values = [...inputFields];

    values[index].totalTickets = values[index].totalTickets + 1;
    setInputFields(values);
  };

  const decrementTotalTicket = (index) => {
    const values = [...inputFields];

    if (values[index].totalTickets > 1) {
      const values = [...inputFields];

      values[index].totalTickets = values[index].totalTickets - 1;
      setInputFields(values);
    }
  };

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

    $(".showtimer").on("click", function () {
      $(".timerdeopdown").addClass("d-none");
      $(this)
        .parent()
        .parent(".col")
        .children(".timerdeopdown")
        .removeClass("d-none");
      console.log(545);
      // $(".timerdeopdown").removeClass("d-none");
    });

    $(".timer-close").on("click", function () {
      $(this).parent(".timerdeopdown").addClass("d-none");
    });
  });

  const MyContainer = ({ className, children }) => {
    return (
      <div className="customcalender">
        <CalendarContainer className={className}>
          <div style={{ position: "relative" }}>{children}</div>
        </CalendarContainer>
      </div>
    );
  };

  const [isStartingDate, setStartingDate] = useState(false);
  const toggleClass = () => {
    setStartingDate(!isStartingDate);
  };

  const [isEndDate, setEndDate] = useState(false);
  const toggleClassendate = () => {
    setEndDate(!isEndDate);
  };

  const [endTimeValidationMsg, setEndTimeValidationMsg] = useState(null);
  const [
    selectedTicketSellCurrentTime,
    setSelectedTicketSellCurrentTime,
  ] = useState(null);

  const isTicketSellEndDateError = () => {
    const ticket_end_DATE = new Date(selectedEndDateTicketPaid);
    ticket_end_DATE.setHours(0, 0, 0, 0);
    const event_start_DATE = new Date(data.event_start_date);
    event_start_DATE.setHours(0, 0, 0, 0);
    console.log("Ticket End Date= " + ticket_end_DATE);
    console.log("Event Start Date= " + event_start_DATE);

    if (ticket_end_DATE.getTime() === event_start_DATE.getTime()) {
      console.log("hello");
      var currentTime = selectedTicketSellCurrentTime;
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
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} id="event-ticket-form">
        <div className="mw-770">
          <label>Choose Ticket Types For Your Event</label>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 mb-2">
            <CategoryItem
              id="1"
              name="Free"
              icon="ri-award-fill"
              status={isFreeTicket}
              click={singleEventHandler}
            />

            <CategoryItem
              id="2"
              name="Paid"
              icon="ri-vip-crown-2-line"
              status={isPaidTicket}
              click={singleEventHandler}
            />
          </div>

          {isPaidTicket && (
            <div>
              <label className="text-gray-1 mt-4">Create Custom Tickets</label>
              <div className="custom_ticket row g-4 row-cols-md-3">
                {inputFields.map((inputField, index) => (
                  <div className="col">
                    <div
                      className={`${inputField.borderColor} item border-radius-10 `}
                      key={`${inputField}~${index}`}
                    >
                      <div className="d-flex justify-content-between">
                        <input
                          type="text"
                          className="form-control title border-0 p-0 mb-3"
                          id="name"
                          name="name"
                          value={inputField.name}
                          onChange={(event) => handleInputChange(index, event)}
                          placeholder="Ticket Name"
                        />

                        <span style={{ marginLeft: "16px" }}>
                          <i className="ri-pencil-fill cursor-pointer" />
                          <i
                            className="ri-close-line cursor-pointer"
                            onClick={() => handleRemoveFields(index)}
                          />
                        </span>
                      </div>
                      <div className="row">
                        <div className="col-sm-9 ">
                          <label htmlFor>Price</label>
                          <input
                            className="form-control"
                            type="number"
                            name="price"
                            id="price"
                            defaultValue={inputField.price}
                            value={inputField.price}
                            onChange={(event) =>
                              handleInputChange(index, event)
                            }
                            min={1}
                            placeholder="99"
                          />
                        </div>
                        <div className="col-sm-3 pt-1 p-0 m-0">
                          <div className="d-flex flex-column justify-content-center align-items-center">
                            <i
                              className="ri-arrow-up-s-line text-gray-2 cursor-pointer"
                              onClick={() => incrementTotalTicket(index)}
                            />
                            <input
                              type="text"
                              name="totalTickets"
                              value={inputField.totalTickets}
                              onChange={(event) =>
                                handleInputChange(index, event)
                              }
                              style={{ padding: "9px 10px" }}
                              className="form-control text-center form-control-sm bg-primary text-white"
                            />
                            <i
                              className="ri-arrow-down-s-line text-gray-2 cursor-pointer"
                              onClick={() => decrementTotalTicket(index)}
                            />
                          </div>
                        </div>
                      </div>

                      <label htmlFor>Currency</label>
                      <select
                        className="form-control form-select"
                        name="currency"
                        id="currency"
                        defaultValue={inputField.currency}
                        value={inputField.currency}
                        onChange={(event) => handleInputChange(index, event)}
                      >
                        <option value="" disabled>
                          --Select--
                        </option>
                        <option value="$ USD">$ USD</option>
                        {/* <option value="€ EUR">€ EUR</option>
                        <option value="$ AUD">$ AUD</option>
                        <option value="৳ BDT">৳ BDT</option> */}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {isCustomTicketError && (
                <p style={{ color: "red" }}>This field is required!</p>
              )}
              {customTicketErrorMsg && (
                <p style={{ color: "red" }}>{customTicketErrorMsg}!</p>
              )}
              <button
                className="btn add-ticket mt-4 mb-5 py-4 text-dark"
                type="button"
                onClick={() => handleAddFields()}
              >
                Add New Ticket
              </button>
              <div className="row gx-2 row-cols-1 row-cols-sm-2 row-cols-xl-2 bg-gray-3 border-gray-3 border-radius-10 p-3 mx-470">
                {/* Starting Date* */}
                <div className="col">
                  <label htmlFor className="text-gray-2">
                    Starting Date*
                  </label>
                  <div
                    className={`input-group border-radius-bottom-0 calender-focus ${
                      isStartingDate ? "onfocus" : ""
                    }`}
                    style={{ overflow: "visible" }}
                    onClick={toggleClass}
                  >
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="ri-calendar-line" />
                      </span>
                    </div>

                    <Controller
                      name="start_date_ticket_paid"
                      control={control}
                      initialFocusedDate={null}
                      // defaultValue={data.start_date_ticket_paid || new Date()}
                      render={({ ref, ...rest }) => (
                        <DatePicker
                          dateFormat="dd/MM/yyyy"
                          selected={selectedStartDateTicketPaid}
                          maxDate={data.event_start_date}
                          onChange={(date) => {
                            setSelectedStartDateTicketPaid(date);
                            setStartingDate(!isStartingDate);
                            setValue("start_date_ticket_paid", new Date(date));
                          }}
                          calendarContainer={MyContainer}
                        />
                      )}
                    />
                  </div>
                </div>
                {/*  Starting Time* */}
                <Col className="position-relative">
                  <label htmlFor className="text-gray-2">
                    Starting Time*
                  </label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="ri-time-line" />
                      </span>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={selectedStartTimeTicketPaid.toLocaleString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }
                      )}
                      className="form-control ps-0 showtimer"
                    />
                  </div>
                  <BootstrapTimePicker
                    setSelectedTime={setSelectedStartTimeTicketPaid}
                  />
                </Col>

                {/* End Date* */}
                <div className="col">
                  <label htmlFor className="text-gray-2 pt-3">
                    End Date*
                  </label>
                  <div
                    className={`input-group border-radius-bottom-0 calender-focus ${
                      isEndDate ? "onfocus" : ""
                    }`}
                    style={{ overflow: "visible" }}
                    onClick={toggleClassendate}
                  >
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="ri-calendar-line" />
                      </span>
                    </div>
                    <Controller
                      name="end_date_ticket_paid"
                      control={control}
                      initialFocusedDate={null}
                      // defaultValue={data.end_date_ticket_paid || new Date()}
                      render={({ ref, ...rest }) => (
                        <DatePicker
                          dateFormat="dd/MM/yyyy"
                          selected={selectedEndDateTicketPaid}
                          minDate={selectedStartDateTicketPaid}
                          maxDate={data.event_start_date}
                          onChange={(date) => {
                            setSelectedEndDateTicketPaid(date);
                            setEndDate(!isEndDate);
                            setValue("end_date_ticket_paid", new Date(date));
                          }}
                          calendarContainer={MyContainer}
                        />
                      )}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="end_date_ticket_paid"
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
                {/* End Time* */}
                <Col className="position-relative">
                  <label htmlFor className="text-gray-2 pt-3">
                    End Time*
                  </label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="ri-time-line" />
                      </span>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={selectedEndTimeTicketPaid.toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                      className="form-control ps-0 showtimer"
                    />
                  </div>
                  <BootstrapTimePicker
                    setSelectedTime={setSelectedEndTimeTicketPaid}
                    setEndTimeValidationMsg={setEndTimeValidationMsg}
                    selectedEndDateTicketPaid={selectedEndDateTicketPaid}
                    setSelectedTicketSellCurrentTime={
                      setSelectedTicketSellCurrentTime
                    }
                  />
                </Col>
              </div>
              {endTimeValidationMsg && (
                <p style={{ color: "red" }}>{endTimeValidationMsg}!</p>
              )}
            </div>
          )}
        </div>

        <FormProgress
          isDisableNextButton={false}
          currentStep={currentStep}
          prevFormStep={prevFormStep}
          totalStep={totalStep}
          formId={"event-ticket-form"}
        />
      </form>
    </>
  );
}

export default EventTicketForm;
