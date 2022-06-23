import DateFnsUtils from "@date-io/date-fns";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { Controller, useForm } from "react-hook-form";
import EventCard from "../../../components/Event/EventCard";
import EventDashboard from "../../../components/layout/EventDashboard";
import FromAppendPrepend from "../../../components/utils/FromAppendPrepend";
import { useFormData } from "../../../context";
import {
  eventDraftScheduleStatusUpdate,
  getEventPreviewDataOPVById,
} from "../../../services/service";
import { getEventDraftScheduleData } from "../../../services/setUpData";
import CategoryItem from "/components/Event/Category/CategoryItem";
import { Button, Col, Form } from "react-bootstrap";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BootstrapTimePicker from "../../../components/BootstrapDateTimePicker/BootstrapTimePicker";
import $ from "jquery";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
function publishevent() {
  const [eventId, setEventId] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  console.log("EventID : " + id);

  const { setFormValues, data } = useFormData();

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

  useEffect(async () => {
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

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(token);

    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap.bundle.js")
      : null;

    if (id) {
      setEventId(id);
    }
  }, [id]);

  const onSubmit = async (d) => {
    data = {
      ...data,
      ...d,
      isPublishNow,
      isPublishLater,
      isDraftEvent,
      isPublishEvent,
    };

    console.table(data);

    setFormValues(data);

    const event_id = eventId;
    if (event_id) {
      const bodyData = await getEventDraftScheduleData(data);
      const res = await eventDraftScheduleStatusUpdate(
        bodyData,
        token,
        event_id
      );
      if (res.status === 200) {
        alert.show(res.message);
        router.push(`/event/${event_id}`);
      } else {
        alert.show(res.message);
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
      <EventDashboard eventId={eventId}>
        <Head>
          <title>Publish Event</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <EventCard eventId={eventId} />
        <div className="bg-white mt-4  border-radius-10">
          <div className="text-end px-50 py-50 pb-0">
            <button className="btn btn-secondary text-white" onClick={onSubmit}>
              Save Changes
            </button>
          </div>

          <div className="dashboard_event_container pb-5">
            <h2 className="text-center">Update Your Event</h2>
            <p className="text-gray-2 text-center mb-5">
              Update your event and save your changes
            </p>
            <div className="pb-5">
              {/* UPDATE PUBLISH FORM COMPONENT START */}

              <>
                <form onSubmit={handleSubmit(onSubmit)} id="publish-form">
                  <label>When Do You Want To Update?</label>
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3">
                    <CategoryItem
                      key="1"
                      id="1"
                      name="Update Now"
                      icon="ri-calendar-check-line"
                      status={isPublishNow}
                      click={togglePublishHandler}
                    />

                    <CategoryItem
                      key="2"
                      id="2"
                      name="Update Later"
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
                            value={selectedScheduleTime.toLocaleString(
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
                          setSelectedTime={setSelectedScheduleTime}
                        />
                      </Col>
                      <div className="col">
                        <Button className="btn btn-primary brn-lg px-5 me-2 w-100">
                          <i class="ri-eye-line pe-2"></i> Preview Event
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
                        <Button className="btn btn-secondary brn-lg px-5 me-2 w-100 text-white">
                          <i class="ri-eye-line pe-2"></i> Preview Event
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </>
              {/* UPDATE PUBLISH FORM COMPONENT END */}
            </div>
          </div>
        </div>
      </EventDashboard>
    </>
  );
}
// publishevent.layout = "Empty";
publishevent.layout = "Event";
export default publishevent;
