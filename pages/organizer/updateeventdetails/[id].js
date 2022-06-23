import Head from "next/head";
import EventDetailsForm from "../../../components/Event/EventForm/EventDetailsForm";
import EventDashboard from "../../../components/layout/EventDashboard";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import $ from "jquery";
import { useForm, Controller } from "react-hook-form";
import { Form, Row, Col } from "react-bootstrap";
import { ErrorMessage } from "@hookform/error-message";
import FromAppendPrepend from "/components/utils/FromAppendPrepend";

import { useFormData } from "../../../context";
import { getEventCreateApiData } from "../../../services/setUpData";
import { eventCreate } from "../../../services/service";
import { useAlert } from "react-alert";
import CategoryItem from "../../../components/Event/Category/CategoryItem";
import {
  getEventPreviewDataOPVById,
  getSelectedCategories,
  updateEventBasicDetails,
} from "../../../services/service";
import OfflineForm from "../../../components/Event/UpdateEventForm/Offline";
import OnlineForm from "../../../components/Event/UpdateEventForm/Online";
import EventCard from "../../../components/Event/EventCard";

const GUEST = [
  { id: 1, label: "0-20", value: 20, isSelect: false },
  {
    id: 2,
    label: "21-50",
    value: 50,
    isSelect: false,
  },
  {
    id: 3,
    label: "51-100",
    value: 100,
    isSelect: false,
  },
  {
    id: 4,
    label: "101 & More",
    value: 100,
    isSelect: false,
  },
];

function updateeventdetails() {
  const [option, setoption] = useState({
    options: {
      theme: {
        mode: "light",
        palette: "palette4",
        monochrome: {
          enabled: true,
          color: "#EE4157",
          shadeTo: "light",
          shadeIntensity: 0.65,
        },
      },
      chart: {
        height: 280,
        type: "area",
        toolbar: false,
      },
      dataLabels: {
        enabled: true,
      },
      series: [
        {
          name: "Series 1",
          data: [10, 52, 38, 45, 19, 23, 50, 45, 19, 23, 50],
        },
      ],
      grid: {
        show: true,
        borderColor: "#D2D2D2",
        strokeDashArray: 4,
        position: "back",
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        position: "top",
        categories: [
          "MON",
          "TUE",
          "WED",
          "THU",
          "FRI",
          "SAT",
          "SUN",
          "THU",
          "FRI",
          "SAT",
          "SUN",
        ],
      },
    },
  });

  const [eventId, setEventId] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  console.log("EventID : " + id);

  const [currentEventData, setCurrentEventData] = useState({});

  const [selectedCategoryList, setSelectedCategoryList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(async () => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap.bundle.js")
      : null;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(token);

    if (!token) {
      router.replace("/");
    }

    if (id) {
      setIsLoading(true);
      setEventId(id);
      const response = await getEventPreviewDataOPVById(id);
      if (response.status === 200) {
        setCurrentEventData(response.data);
        setDropDownSelectedOption(response.data.planned_event_type);
        if (response.data.total_guest) {
          console.log("TOTAL GUEST: " + response.data.total_guest);

          setTotalGuest(response.data.total_guest);
          setIsGuestSelected(response.data.total_guest ? true : false);

          setGuest(
            guest.map((item) => {
              return {
                label: item.label,
                isSelect:
                  response.data.total_guest === item.label ? true : false,
              };
            })
          );
        }
        if (response.data.event_type === "physical") {
          setIsPhysicalEvent(true);
          setLocationData({
            location: response.data.event_type_details.location,
            event_address_line1:
              response.data.event_type_details.event_address_line1,
            event_address_line2:
              response.data.event_type_details.event_address_line2,
            event_country: response.data.event_type_details.event_country,
            event_city_town: response.data.event_type_details.event_city_town,
            event_state: response.data.event_type_details.event_state,
            event_postal_code:
              response.data.event_type_details.event_postal_code,
          });
        } else if (response.data.event_type === "online") {
          setIsOnlineEvent(true);
          setValue(
            "event_platform_link",
            response.data.event_type_details.event_platform_link
          );
          if (response.data.event_type_details.event_platform === "Zoom") {
            setIsZoom(true);
            setIsGoogleMeet(false);
            setIsOthers(false);
          } else if (
            response.data.event_type_details.event_platform === "Google Meet"
          ) {
            setIsZoom(false);
            setIsGoogleMeet(true);
            setIsOthers(false);
          } else {
            setIsZoom(false);
            setIsGoogleMeet(false);
            setIsOthers(true);
          }
        } else {
          setIsHybridEvent(true);

          setValue(
            "event_platform_link",
            response.data.event_type_details.event_platform_link
          );

          if (response.data.event_type_details.event_platform === "Zoom") {
            setIsZoom(true);
            setIsGoogleMeet(false);
            setIsOthers(false);
          } else if (
            response.data.event_type_details.event_platform === "Google Meet"
          ) {
            setIsZoom(false);
            setIsGoogleMeet(true);
            setIsOthers(false);
          } else {
            setIsZoom(false);
            setIsGoogleMeet(false);
            setIsOthers(true);
          }
        }
        setIsLoading(false);
      }
    }

    const resGetSelectedCategories = await getSelectedCategories(token);

    if (resGetSelectedCategories.status === 200) {
      setSelectedCategoryList(
        resGetSelectedCategories.data.map((item, index) => {
          return {
            categoryName: item,
            checkedIndex: null,
          };
        })
      );
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
  }, [id]);

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

  const [locationData, setLocationData] = useState(null);
  const [onlinePlatformLink, setOnlinePlatformLink] = useState(null);
  const [eventLat, setEventLat] = useState(null);
  const [eventLong, setEventLong] = useState(null);
  const [totalGuest, setTotalGuest] = useState(null);

  const onSubmit = async (d) => {
    const tempData = {
      ...locationData,
      isPhysicalEvent,
      isOnlineEvent,
      isHybridEvent,
      isGoogleMeet,
      isZoom,
      isOthers,
      typeOfEventPlaningToHost: dropDownSelectedOption,
      onlinePlatformLink: d.onlinePlatformLink,
    };
    // console.log("check1: " + JSON.stringify(tempData));
    let event_type;
    if (
      tempData.isPhysicalEvent &&
      !tempData.isOnlineEvent &&
      !tempData.isHybridEvent
    ) {
      event_type = "physical";
    }
    if (
      !tempData.isPhysicalEvent &&
      tempData.isOnlineEvent &&
      !tempData.isHybridEvent
    ) {
      event_type = "online";
    }
    if (
      !tempData.isPhysicalEvent &&
      !tempData.isOnlineEvent &&
      tempData.isHybridEvent
    ) {
      // console.log("check2");
      event_type = "hybrid";
    }

    let event_platform;
    if (tempData.isGoogleMeet && !tempData.isZoom && !tempData.isOthers) {
      event_platform = "Google Meet";
    }
    if (!tempData.isGoogleMeet && tempData.isZoom && !tempData.isOthers) {
      event_platform = "Zoom";
    }
    if (!tempData.isGoogleMeet && !tempData.isZoom && tempData.isOthers) {
      event_platform = "Others";
    }

    if (event_type === "physical") {
      const physicalEventInfo = {
        event_id: eventId,
        event_type: event_type,
        planned_event_type: tempData.typeOfEventPlaningToHost,
        location: tempData.location,
        event_address_line1: tempData.event_address_line1,
        event_address_line2: tempData.event_address_line2,
        event_country: tempData.event_country,
        event_city_town: tempData.event_city_town,
        event_state: tempData.event_state,
        event_postal_code: tempData.event_postal_code,
        event_lat: eventLat,
        event_long: eventLong,
        total_guest: totalGuest,
      };
      // console.log("DATA: " + JSON.stringify(physicalEventInfo));
      const resp = await updateEventBasicDetails(physicalEventInfo, token);
      if (resp.status === 200) {
        alert.show("Data Updated Successfully", { type: "info" });
      } else {
        alert.show(resp.message, { type: "error" });
      }
    } else if (event_type === "online") {
      const onlineEventInfo = {
        event_id: eventId,
        event_type: event_type,
        planned_event_type: tempData.typeOfEventPlaningToHost,
        event_platform: event_platform,
        event_platform_link: tempData.onlinePlatformLink,
      };
      // console.log("DATA: " + JSON.stringify(onlineEventInfo));
      const resp = await updateEventBasicDetails(onlineEventInfo, token);
      if (resp.status === 200) {
        alert.show("Data Updated Successfully", { type: "info" });
      } else {
        alert.show(resp.message, { type: "error" });
      }
    } else {
      const hybridEventInfo = {
        event_id: eventId,
        event_type: event_type,
        planned_event_type: tempData.typeOfEventPlaningToHost,
        location: tempData.location,
        event_address_line1: tempData.event_address_line1,
        event_address_line2: tempData.event_address_line2,
        event_country: tempData.event_country,
        event_city_town: tempData.event_city_town,
        event_state: tempData.event_state,
        event_postal_code: tempData.event_postal_code,
        event_platform: event_platform,
        event_platform_link: tempData.onlinePlatformLink,
        event_lat: eventLat,
        event_long: eventLong,
        total_guest: totalGuest,
      };
      // console.log("DATA: " + JSON.stringify(hybridEventInfo));
      const resp = await updateEventBasicDetails(hybridEventInfo, token);
      if (resp.status === 200) {
        alert.show("Data Updated Successfully", { type: "info" });
      } else {
        alert.show(resp.message, { type: "error" });
      }
    }
    // const updateEventData = {
    //   event_id: eventId,
    //   event_type: "physical",
    //   location: "Gulshan, Dhaka",
    //   event_address_line1: "Gulshan1, Citylink",
    //   event_address_line2: "Gulshan1, Citylink",
    //   event_country: "Bangladesh",
    //   event_city_town: "Dhaka",
    //   event_state: "Dhaka",
    //   event_postal_code: "2545",
    //   planned_event_type: "Health & Well being",
    // };

    // const resp = await updateEventBasicDetails();
    // return nextFormStep(); //temporary block below code
    // if (!dropDownSelectedOption) {
    //   setIsTypeOfEventPlaningToHostError(true);
    // } else {
    //   if (!isSelect) {
    //     setIsGuestLimitError(true);
    //   } else {
    //     setIsGuestLimitError(false);
    //     if (!isPhysicalEvent && !isOnlineEvent && !isHybridEvent) {
    //       setIsHostEventError(true);
    //     } else {
    //       setIsHostEventError(false);
    //       if (!data.location && (isPhysicalEvent || isHybridEvent)) {
    //         setIsLocationError(true);
    //       } else {
    //         setIsLocationError(false);
    //         if (
    //           !isGoogleMeet &&
    //           !isZoom &&
    //           !isOthers &&
    //           (isOnlineEvent || isHybridEvent)
    //         ) {
    //           setIsOnlinePlatformError(true);
    //         } else {
    //           setIsOnlinePlatformError(false);
    //           data = {
    //             ...locationData,
    //             ...data,
    //             ...d,
    //             isPhysicalEvent,
    //             isOnlineEvent,
    //             isHybridEvent,
    //             isGoogleMeet,
    //             isZoom,
    //             isOthers,
    //             typeOfEventPlaningToHost: dropDownSelectedOption,
    //           };

    //           console.table(data);

    //           setFormValues(data);

    //           // EVENT CREATE START
    //           const bodyData = await getEventCreateApiData(data);
    //           const res = await eventCreate(bodyData, token);
    //           console.log(JSON.stringify(res, null, 2));
    //           // EVENT CREATE END
    //           if (res.status === 200) {
    //             alert.show("Data Save Successfully");
    //             const event_id = res.data._id;
    //             data = {
    //               ...data,
    //               event_id,
    //             };

    //             console.table(data);

    //             setFormValues(data);
    //             nextFormStep();
    //           } else {
    //             alert.show(res.message);
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  };

  const [guest, setGuest] = useState(GUEST);
  const [isGuestSelected, setIsGuestSelected] = useState(false);
  const [isSelect, setIsSelect] = useState(0);
  const [isPhysicalEvent, setIsPhysicalEvent] = useState(false);
  const [isOnlineEvent, setIsOnlineEvent] = useState(false);
  const [isHybridEvent, setIsHybridEvent] = useState(false);
  const [isHostEventError, setIsHostEventError] = useState(false);
  const [isGuestLimitError, setIsGuestLimitError] = useState(false);
  const [isLocationError, setIsLocationError] = useState(false);
  const [
    isTypeOfEventPlaningToHostError,
    setIsTypeOfEventPlaningToHostError,
  ] = useState(false);

  const [isGoogleMeet, setIsGoogleMeet] = useState(false);
  const [isZoom, setIsZoom] = useState(false);
  const [isOthers, setIsOthers] = useState(false);
  const [isOnlinePlatformError, setIsOnlinePlatformError] = useState(false);

  const onlinePlatFormProps = {
    isGoogleMeet,
    isZoom,
    isOthers,
    isOnlinePlatformError,
    setIsGoogleMeet,
    setIsZoom,
    setIsOthers,
    setIsOnlinePlatformError,
  };
  function addNumberGuests(label) {
    setIsGuestLimitError(false);
    setTotalGuest(label);
    setIsGuestSelected(label ? true : false);

    setGuest(
      guest.map((item) => {
        return {
          label: item.label,
          isSelect: label === item.label ? true : false,
        };
      })
    );
  }

  function singleEventHandler(id) {
    setCurrentEventData({});
    setValue("event_platform_link", "");
    setIsPhysicalEvent(false);
    setIsOnlineEvent(false);
    setIsHybridEvent(false);

    if (id == 1) setIsPhysicalEvent(!isPhysicalEvent);
    if (id == 2) setIsOnlineEvent(!isOnlineEvent);
    if (id == 3) setIsHybridEvent(!isHybridEvent);
    setIsHostEventError(false);
  }

  function platformHandler(id) {
    setIsGoogleMeet(false);
    setIsZoom(false);
    setIsOthers(false);

    if (id === "1") setIsGoogleMeet(!isGoogleMeet);
    if (id === "2") setIsZoom(!isZoom);
    if (id === "3") setIsOthers(!isOthers);
    setIsOnlinePlatformError(false);
  }

  // dropdown code start
  const [isActiveFilter, setIsActiveFilter] = useState(false);
  const [dropDownSelectedOption, setDropDownSelectedOption] = useState(null);
  const dropDownHandler = () => {
    setIsActiveFilter(!isActiveFilter);
  };

  const radioHandler = (e, index) => {
    // console.log("e.target.value: " + e.target.value + " index: " + index);
    setIsTypeOfEventPlaningToHostError(false);
    setIsActiveFilter(false);
    setDropDownSelectedOption(e.target.value);

    const tempData = [...selectedCategoryList];
    tempData[index].categoryName = e.target.value;
    tempData[index].checkedIndex = index;
    setSelectedCategoryList(tempData);
  };
  // dropdown code end
  return (
    <EventDashboard eventId={eventId}>
      <>
        <Head>
          <title>Update Event Details</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <EventCard eventId={eventId} />
        <div className="bg-white mt-4  border-radius-10">
          <form id="event-details-form">
            <div className="text-end px-50 py-50 pb-0">
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                className="btn btn-secondary text-white mb-3"
              >
                Save Changes
              </button>
            </div>

            <div className="dashboard_event_container pb-5">
              <h2 className="text-center">Update Event Details</h2>
              <p className="text-gray-2 text-center mb-5">
                Tell us a bit about your event and quickly get started
              </p>
              <div className="pb-5">
                {/* What Type Of Event Are You Planning To Host? */}
                <div className="mb-4">
                  <label>What Type Of Event Are You Planning To Host?</label>
                  <div
                    onClick={dropDownHandler}
                    className={`${
                      isActiveFilter ? "active" : ""
                    } input-group me-0 me-sm-2`}
                    style={{ overflow: "visible" }}
                  >
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="ri-bookmark-2-line" />
                      </span>
                    </div>
                    <div
                      onClick={dropDownHandler}
                      className={`wrapper-dropdown-4  ${
                        isActiveFilter ? "active" : ""
                      } form-select form-control form-control-sm what-typeof-event`}
                    >
                      {dropDownSelectedOption
                        ? dropDownSelectedOption
                        : "Select"}
                      <ul
                        className="dropdown ps-0 rounded-bottom"
                        style={{ width: "100%" }}
                      >
                        {selectedCategoryList.length > 0 &&
                          selectedCategoryList.map((item, index) => {
                            return (
                              <li key={index}>
                                <input
                                  type="radio"
                                  id={`typeOfEventPlaningToHost-${index}`}
                                  onChange={(e) => {
                                    radioHandler(e, index);
                                  }}
                                  name="typeOfEventPlaningToHost"
                                  value={item.categoryName}
                                  // checked={item.checkedIndex === index}
                                  className="form-check-input"
                                />
                                <label
                                  htmlFor={`typeOfEventPlaningToHost-${index}`}
                                >
                                  {item.categoryName}
                                </label>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </div>
                  {isTypeOfEventPlaningToHostError && (
                    <p style={{ color: "red" }}>This is required.</p>
                  )}
                </div>
                <label>Where Do You Want To Host Your Event?</label>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 mb-4">
                  <CategoryItem
                    id="1"
                    name="Choose A Venue"
                    icon="ri-building-2-line"
                    status={isPhysicalEvent}
                    click={singleEventHandler}
                  />
                  <CategoryItem
                    id="2"
                    name="Online Event"
                    icon="ri-base-station-line"
                    status={isOnlineEvent}
                    click={singleEventHandler}
                  />
                  <CategoryItem
                    id="3"
                    name="Hybrid Event"
                    icon="ri-rocket-line"
                    status={isHybridEvent}
                    click={singleEventHandler}
                  />
                </div>
                {isHostEventError && (
                  <p style={{ color: "red" }}>This is required.</p>
                )}
                {(isPhysicalEvent || isHybridEvent) && (
                  <>
                    {isHybridEvent && (
                      <h5 class="my-3  text-dark">Offline Details</h5>
                    )}
                    {!isLoading ? (
                      <OfflineForm
                        platformHandler={platformHandler}
                        register={register}
                        setFormValues={setFormValues}
                        data={data}
                        currentEventData={currentEventData || null}
                        errors={errors}
                        setIsLocationError={setIsLocationError}
                        isLocationError={isLocationError}
                        setLocationData={setLocationData}
                        eventLat={eventLat}
                        eventLong={eventLong}
                        setEventLat={setEventLat}
                        setEventLong={setEventLong}
                      />
                    ) : (
                      <OfflineForm
                        platformHandler={platformHandler}
                        register={register}
                        setFormValues={setFormValues}
                        data={data}
                        currentEventData={currentEventData || null}
                        errors={errors}
                        setIsLocationError={setIsLocationError}
                        isLocationError={isLocationError}
                        setLocationData={setLocationData}
                      />
                    )}
                  </>
                )}
                {(isOnlineEvent || isHybridEvent) && (
                  <>
                    {isHybridEvent && (
                      <h5 class="my-3 text-dark">Online Details</h5>
                    )}

                    {!isLoading ? (
                      <OnlineForm
                        platformHandler={platformHandler}
                        register={register}
                        setFormValues={setFormValues}
                        data={data}
                        currentEventData={currentEventData || null}
                        errors={errors}
                        onlinePlatFormProps={onlinePlatFormProps}
                        isOnlinePlatformError={isOnlinePlatformError}
                        setOnlinePlatformLink={setOnlinePlatformLink}
                      />
                    ) : (
                      <OnlineForm
                        platformHandler={platformHandler}
                        register={register}
                        setFormValues={setFormValues}
                        data={data}
                        currentEventData={currentEventData || null}
                        errors={errors}
                        onlinePlatFormProps={onlinePlatFormProps}
                        isOnlinePlatformError={isOnlinePlatformError}
                        setOnlinePlatformLink={setOnlinePlatformLink}
                      />
                    )}
                  </>
                )}

                {/* How Many Guests Do You Want To Invite? */}
                <div>
                  <label htmlFor className="text-gray-1 mt-3">
                    How Many Guests Do You Want To Invite?
                  </label>
                  <div className="row row-cols-2 row-cols-lg-4 g-5 ">
                    {guest.map((guest, index) => (
                      <Col key={index}>
                        <div className="checkbox">
                          <input
                            type="radio"
                            name="numberOfInvitedGuest"
                            hidden
                            id={`${guest.label}`}
                            value={guest.label}
                          />
                          <label
                            htmlFor={`${guest.label}`}
                            className={`d-flex align-items-center ${
                              guest.isSelect && "bg-primary text-white"
                            }`}
                            onClick={() => addNumberGuests(guest.label)}
                          >
                            <span className="mx-auto">{guest.label}</span>
                            <span
                              className={`tik-icon ${
                                !guest.isSelect && "d-none"
                              }`}
                            >
                              <i className="ri-check-line" />
                            </span>
                          </label>
                        </div>
                      </Col>
                    ))}
                    {isGuestLimitError && (
                      <p style={{ color: "red" }}>This is required.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </>
    </EventDashboard>
  );
}
// updateeventdetails.layout = "Empty";
updateeventdetails.layout = "Event";
export default updateeventdetails;
