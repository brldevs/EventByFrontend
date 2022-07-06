import Head from "next/head";
import BasicInfoForm from "../../../components/Event/EventForm/BasicInfoForm";
import EventDashboard from "../../../components/layout/EventDashboard";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import $ from "jquery";
import DateFnsUtils from "@date-io/date-fns";
import { ErrorMessage } from "@hookform/error-message";
import BootstrapTimePicker from "../../../components/BootstrapDateTimePicker/BootstrapTimePicker";
import { Col, Form, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import CategoryItem from "../../../components/Event/Category/CategoryItem";
import { useFormData } from "../../../context";
import FromAppendPrepend from "/components/utils/FromAppendPrepend";
import moment from "moment";
import {
  getEventPreviewDataOPVById,
  updateEventBasicInfo,
} from "../../../services/service";
import EventCard from "../../../components/Event/EventCard";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BootstrapTimePickerREvent from "../../../components/BootstrapDateTimePicker/BootstrapTimePickerREevent";
import { useAlert } from "react-alert";

function basicInformation() {
  const alert = useAlert();
  const { setFormValues, data } = useFormData();
  const router = useRouter();
  const [eventId, setEventId] = useState(null);
  const [currentEventData, setCurrentEventData] = useState({});
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
  const [isDisableNextButton, setIsDisableNextButton] = useState(false);
  const [isDisableBackButton, setIsDisableBackButton] = useState(false);
  const onSubmit = async (data) => {
    let start_date_and_start_time;
    let end_date_and_end_time;

    const event_start_date = isSingleEvent
      ? selectedStartDate
      : rSelectedStartDate;

    const event_end_date = isSingleEvent ? selectedEndDate : rSelectedEndDate;

    if (event_start_date) {
      // console.log("EVENT START TIME: ");
      // console.log(selectedStartTime);
      // console.log("UTC: ");
      // console.log(selectedStartTime.toUTCString());
      // console.log("AFTER SPLIT: ");
      // console.log(new Date(selectedStartTime).toISOString().split("T")[1]);
      start_date_and_start_time =
        new Date(event_start_date).toISOString().split("T")[0] +
        "T" +
        new Date(selectedStartTime).toISOString().split("T")[1];
    }
    if (event_end_date) {
      end_date_and_end_time =
        new Date(event_end_date).toISOString().split("T")[0] +
        "T" +
        new Date(selectedEndTime).toISOString().split("T")[1];
    }

    const updateEventInfoData = {
      event_id: eventId,
      name: defaultEventName,
      description: addASummary,
      start_date: start_date_and_start_time,
      end_date: end_date_and_end_time,
    };

    console.log("DATA: " + JSON.stringify(updateEventInfoData));

    const token = localStorage.getItem("token");

    const resp = await updateEventBasicInfo(updateEventInfoData, token);

    if (resp.status === 200) {
      alert.show("Data Updated Successfully", { type: "info" });
    } else {
      alert.show(resp.message, { type: "error" });
    }
  };

  const [isSingleEvent, setIsSingleEvent] = useState(true);
  const [isRecurringEvent, setIsRecurringEvent] = useState(false);

  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());

  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());

  const singleEventHandler = () => {
    setIsSingleEvent(!isSingleEvent);
    setIsRecurringEvent(!isRecurringEvent);
    setEventEndDateErrorMsg(null);
    setSelectedStartDate(new Date());
    setSelectedEndDate(new Date());
  };

  const [isEventStartTimeError, setIsEventStartTimeError] = useState(false);
  const [eventStartTimeErrorMsg, setEventStartTimeErrorMsg] = useState("");
  const checkEventStartTimeError = (date) => {
    console.log(typeof date, date);
    // const currentTime = new Date();
    // const eventStartTime = new Date(date);

    // // console.log(lessThanOneHourAgo(date));
    // if (currentTime > eventStartTime) {
    //   console.log("Error time...");
    //   setIsEventStartTimeError(true);
    //   setEventStartTimeErrorMsg("Can not select past time");
    // } else {
    //   setIsEventStartTimeError(false);
    //   setEventStartTimeErrorMsg("");
    // }
  };

  const lessThanOneHourAgo = (date) => {
    const HOUR = 1000 * 60 * 60;
    const anHourAgo = Date.now() - HOUR;

    return date < anHourAgo;
  };

  const [
    currentNumOfRecurrenceValue,
    setCurrentNumOfRecurrenceValue,
  ] = useState(1);

  const spinnerIncrementHandler = () => {
    if (currentNumOfRecurrenceValue < maximumValue) {
      setCurrentNumOfRecurrenceValue(currentNumOfRecurrenceValue + 1);
    }
  };

  const spinnerDecrementHandler = () => {
    if (currentNumOfRecurrenceValue > 1) {
      setCurrentNumOfRecurrenceValue(currentNumOfRecurrenceValue - 1);
    }
  };

  const [rSelectedStartDate, setRSelectedStartDate] = useState(new Date());
  // const [selectedStartTime, setSelectedStartTime] = useState(
  //   data.event_start_time || new Date()
  // );

  const [rSelectedEndDate, setRSelectedEndDate] = useState(new Date());
  // const [selectedEndTime, setSelectedEndTime] = useState(
  //   data.event_end_time || new Date()
  // );

  const [maximumValue, setMaximumValue] = useState(0);
  const calculateDifference = (startDate, endDate) => {
    // console.log(startDate, endDate);

    const difference = endDate.getTime() - startDate.getTime();

    const days = Math.ceil(difference / (1000 * 3600 * 24));
    // console.log(typeof days + " days");
    setMaximumValue(days);
  };

  const [dateDifference, setDateDifference] = useState(null);

  const calculateDifferenceBetweenStartDateAndEndDate = () => {
    var a = moment(
      moment(rSelectedStartDate).format("YYYY-MM-DD").split("-")
    ).startOf("day");
    var b = moment(
      moment(rSelectedEndDate).format("YYYY-MM-DD").split("-")
    ).startOf("day");
    var diffDays = b.diff(a, "days", true);
    console.log("rSelectedStartDate: " + rSelectedStartDate);
    console.log("rSelectedEndDate: " + rSelectedEndDate);
    console.log(diffDays);
    setDateDifference(diffDays);
  };

  const [repeatEveryValue, setRepeatEveryValue] = useState(null);
  const [isActive, setActive] = useState(false);

  const [isDayShow, setIsDayShow] = useState(false);
  const [isWeekShow, setIsWeekShow] = useState(false);
  const [isMonthShow, setIsMonthShow] = useState(false);
  const [isYearShow, setIsYearShow] = useState(false);

  // DYNAMIC WEEK CHECK SECTION START
  const [weekCheckBoxList, setWeekCheckBoxList] = useState([
    { label: "SU", isChecked: false },
    { label: "MO", isChecked: false },
    { label: "TU", isChecked: false },
    { label: "WE", isChecked: false },
    { label: "TH", isChecked: false },
    { label: "FR", isChecked: false },
    { label: "SA", isChecked: false },
  ]);

  const weekCheckBoxHandler = (e, index) => {
    const values = [...weekCheckBoxList];
    values[index].isChecked = !weekCheckBoxList[index].isChecked;
    // console.log(values);
    setWeekCheckBoxList(values);
  };

  // DYNAMIC WEEK CHECK SECTION END

  // DYNAMIC MONTH CHECK SECTION START
  const [monthCheckBoxList, setMonthCheckBoxList] = useState([
    [
      { label: "", isChecked: false },
      { label: "", isChecked: false },
      { label: "", isChecked: false },
      { label: "", isChecked: false },
      { label: " 1", isChecked: false },
      { label: " 2", isChecked: false },
      { label: "3", isChecked: false },
    ],

    [
      { label: "4", isChecked: false },
      { label: "5", isChecked: false },
      { label: "6", isChecked: false },
      { label: "7", isChecked: false },
      { label: "8", isChecked: false },
      { label: "9", isChecked: false },
      { label: "10", isChecked: false },
    ],

    [
      { label: "11", isChecked: false },
      { label: "12", isChecked: false },
      { label: "13", isChecked: false },
      { label: "14", isChecked: false },
      { label: "15", isChecked: false },
      { label: "16", isChecked: false },
      { label: "17", isChecked: false },
    ],
    [
      { label: "18", isChecked: false },
      { label: "19", isChecked: false },
      { label: "20", isChecked: false },
      { label: "21", isChecked: false },
      { label: "22", isChecked: false },
      { label: "23", isChecked: false },
      { label: "24", isChecked: false },
    ],
    [
      { label: "25", isChecked: false },
      { label: "26", isChecked: false },
      { label: "27", isChecked: false },
      { label: "28", isChecked: false },
      { label: "29", isChecked: false },
      { label: "30", isChecked: false },
      { label: "31", isChecked: false },
    ],
  ]);

  const monthCheckBoxHandler = (e, index1, index2) => {
    const values = [...monthCheckBoxList];

    values[index1][index2].isChecked = !monthCheckBoxList[index1][index2]
      .isChecked;
    // console.log(values);
    setMonthCheckBoxList(values);
  };

  // DYNAMIC MONTH CHECK SECTION END

  // DYNAMIC YEAR CHECK SECTION START
  const [yearCheckBoxList, setYearCheckBoxList] = useState([
    [
      { label: "JAN", isChecked: false },
      { label: "FEB", isChecked: false },
      { label: "MAR", isChecked: false },
      { label: "APR", isChecked: false },
      { label: "MAY", isChecked: false },
      { label: "JUN", isChecked: false },
    ],

    [
      { label: "JUL", isChecked: false },
      { label: "AUG", isChecked: false },
      { label: "SEP", isChecked: false },
      { label: "OCT", isChecked: false },
      { label: "NOV", isChecked: false },
      { label: "DEC", isChecked: false },
    ],

    [
      { label: "", isChecked: false },
      { label: "", isChecked: false },
      { label: "", isChecked: false },
      { label: " 1", isChecked: false },
      { label: " 2", isChecked: false },
      { label: " 3", isChecked: false },
    ],

    [
      { label: " 4", isChecked: false },
      { label: " 5", isChecked: false },
      { label: " 6", isChecked: false },
      { label: " 7", isChecked: false },
      { label: " 8", isChecked: false },
      { label: " 9", isChecked: false },
    ],

    [
      { label: "10", isChecked: false },
      { label: "11", isChecked: false },
      { label: "12", isChecked: false },
      { label: "13", isChecked: false },
      { label: "14", isChecked: false },
      { label: "15", isChecked: false },
    ],
    [
      { label: "16", isChecked: false },
      { label: "17", isChecked: false },
      { label: "18", isChecked: false },
      { label: "19", isChecked: false },
      { label: "20", isChecked: false },
      { label: "21", isChecked: false },
    ],
    [
      { label: "22", isChecked: false },
      { label: "23", isChecked: false },
      { label: "24", isChecked: false },
      { label: "25", isChecked: false },
      { label: "26", isChecked: false },
      { label: "27", isChecked: false },
    ],
    [
      { label: "28", isChecked: false },
      { label: "29", isChecked: false },
      { label: "30", isChecked: false },
      { label: "31", isChecked: false },
    ],
  ]);

  const yearCheckBoxHandler = (e, index1, index2) => {
    const values = [...yearCheckBoxList];

    values[index1][index2].isChecked = !yearCheckBoxList[index1][index2]
      .isChecked;
    console.log(values);

    setYearCheckBoxList(values);
  };

  // DYNAMIC YEAR CHECK SECTION END

  // DYNAMIC TIME INPUT FIELDS START
  const [inputFields, setInputFields] = useState([
    { startTime: new Date(), endTime: new Date() },
  ]);

  const [selectedREventEndTime, setSelectedREventEndTime] = useState(
    new Date()
  );
  const handleAddFields = () => {
    const values = [...inputFields];
    values.push({ startTime: new Date(), endTime: new Date() });
    setInputFields(values);
  };

  const handleRemoveFields = (index) => {
    if (index === 0) {
      return;
    }
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const handleInputChange = (index, event) => {
    console.log("calling handleInputChange() " + index, event.target.value);
    const values = [...inputFields];
    if (event.target.name === "startTime") {
      values[index].startTime = event.target.value;
    } else {
      values[index].endTime = event.target.value;
    }

    setInputFields(values);
  };
  const [isStartingDate, setStartingDate] = useState(false);
  const toggleClass = () => {
    setStartingDate(!isStartingDate);
  };

  const [isEndDate, setEndDate] = useState(false);
  const toggleClassendate = () => {
    setEndDate(!isEndDate);
  };

  const repeatEventDropDownHandler = () => {
    setActive(!isActive);
  };

  const [isReqSend, setIsReqSend] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(async () => {
    setIsLoading(true);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      router.replace("/");
    }

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
    console.log("calling useEffect ....." + router.query.id);
    if (id && isReqSend) {
      setEventId(id);
      const response = await getEventPreviewDataOPVById(id);
      setIsReqSend(false);
      if (response.status === 200) {
        setCurrentEventData(response.data);
        setSelectedStartDate(new Date(response.data.start_date));
        setSelectedStartTime(new Date(response.data.start_date));
        setSelectedEndDate(new Date(response.data.end_date));
        setSelectedEndTime(new Date(response.data.end_date));
        setAddASummary(response.data.description);
        setDefaultEventName(response.data.name);
        setIsLoading(false);
      }
    }
    setIsLoading(false);
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

  const [eventEndDateErrorMsg, setEventEndDateErrorMsg] = useState(null);

  const checkEventEndDateValidation = (selectedStartDate, selectedEndDate) => {
    if (new Date(selectedEndDate) < new Date(selectedStartDate)) {
      setEventEndDateErrorMsg(
        "Event end date must be greater than or equal to start date!"
      );
    } else {
      setEventEndDateErrorMsg(null);
    }
  };

  const [addASummary, setAddASummary] = useState(null);
  const [defaultEventName, setDefaultEventName] = useState(null);

  const [summaryErrorMessage, setSummaryErrorMessage] = useState(null);

  const isGreaterThanMaxValue = (v) => {
    const wordCount = countCharacters(v.toString());
    return wordCount <= 150
      ? setSummaryErrorMessage(null)
      : setSummaryErrorMessage("Maximum 150 character accepted!");
  };

  // dropdown code start
  const [isActiveFilter, setIsActiveFilter] = useState(false);
  const [dropDownSelectedOption, setDropDownSelectedOption] = useState(null);
  const dropDownHandler = () => {
    setIsActiveFilter(!isActiveFilter);
  };

  const radioHandler = (e, index) => {
    console.log("e.target.value: " + e.target.value + " index: " + index);
    setIsActiveFilter(false);
    setDropDownSelectedOption(e.target.value);

    switch (e.target.value) {
      case "Day":
        setIsDayShow(true);
        setIsWeekShow(false);
        setIsMonthShow(false);
        setIsYearShow(false);
        break;
      case "Week":
        setIsWeekShow(true);
        setIsDayShow(false);
        setIsMonthShow(false);
        setIsYearShow(false);
        break;
      case "Month":
        setIsMonthShow(true);
        setIsWeekShow(false);
        setIsDayShow(false);
        setIsYearShow(false);
        break;
      case "Year":
        setIsYearShow(true);
        setIsMonthShow(false);
        setIsWeekShow(false);
        setIsDayShow(false);
        break;
    }
  };
  // dropdown code end

  const countCharacters = (str) => {
    // str = str.replace(/(^\s*)|(\s*$)/gi, "");
    // str = str.replace(/[ ]{2,}/gi, " ");
    // str = str.replace(/\n /, "\n");
    // return str.split(" ").length;

    // use the \s quantifier to remove all white space
    let remText = str.replace(/\s/g, "");

    // get the length of the string after removal
    let length = remText.length;
    return length;
  };
  return (
    <>
      <EventDashboard eventId={id}>
        <EventCard eventId={id} />
        <div className="bg-white mt-4  border-radius-10">
          {!isLoading && (
            <form id="basic-info-form" className="basic-information">
              <div className="text-end px-50 py-50 pb-0">
                <button
                  type="submit"
                  className="btn mb-3 btn-secondary text-white"
                  onClick={handleSubmit(onSubmit)}
                >
                  Save Changes
                </button>
              </div>
              <div className="dashboard_event_container pb-5">
                <h2 className="text-center">
                  Update Event’s Basic Information
                </h2>
                <p className="text-gray-2 text-center mb-5">
                  Tell us a bit about your event and quickly get started
                </p>
                <>
                  {/* name */}
                  <Col md={12}>
                    <label htmlFor>Name Your Event*</label>
                    <div className="input-group">
                      <FromAppendPrepend icon="ri-calendar-event-line" />
                      <Form.Control
                        type="text"
                        name="nameOfYourEvent"
                        onChange={(e) => {
                          setDefaultEventName(e.target.value);
                        }}
                        defaultValue={defaultEventName}
                      />
                    </div>
                    {/* <ErrorMessage
                      errors={errors}
                      name="nameOfYourEvent"
                      render={({ messages }) =>
                        messages &&
                        Object.entries(messages).map(([type, message]) => (
                          <p key={type} style={{ color: "red" }}>
                            {message}
                          </p>
                        ))
                      }
                    /> */}
                  </Col>
                  {/* description */}
                  <Col mb={12} className="mt-3 mb-3">
                    <label>Add a summary</label>
                    <Form.Control
                      as="textarea"
                      className="form-control"
                      placeholder="Add a little detail and tell your guests what the event is about"
                      defaultValue={addASummary}
                      onChange={(e) => {
                        setAddASummary(e.target.value);
                        isGreaterThanMaxValue(e.target.value);
                      }}
                    />
                    {addASummary && (
                      <span className="text-secondary font-13">
                        Remaining{" "}
                        {150 - countCharacters(addASummary.toString()) < 0
                          ? 0
                          : 150 - countCharacters(addASummary.toString())}{" "}
                        Characters.
                      </span>
                    )}
                    {summaryErrorMessage && (
                      <p style={{ color: "red" }}>{summaryErrorMessage}</p>
                    )}
                  </Col>

                  <label>Set A Date &amp; Time</label>
                  {/* TEMPORARY HIDE BUTTON START */}
                  {/* <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3">
                    <CategoryItem
                      id="1"
                      name="Single Event"
                      icon="ri-calendar-event-line"
                      status={isSingleEvent}
                      click={singleEventHandler}
                    />
                    <CategoryItem
                      id="2"
                      name="Recurring Event"
                      icon="ri-calendar-todo-line"
                      status={isRecurringEvent}
                      click={singleEventHandler}
                    />
                  </div> */}
                  {/* TEMPORARY HIDE BUTTON END */}

                  {isSingleEvent && (
                    <div className="row gx-2 mt-4 row-cols-1 row-cols-sm-2 row-cols-xl-4">
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
                            name="event_start_date"
                            control={control}
                            initialFocusedDate={null}
                            defaultValue={data.event_start_date || new Date()}
                            render={({ ref, ...rest }) => (
                              <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={selectedStartDate}
                                minDate={new Date()}
                                onChange={(date) => {
                                  setSelectedStartDate(date);
                                  setStartingDate(!isStartingDate);
                                  setValue("event_start_date", new Date(date));
                                  checkEventEndDateValidation(
                                    date,
                                    selectedEndDate
                                  );
                                }}
                                calendarContainer={MyContainer}
                              />
                            )}
                          />
                        </div>
                      </div>
                      {/* Starting Time* */}
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
                            value={selectedStartTime.toLocaleString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}
                            className="form-control ps-0 showtimer"
                          />
                        </div>
                        <BootstrapTimePicker
                          setSelectedTime={setSelectedStartTime}
                        />
                      </Col>
                      {/* End Date* */}
                      <div className="col">
                        <label htmlFor className="text-gray-2">
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
                            name="event_end_date"
                            control={control}
                            initialFocusedDate={null}
                            defaultValue={data.event_end_date || new Date()}
                            render={({ ref, ...rest }) => (
                              <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={selectedEndDate}
                                minDate={new Date(selectedStartDate)}
                                onChange={(date) => {
                                  setSelectedEndDate(date);
                                  setEndDate(!isEndDate);
                                  setValue("event_end_date", new Date(date));
                                  checkEventEndDateValidation(
                                    selectedStartDate,
                                    date
                                  );
                                }}
                                calendarContainer={MyContainer}
                              />
                            )}
                          />
                        </div>
                        {eventEndDateErrorMsg && (
                          <p style={{ color: "red" }}>
                            * {eventEndDateErrorMsg}
                          </p>
                        )}
                      </div>

                      {/* End Time* */}
                      <Col className="position-relative">
                        <label htmlFor className="text-gray-2">
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
                            value={selectedEndTime.toLocaleString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}
                            className="form-control ps-0 showtimer"
                          />
                        </div>
                        <BootstrapTimePicker
                          setSelectedTime={setSelectedEndTime}
                        />
                      </Col>
                    </div>
                  )}

                  {isRecurringEvent && (
                    <>
                      <div className="col-md-8 col-sm-6 mw-470">
                        <div className="mt-3 col-sm-12">
                          <label className="my-3">Select Date Range</label>
                          <div className="border-gray-3 p-30 border-radius-10 bg-gray-3">
                            <div className="row row-cols-1 row-cols-md-2">
                              {/* Starting Date start */}
                              <div className="col">
                                <label>Starting Date*</label>
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
                                    name="rStartDate"
                                    control={control}
                                    initialFocusedDate={null}
                                    // defaultValue={data.rStartDate || new Date()}
                                    render={({ ref, ...rest }) => (
                                      <DatePicker
                                        dateFormat="dd/MM/yyyy"
                                        selected={rSelectedStartDate}
                                        minDate={new Date()}
                                        onChange={(date) => {
                                          setRSelectedStartDate(date);
                                          setStartingDate(!isStartingDate);
                                          setValue(
                                            "rStartDate",
                                            new Date(date)
                                          );
                                          calculateDifferenceBetweenStartDateAndEndDate();
                                          checkEventEndDateValidation(
                                            date,
                                            rSelectedEndDate
                                          );
                                        }}
                                        calendarContainer={MyContainer}
                                      />
                                    )}
                                  />
                                </div>
                              </div>

                              {/* Starting Date end */}

                              {/* End Date start */}
                              <div className="col">
                                <label>End Date*</label>
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
                                    name="rEndDate"
                                    control={control}
                                    initialFocusedDate={null}
                                    // defaultValue={data.rEndDate || new Date()}
                                    render={({ ref, ...rest }) => (
                                      <DatePicker
                                        dateFormat="dd/MM/yyyy"
                                        selected={rSelectedEndDate}
                                        minDate={new Date(rSelectedStartDate)}
                                        onChange={(date) => {
                                          setRSelectedEndDate(date);
                                          setEndDate(!isEndDate);
                                          setValue("rEndDate", new Date(date));
                                          calculateDifference(
                                            rSelectedStartDate,
                                            date
                                          );
                                          calculateDifferenceBetweenStartDateAndEndDate();
                                          checkEventEndDateValidation(
                                            rSelectedStartDate,
                                            date
                                          );
                                        }}
                                        calendarContainer={MyContainer}
                                      />
                                    )}
                                  />
                                </div>
                                {eventEndDateErrorMsg && (
                                  <p style={{ color: "red" }}>
                                    * {eventEndDateErrorMsg}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* End Date end */}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 col-sm-12 col-md-6 mw-470">
                        <label className="my-3">Repeat Event</label>
                        <div className="border-gray-3 p-30 py-2 border-radius-10 bg-gray-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <span>Repeat Every</span>
                            <div style={{ width: "40px" }} className="mx-2">
                              <div className="d-flex flex-column justify-content-center align-items-center">
                                <i
                                  className="ri-arrow-up-s-line text-gray-2 cursor-pointer"
                                  onClick={spinnerIncrementHandler}
                                />
                                <input
                                  readOnly
                                  type="text"
                                  min="1"
                                  value={currentNumOfRecurrenceValue}
                                  className="form-control bg-primary border-0 text-center text-white form-control-sm"
                                />
                                <i
                                  className="ri-arrow-down-s-line text-gray-2 cursor-pointer"
                                  onClick={spinnerDecrementHandler}
                                />
                              </div>
                            </div>
                            <div style={{ width: "50%" }}>
                              <div
                                onClick={dropDownHandler}
                                className={`wrapper-dropdown-4  ${
                                  isActiveFilter ? "active" : ""
                                } form-select form-control form-control-sm`}
                              >
                                {dropDownSelectedOption
                                  ? dropDownSelectedOption
                                  : "Select"}
                                <ul className="dropdown ps-0 rounded-bottom">
                                  <li>
                                    <input
                                      type="radio"
                                      id="el-1"
                                      onChange={(e) => {
                                        radioHandler(e);
                                      }}
                                      name="repeatEvery"
                                      defaultValue="Day"
                                      className="form-check-input"
                                    />
                                    <label htmlFor="el-1">Day</label>
                                  </li>
                                  <li>
                                    <input
                                      type="radio"
                                      id="el-2"
                                      onChange={(e) => {
                                        radioHandler(e);
                                      }}
                                      name="repeatEvery"
                                      defaultValue="Week"
                                      className="form-check-input"
                                    />
                                    <label htmlFor="el-2">Week</label>
                                  </li>
                                  <li>
                                    <input
                                      type="radio"
                                      id="el-3"
                                      onChange={(e) => {
                                        radioHandler(e);
                                      }}
                                      name="repeatEvery"
                                      defaultValue="Month"
                                      className="form-check-input"
                                    />
                                    <label htmlFor="el-3">Month</label>
                                  </li>
                                  <li>
                                    <input
                                      type="radio"
                                      id="el-4"
                                      onChange={(e) => {
                                        radioHandler(e);
                                      }}
                                      name="repeatEvery"
                                      defaultValue="Year"
                                      className="form-check-input"
                                    />
                                    <label
                                      className="rounded-5 rounded-bottom"
                                      htmlFor="el-4"
                                    >
                                      Year
                                    </label>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {isWeekShow && (
                        <>
                          <div className="mt-3 col-sm-12 col-md-6 mw-470">
                            <label className="my-3">Repeat On</label>
                            <div className="week-custom-canelder border-gray-3 p-30 py-3 border-radius-10 bg-gray-3">
                              <div className="repeat-on">
                                {weekCheckBoxList.map((item, index) => {
                                  return (
                                    <Form.Check
                                      key={index}
                                      className={
                                        item.isChecked ? "active" : null
                                      }
                                      inline
                                      label={item.label}
                                      value={item.label}
                                      name="week"
                                      type="checkbox"
                                      id={item.label}
                                      checked={item.isChecked}
                                      onChange={(e) =>
                                        weekCheckBoxHandler(e, index)
                                      }
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {isMonthShow && (
                        <>
                          <div className="border-gray-3 gray-3 mt-3 p-30 py-3 border-radius-10 mw-470">
                            <label>Monthly on day</label>
                            <div className="date-custom-canelder">
                              <Table responsive>
                                <tbody>
                                  {monthCheckBoxList.map((rows, index1) => {
                                    return (
                                      <tr key={index1}>
                                        {rows.map((item, index2) => {
                                          return (
                                            <td key={index2}>
                                              <Form.Check
                                                inline
                                                className={
                                                  item.isChecked
                                                    ? "active"
                                                    : null
                                                }
                                                label={item.label}
                                                value={item.label}
                                                name="month"
                                                type="checkbox"
                                                id={item.label}
                                                checked={item.isChecked}
                                                onChange={(e) =>
                                                  monthCheckBoxHandler(
                                                    e,
                                                    index1,
                                                    index2
                                                  )
                                                }
                                              />
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        </>
                      )}

                      {isYearShow && (
                        <div className="border-gray-3 mt-3 p-30 py-3 border-radius-10 mw-470">
                          <label>Yearly on day</label>
                          <div className="month-custom-canelder">
                            <Table responsive>
                              <tbody>
                                {yearCheckBoxList
                                  .slice(0, 2)
                                  .map((rows, index1) => {
                                    return (
                                      <tr key={index1}>
                                        {rows.map((item, index2) => {
                                          return (
                                            <td key={index2}>
                                              <Form.Check
                                                inline
                                                className={
                                                  item.isChecked
                                                    ? "active"
                                                    : null
                                                }
                                                label={item.label}
                                                value={item.label}
                                                name="year"
                                                type="checkbox"
                                                id={item.label}
                                                checked={item.isChecked}
                                                onChange={(e) =>
                                                  yearCheckBoxHandler(
                                                    e,
                                                    index1,
                                                    index2
                                                  )
                                                }
                                              />
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </Table>
                          </div>
                          <div className="date-custom-canelder">
                            <Table responsive>
                              <tbody>
                                {yearCheckBoxList
                                  .slice(2, yearCheckBoxList.length)
                                  .map((rows, index1) => {
                                    return (
                                      <tr key={index1}>
                                        {rows.map((item, index2) => {
                                          return (
                                            <td key={index2}>
                                              <Form.Check
                                                inline
                                                className={
                                                  item.isChecked
                                                    ? "active"
                                                    : null
                                                }
                                                label={item.label}
                                                value={item.label}
                                                name="year"
                                                type="checkbox"
                                                id={item.label}
                                                checked={item.isChecked}
                                                onChange={(e) =>
                                                  yearCheckBoxHandler(
                                                    e,
                                                    index1 + 2,
                                                    index2
                                                  )
                                                }
                                              />
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      )}

                      <div className="mt-3 mw-470">
                        <label className="my-3">Find A Time*</label>
                        <div className="bg-gray-3  col-sm-12 border-radius-10 p-3 pt-0">
                          {inputFields.map((item, index) => {
                            return (
                              <div
                                className="d-flex align-items-center"
                                key={index}
                              >
                                <div className="flex-1">
                                  <div className="row gx-2 row-cols-1 row-cols-md-2 mt-3">
                                    <Col className="position-relative">
                                      <label>Starting Time*</label>
                                      <div className="input-group">
                                        <div className="input-group-prepend">
                                          <span className="input-group-text">
                                            <i className="ri-time-line" />
                                          </span>
                                        </div>
                                        <input
                                          type="text"
                                          readOnly
                                          onChange={(event) =>
                                            handleInputChange(index, event)
                                          }
                                          value={item.startTime.toLocaleString(
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
                                      <BootstrapTimePickerREvent
                                        index={index}
                                        inputFields={inputFields}
                                        setInputFields={setInputFields}
                                        inputFiledName="startTime"
                                      />
                                    </Col>

                                    <Col className="position-relative">
                                      <label>End Time*</label>
                                      <div className="input-group">
                                        <div className="input-group-prepend">
                                          <span className="input-group-text">
                                            <i className="ri-time-line" />
                                          </span>
                                        </div>
                                        <input
                                          type="text"
                                          readOnly
                                          onChange={(event) =>
                                            handleInputChange(index, event)
                                          }
                                          value={item.endTime.toLocaleString(
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
                                      <BootstrapTimePickerREvent
                                        index={index}
                                        inputFields={inputFields}
                                        setInputFields={setInputFields}
                                        inputFiledName="endTime"
                                      />
                                    </Col>
                                  </div>
                                </div>
                                <i
                                  className="ri-delete-bin-line font-20 text-gray-2 ms-3 cursor-pointer mt-4"
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => handleRemoveFields(index)}
                                />
                                <i
                                  className="ri-add-circle-line font-20 text-gray-2 ms-3 cursor-pointer mt-4"
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => handleAddFields()}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="d-flex mt-4 align-items-center col-10">
                        <div className="flex-1 ">
                          <div className="bg-secondary border-radius-10 text-white  p-4 text-center">
                            <div
                              style={{ fontSize: "40px", lineHeight: "40px" }}
                              className="font-weight-700 me-3"
                            >
                              {inputFields.length}
                            </div>
                            <div
                              style={{
                                fontWeight: "500",
                                fontSize: "15px",
                                lineHeight: "20px",
                              }}
                            >
                              No. Of Event Occurs
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              </div>
            </form>
          )}
        </div>
      </EventDashboard>
    </>
  );
}
// basicInformation.layout = "Empty";
basicInformation.layout = "Event";
export default basicInformation;
