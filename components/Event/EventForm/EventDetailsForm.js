import Head from "next/head";
import Link from "next/link";
import $ from "jquery";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Row, Col } from "react-bootstrap";
import { ErrorMessage } from "@hookform/error-message";
import CategoryItem from "../Category/CategoryItem";
import FromAppendPrepend from "/components/utils/FromAppendPrepend";
import OfflineForm from "../CreateEventForm/Offline";
import OnlineForm from "../CreateEventForm/Online";
import FormProgress from "../../utils/FormProgress";
import { useFormData } from "../../../context";
import { getEventCreateApiData } from "../../../services/setUpData";
import {
  eventCreate,
  getSelectedCategories,
  createRecurrentEvent,
  updateEventBasicDetails,
  getEventPreviewDataOPVById,
  updateEventBasicInfo,
} from "../../../services/service";
import { useAlert } from "react-alert";

function EventDetailsForm({
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

  const [locationData, setLocationData] = useState({});

  const [selectedCategoryList, setSelectedCategoryList] = useState([]);

  const [defaultLocationData, setDefaultLocationData] = useState();
  const [defaultOnlineData, setDefaultOnlineData] = useState();
  const [currentEventID, setCurrentEventID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      const response = await getEventPreviewDataOPVById(current_event_id);

      console.log("RESPONSE: " + JSON.stringify(response));

      if (response.status === 200) {
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

        if (response.data.planned_event_type) {
          setDropDownSelectedOption(response.data.planned_event_type);
        }

        if (response.data.event_type === "online") {
          setIsPhysicalEvent(false);
          setIsOnlineEvent(true);
          setIsHybridEvent(false);

          if (
            response.data.event_type_details.event_platform == "Google Meet"
          ) {
            setIsGoogleMeet(true);
            setIsZoom(false);
            setIsOthers(false);
          } else if (
            response.data.event_type_details.event_platform == "Zoom"
          ) {
            setIsGoogleMeet(false);
            setIsZoom(true);
            setIsOthers(false);
          } else {
            setIsGoogleMeet(false);
            setIsZoom(false);
            setIsOthers(true);
          }
        }
        if (response.data.event_type === "hybrid") {
          setIsPhysicalEvent(false);
          setIsOnlineEvent(false);
          setIsHybridEvent(true);
        }

        if (response.data.event_type_details) {
          if (response.data.event_type === "physical") {
            const tempData = {
              ...data,
              locationData: {
                location: response.data.event_type_details.event_location,
                event_address_line1:
                  response.data.event_type_details.event_address_line1,
                event_address_line2:
                  response.data.event_type_details.event_address_line2,
                event_country: response.data.event_type_details.event_country,
                event_postal_code:
                  response.data.event_type_details.event_postal_code,
                event_state: response.data.event_type_details.event_state,
                event_city_town:
                  response.data.event_type_details.event_city_town,
                // event_lat: response.data.event_type_details.event_lat,
                // event_long: response.data.event_type_details.event_long,
              },
            };
            setFormValues(tempData);
            setDefaultLocationData({
              location: response.data.event_type_details.event_location,
              event_address_line1:
                response.data.event_type_details.event_address_line1,
              event_address_line2:
                response.data.event_type_details.event_address_line2,
              event_country: response.data.event_type_details.event_country,
              event_postal_code:
                response.data.event_type_details.event_postal_code,
              event_state: response.data.event_type_details.event_state,
              event_city_town: response.data.event_type_details.event_city_town,
              // event_lat: response.data.event_type_details.event_lat,
              // event_long: response.data.event_type_details.event_long,
            });

            setValue(
              "event_address_line1",
              response.data.event_type_details.event_address_line1
            );

            setIsPhysicalEvent(true);
            setIsOnlineEvent(false);
            setIsHybridEvent(false);
          } else if (response.data.event_type === "online") {
            setDefaultOnlineData({
              event_platform: response.data.event_type_details.event_platform,
              event_platform_link:
                response.data.event_type_details.event_platform_link,
            });
            setValue(
              "event_platform_link",
              response.data.event_type_details.event_platform_link
            );
          } else {
            setDefaultLocationData({
              location: response.data.event_type_details.event_location,
              event_address_line1:
                response.data.event_type_details.event_address_line1,
              event_address_line2:
                response.data.event_type_details.event_address_line2,
              event_country: response.data.event_type_details.event_country,
              event_postal_code:
                response.data.event_type_details.event_postal_code,
              event_state: response.data.event_type_details.event_state,
              event_city_town: response.data.event_type_details.event_city_town,
              // event_lat: response.data.event_type_details.event_lat,
              // event_long: response.data.event_type_details.event_long,
            });
            setDefaultOnlineData({
              event_platform: response.data.event_type_details.event_platform,
              event_platform_link:
                response.data.event_type_details.event_platform_link,
            });
            setValue(
              "event_platform_link",
              response.data.event_type_details.event_platform_link
            );
            setEventLat(response.data.event_type_details.event_lat);
            setEventLong(response.data.event_type_details.event_long);
            setIsLoading(false);
          }
        }
        setIsLoading(false);
      } else {
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
  }, []);

  const [isDisableNextButton, setIsDisableNextButton] = useState(false);
  const [isDisableBackButton, setIsDisableBackButton] = useState(false);
  const [eventLat, setEventLat] = useState(null);
  const [eventLong, setEventLong] = useState(null);

  const onSubmit = async (d) => {
    // return nextFormStep(); //temporary block below code
    // setIsDisableNextButton(true);
    if (!dropDownSelectedOption) {
      setIsTypeOfEventPlaningToHostError(true);
    } else {
      if (!isGuestSelected) {
        setIsGuestLimitError(true);
      } else {
        setIsGuestLimitError(false);
        if (!isPhysicalEvent && !isOnlineEvent && !isHybridEvent) {
          setIsHostEventError(true);
        } else {
          setIsHostEventError(false);
          if (!data.locationData && (isPhysicalEvent || isHybridEvent)) {
            setIsLocationError(true);
          } else {
            setIsLocationError(false);
            if (
              !isGoogleMeet &&
              !isZoom &&
              !isOthers &&
              (isOnlineEvent || isHybridEvent)
            ) {
              setIsOnlinePlatformError(true);
            } else {
              setIsOnlinePlatformError(false);
              data = {
                ...data,
                ...d,
                isPhysicalEvent,
                isOnlineEvent,
                isHybridEvent,
                isGoogleMeet,
                isZoom,
                isOthers,
                typeOfEventPlaningToHost: dropDownSelectedOption,
              };
              console.log("ON Submit : ");
              console.table(data);

              //calling event create api or event update api based on currentEventID
              const bodyData = await getEventCreateApiData(data);
              console.log("BODY DATA: =================================");
              console.table(bodyData);
              if (currentEventID) {
                console.log("bodyData: ");
                console.log(bodyData);
                if (bodyData.event_type === "physical") {
                  const res = await updateEventBasicDetails(
                    {
                      event_id: currentEventID,
                      event_type: bodyData.event_type,
                      location: bodyData.location,
                      event_address_line1: bodyData.event_address_line1,
                      event_address_line2: bodyData.event_address_line2,
                      event_country: bodyData.event_country,
                      event_city_town: bodyData.event_city_town,
                      event_state: bodyData.event_state,
                      event_postal_code: bodyData.event_postal_code,
                      planned_event_type: bodyData.planned_event_type,
                      event_lat: eventLat,
                      event_long: eventLong,
                      total_guest: totalGuest,
                    },
                    token
                  );
                  console.log(JSON.stringify(res, null, 2));
                  // EVENT CREATE END

                  if (res.status === 200) {
                    alert.show("Data Updated Successfully", {
                      type: "success",
                    });
                    nextFormStep();
                  } else {
                    alert.show(res.message, { type: "error" });
                  }
                } else if (bodyData.event_type === "online") {
                  const res = await updateEventBasicDetails(
                    {
                      event_id: currentEventID,
                      event_type: bodyData.event_type,
                      event_platform: bodyData.event_platform,
                      event_platform_link: bodyData.event_platform_link,
                      planned_event_type: bodyData.planned_event_type,
                      total_guest: totalGuest,
                    },
                    token
                  );
                  console.log(JSON.stringify(res, null, 2));
                  // EVENT CREATE END

                  if (res.status === 200) {
                    alert.show("Data Updated Successfully", {
                      type: "success",
                    });
                    nextFormStep();
                  } else {
                    alert.show(res.message, { type: "error" });
                  }
                } else {
                  const res = await updateEventBasicDetails(
                    {
                      event_id: currentEventID,
                      event_type: bodyData.event_type,
                      location: bodyData.location,
                      event_address_line1: bodyData.event_address_line1,
                      event_address_line2: bodyData.event_address_line2,
                      event_country: bodyData.event_country,
                      event_city_town: bodyData.event_city_town,
                      event_state: bodyData.event_state,
                      event_postal_code: bodyData.event_postal_code,
                      event_type: bodyData.event_type,
                      event_platform: bodyData.event_platform,
                      event_platform_link: bodyData.event_platform_link,
                      planned_event_type: bodyData.planned_event_type,
                      event_lat: eventLat,
                      event_long: eventLong,
                      total_guest: totalGuest,
                    },
                    token
                  );
                  console.log(JSON.stringify(res, null, 2));
                  // EVENT CREATE END

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
              setFormValues(data);
            }
          }
        }
      }
    }
  };

  const [guest, setGuest] = useState([
    { label: "0-20", isSelect: false },
    {
      label: "21-50",

      isSelect: false,
    },
    {
      label: "51-100",

      isSelect: false,
    },
    {
      label: "101 & More",

      isSelect: false,
    },
  ]);
  const [isGuestSelected, setIsGuestSelected] = useState(false);
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
  const [totalGuest, setTotalGuest] = useState(null);

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
    setDefaultLocationData();
    setDefaultOnlineData();

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
    <form onSubmit={handleSubmit(onSubmit)} id="event-details-form">
      <>
        <div className="mw-770">
          {/* What Type Of Event Are You Planning To Host? */}
          <div className="mb-4">
            <label>
              What Type Of Event Are You Planning To Host?
              {/* {JSON.stringify(locationData)} */}
            </label>
            <div
              className="input-group me-0 me-sm-2"
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
                {dropDownSelectedOption ? dropDownSelectedOption : "Select"}
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
                          <label htmlFor={`typeOfEventPlaningToHost-${index}`}>
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
          <div className="row row-cols-1 row-cols-sm-1 row-cols-md-3 row-cols-xl-3 gx-3 mb-4">
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

          {/* <h1>{JSON.stringify(defaultLocationData)}</h1> */}
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
                  errors={errors}
                  setIsLocationError={setIsLocationError}
                  isLocationError={isLocationError}
                  setLocationData={setLocationData}
                  defaultLocationData={defaultLocationData}
                  eventLat={eventLat}
                  eventLong={eventLong}
                  setEventLat={setEventLat}
                  setEventLong={setEventLong}
                />
              ) : (
                <>
                  <OfflineForm
                    platformHandler={platformHandler}
                    register={register}
                    setFormValues={setFormValues}
                    data={data}
                    errors={errors}
                    setIsLocationError={setIsLocationError}
                    isLocationError={isLocationError}
                    setLocationData={setLocationData}
                    setEventLat={setEventLat}
                    setEventLong={setEventLong}
                  />
                </>
              )}
            </>
          )}

          {(isOnlineEvent || isHybridEvent) && (
            <>
              {isHybridEvent && <h5 class="my-3 text-dark">Online Details</h5>}

              {!isLoading ? (
                <OnlineForm
                  platformHandler={platformHandler}
                  register={register}
                  setFormValues={setFormValues}
                  data={data}
                  errors={errors}
                  onlinePlatFormProps={onlinePlatFormProps}
                  isOnlinePlatformError={isOnlinePlatformError}
                  defaultOnlineData={defaultOnlineData}
                />
              ) : (
                <OnlineForm
                  platformHandler={platformHandler}
                  register={register}
                  setFormValues={setFormValues}
                  data={data}
                  errors={errors}
                  onlinePlatFormProps={onlinePlatFormProps}
                  isOnlinePlatformError={isOnlinePlatformError}
                />
              )}
            </>
          )}

          {/* How Many Guests Do You Want To Invite? */}

          <div>
            <label htmlFor className="text-gray-1 mt-3">
              How Many Guests Do You Want To Invite?
            </label>
            <div className="row row-cols-2 row-cols-lg-4 gx-5">
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
                        className={`tik-icon ${!guest.isSelect && "d-none"}`}
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
        <FormProgress
          isDisableNextButton={false}
          currentStep={currentStep}
          prevFormStep={prevFormStep}
          totalStep={totalStep}
          formId={"event-details-form"}
        />
      </>
    </form>
  );
}

export default EventDetailsForm;
