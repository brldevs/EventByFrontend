import $ from "jquery";
import React, { useState, useEffect } from "react";
import { useFormData } from "../../../context";
import FormProgress from "../../utils/FormProgress";
import CategoryItem from "/components/Event/Category/CategoryItem";
import { useAlert } from "react-alert";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import DateFnsUtils from "@date-io/date-fns";
import { useRouter } from "next/router";
import FromAppendPrepend from "../../../components/utils/FromAppendPrepend";
import { getEventDraftScheduleData } from "../../../services/setUpData";
import {
  eventCreate,
  eventBannerUpload,
  eventTicketCreate,
  eventAddCoOrg,
  eventAddSpeaker,
  eventAddSponsor,
  eventMediaFilesUpload,
  eventDraftScheduleStatusUpdate,
} from "../../../services/service";

import moment from "moment";
import { Button, Col, Form } from "react-bootstrap";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BootstrapTimePicker from "../../BootstrapDateTimePicker/BootstrapTimePicker";

function PublishForm({ currentStep, totalStep, nextFormStep, prevFormStep }) {
  const router = useRouter();
  const { setFormValues, data, removeFormValues } = useFormData();

  const [isPublishNow, setIsPublishNow] = useState(true);
  const [isPublishLater, setIsPublishLater] = useState(false);

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

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(token);

    const current_event_id =
      typeof window !== "undefined"
        ? localStorage.getItem("currentEventID")
        : null;

    setCurrentEventID(current_event_id);
  }, []);
  const [isDisableNextButton, setIsDisableNextButton] = useState(false);
  const [isDisableBackButton, setIsDisableBackButton] = useState(false);
  const onSubmit = async (d) => {
    setIsDisableNextButton(true);
    data = {
      ...data,
      ...d,
      isPublishNow,
      isPublishLater,
      isDraftEvent,
      isPublishEvent,
      schedule_date: selectedScheduleDate,
      schedule_time: selectedScheduleTime,
    };

    console.table(data);

    setFormValues(data);

    if (currentEventID) {
      const bodyData = await getEventDraftScheduleData(data);
      const res = await eventDraftScheduleStatusUpdate(
        bodyData,
        token,
        currentEventID
      );
      if (res.status === 200) {
        setIsDisableNextButton(false);
        removeFormValues();
        localStorage.removeItem("currentEventID");
        alert.show(res.message);
        router.push(`/event/${currentEventID}`);
      } else {
        alert.show(res.message);
        setIsDisableNextButton(false);
      }
    }
  };

  const togglePublishHandler = () => {
    setIsPublishNow(!isPublishNow);
    setIsPublishLater(!isPublishLater);
  };

  const [selectedScheduleDate, setSelectedScheduleDate] = useState(new Date());
  const [selectedScheduleTime, setSelectedScheduleTime] = useState(new Date());

  const [isDraftEvent, setIsDraftEvent] = useState(false);
  const [isPublishEvent, setIsPublishEvent] = useState(true);

  const toggleDraftOrPublishEventHandler = () => {
    setIsDraftEvent(!isDraftEvent);
    setIsPublishEvent(!isPublishEvent);
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

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="publish-form"
        className="px-5"
      >
        <div className="mw-770">
          <label>When Do You Want To Publish?</label>
          <div className="row row-cols-1 row-cols-sm-2">
            <CategoryItem
              key="1"
              id="1"
              name="Publish Now"
              icon="ri-calendar-check-line"
              status={isPublishNow}
              click={togglePublishHandler}
            />

            <CategoryItem
              key="2"
              id="2"
              name="Publish Later"
              icon="ri-calendar-check-line"
              status={isPublishLater}
              click={togglePublishHandler}
            />
          </div>

          {isPublishLater && (
            <div className="row row-cols-1 row-cols-sm-2 mt-2 gx-3 gy-4">
              <div className="col">
                <label htmlFor>Schedule Date*</label>
                <div
                  className="input-group border-radius-bottom-0"
                  style={{ overflow: "visible" }}
                >
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="ri-calendar-line" />
                    </span>
                  </div>
                  <Controller
                    name="schedule_date"
                    control={control}
                    initialFocusedDate={null}
                    defaultValue={new Date()}
                    render={({ ref, ...rest }) => (
                      <DatePicker
                        dateFormat="dd/MM/yyyy"
                        selected={selectedScheduleDate}
                        minDate={new Date()}
                        onChange={(date) => {
                          setSelectedScheduleDate(date);
                          setValue("schedule_date", new Date(date));
                        }}
                        calendarContainer={MyContainer}
                      />
                    )}
                  />
                </div>
              </div>
              <Col className="position-relative">
                <label htmlFor>Schedule Time*</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="ri-time-line" />
                    </span>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={selectedScheduleTime.toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                    className="form-control ps-0 showtimer"
                  />
                </div>
                <BootstrapTimePicker
                  setSelectedTime={setSelectedScheduleTime}
                />
              </Col>
              <div className="col">
                {/* 
                change class
                 btn-outline-primary
                  TO 
                btn-primary
                 */}
                <Button className="btn btn-outline-primary  brn-lg me-2 w-100 ">
                  <i class="ri-eye-line pe-2"></i> Draft Event
                </Button>
                {/* <CategoryItem
                  key="3"
                  id="3"
                  name="Draft Event"
                  icon="ri-eye-line"
                  status={isDraftEvent}
                  click={toggleDraftOrPublishEventHandler}
                /> */}
              </div>
              <div className="col">
                {/* <CategoryItem
                  key="4"
                  id="4"
                  name="Publish Event"
                  icon="ri-eye-line"
                  status={isPublishEvent}
                  click={toggleDraftOrPublishEventHandler}
                /> */}
                <Button className="btn btn-secondary brn-lg me-2 w-100 text-white">
                  <i class="ri-eye-line pe-2"></i> Preview Event
                </Button>
              </div>
            </div>
          )}
        </div>

        <FormProgress
          isDisableNextButton={isDisableNextButton}
          currentStep={currentStep}
          prevFormStep={prevFormStep}
          totalStep={totalStep}
          formId={"publish-form"}
        />
      </form>
    </>
  );
}

export default PublishForm;
