import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import React, { useState, useEffect } from "react";
import $ from "jquery";
import { Controller, useForm } from "react-hook-form";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  userPersonalDetails,
  saveUserProfileImg,
  updateUserProfile,
} from "../../../services/service";

import Head from "next/head";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
import { useAlert } from "react-alert";
import { useAuthData } from "../../../context/auth";
import {
  MAX_PROFILE_PHOTO_SIZE,
  ALERT_MESSAGE_PERSONAL_INFORMATION_UPDATE_SUCCESS,
} from "../../../constants";
var languageStrings = [
  {
    label: "Afrikaans",
    value: "Afrikaans",
  },
  {
    label: "Albanian",
    value: "Albanian",
  },
  {
    label: "Arabic",
    value: "Arabic",
  },
  {
    label: "Armenian",
    value: "Armenian",
  },
  {
    label: "Basque",
    value: "Basque",
  },
  {
    label: "Bengali",
    value: "Bengali",
  },
  {
    label: "Bulgarian",
    value: "Bulgarian",
  },
  {
    label: "Catalan",
    value: "Catalan",
  },
  {
    label: "Cambodian",
    value: "Cambodian",
  },
  {
    label: "Chinese (Mandarin)",
    value: "Chinese (Mandarin)",
  },
  {
    label: "Croatian",
    value: "Croatian",
  },
  {
    label: "Czech",
    value: "Czech",
  },
  {
    label: "Danish",
    value: "Danish",
  },
  {
    label: "Dutch",
    value: "Dutch",
  },
  {
    label: "English",
    value: "English",
  },
  {
    label: "Estonian",
    value: "Estonian",
  },
  {
    label: "Fiji",
    value: "Fiji",
  },
  {
    label: "Finnish",
    value: "Finnish",
  },
];
var tzStrings = [
  { label: "(GMT-12:00) International Date Line West", value: "Etc/GMT+12" },
  { label: "(GMT-11:00) Midway Island, Samoa", value: "Pacific/Midway" },
  { label: "(GMT-10:00) Hawaii", value: "Pacific/Honolulu" },
  { label: "(GMT-09:00) Alaska", value: "US/Alaska" },
  {
    label: "(GMT-08:00) Pacific Time (US & Canada)",
    value: "America/Los_Angeles",
  },
  { label: "(GMT-08:00) Tijuana, Baja California", value: "America/Tijuana" },
  { label: "(GMT-07:00) Arizona", value: "US/Arizona" },
  {
    label: "(GMT-07:00) Chihuahua, La Paz, Mazatlan",
    value: "America/Chihuahua",
  },
  { label: "(GMT-07:00) Mountain Time (US & Canada)", value: "US/Mountain" },
  { label: "(GMT-06:00) Central America", value: "America/Managua" },
  { label: "(GMT-06:00) Central Time (US & Canada)", value: "US/Central" },
  {
    label: "(GMT-06:00) Guadalajara, Mexico City, Monterrey",
    value: "America/Mexico_City",
  },
  { label: "(GMT-06:00) Saskatchewan", value: "Canada/Saskatchewan" },
  {
    label: "(GMT-05:00) Bogota, Lima, Quito, Rio Branco",
    value: "America/Bogota",
  },
  { label: "(GMT-05:00) Eastern Time (US & Canada)", value: "US/Eastern" },
  { label: "(GMT-05:00) Indiana (East)", value: "US/East-Indiana" },
  { label: "(GMT-04:00) Atlantic Time (Canada)", value: "Canada/Atlantic" },
  { label: "(GMT-04:00) Caracas, La Paz", value: "America/Caracas" },
  { label: "(GMT-04:00) Manaus", value: "America/Manaus" },
  { label: "(GMT-04:00) Santiago", value: "America/Santiago" },
  { label: "(GMT-03:30) Newfoundland", value: "Canada/Newfoundland" },
  { label: "(GMT-03:00) Brasilia", value: "America/Sao_Paulo" },
  {
    label: "(GMT-03:00) Buenos Aires, Georgetown",
    value: "America/Argentina/Buenos_Aires",
  },
  { label: "(GMT-03:00) Greenland", value: "America/Godthab" },
  { label: "(GMT-03:00) Montevideo", value: "America/Montevideo" },
  { label: "(GMT-02:00) Mid-Atlantic", value: "America/Noronha" },
  { label: "(GMT-01:00) Cape Verde Is.", value: "Atlantic/Cape_Verde" },
  { label: "(GMT-01:00) Azores", value: "Atlantic/Azores" },
  {
    label: "(GMT+00:00) Casablanca, Monrovia, Reykjavik",
    value: "Africa/Casablanca",
  },
  {
    label:
      "(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London",
    value: "Etc/Greenwich",
  },
  {
    label: "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
    value: "Europe/Amsterdam",
  },
  {
    label: "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
    value: "Europe/Belgrade",
  },
  {
    label: "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris",
    value: "Europe/Brussels",
  },
  {
    label: "(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
    value: "Europe/Sarajevo",
  },
  { label: "(GMT+01:00) West Central Africa", value: "Africa/Lagos" },
  { label: "(GMT+02:00) Amman", value: "Asia/Amman" },
  { label: "(GMT+02:00) Athens, Bucharest, Istanbul", value: "Europe/Athens" },
  { label: "(GMT+02:00) Beirut", value: "Asia/Beirut" },
  { label: "(GMT+02:00) Cairo", value: "Africa/Cairo" },
  { label: "(GMT+02:00) Harare, Pretoria", value: "Africa/Harare" },
  {
    label: "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
    value: "Europe/Helsinki",
  },
  { label: "(GMT+02:00) Jerusalem", value: "Asia/Jerusalem" },
  { label: "(GMT+02:00) Minsk", value: "Europe/Minsk" },
  { label: "(GMT+02:00) Windhoek", value: "Africa/Windhoek" },
  { label: "(GMT+03:00) Kuwait, Riyadh, Baghdad", value: "Asia/Kuwait" },
  {
    label: "(GMT+03:00) Moscow, St. Petersburg, Volgograd",
    value: "Europe/Moscow",
  },
  { label: "(GMT+03:00) Nairobi", value: "Africa/Nairobi" },
  { label: "(GMT+03:00) Tbilisi", value: "Asia/Tbilisi" },
  { label: "(GMT+03:30) Tehran", value: "Asia/Tehran" },
  { label: "(GMT+04:00) Abu Dhabi, Muscat", value: "Asia/Muscat" },
  { label: "(GMT+04:00) Baku", value: "Asia/Baku" },
  { label: "(GMT+04:00) Yerevan", value: "Asia/Yerevan" },
  { label: "(GMT+04:30) Kabul", value: "Asia/Kabul" },
  { label: "(GMT+05:00) Yekaterinburg", value: "Asia/Yekaterinburg" },
  { label: "(GMT+05:00) Islamabad, Karachi, Tashkent", value: "Asia/Karachi" },
  {
    label: "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
    value: "Asia/Calcutta",
  },
  { label: "(GMT+05:30) Sri Jayawardenapura", value: "Asia/Calcutta" },
  { label: "(GMT+05:45) Kathmandu", value: "Asia/Katmandu" },
  { label: "(GMT+06:00) Almaty, Novosibirsk", value: "Asia/Almaty" },
  { label: "(GMT+06:00) Astana, Dhaka", value: "Asia/Dhaka" },
  { label: "(GMT+06:30) Yangon (Rangoon)", value: "Asia/Rangoon" },
  { label: "(GMT+07:00) Bangkok, Hanoi, Jakarta", value: "Asia/Bangkok" },
  { label: "(GMT+07:00) Krasnoyarsk", value: "Asia/Krasnoyarsk" },
  {
    label: "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
    value: "Asia/Hong_Kong",
  },
  { label: "(GMT+08:00) Kuala Lumpur, Singapore", value: "Asia/Kuala_Lumpur" },
  { label: "(GMT+08:00) Irkutsk, Ulaan Bataar", value: "Asia/Irkutsk" },
  { label: "(GMT+08:00) Perth", value: "Australia/Perth" },
  { label: "(GMT+08:00) Taipei", value: "Asia/Taipei" },
  { label: "(GMT+09:00) Osaka, Sapporo, Tokyo", value: "Asia/Tokyo" },
  { label: "(GMT+09:00) Seoul", value: "Asia/Seoul" },
  { label: "(GMT+09:00) Yakutsk", value: "Asia/Yakutsk" },
  { label: "(GMT+09:30) Adelaide", value: "Australia/Adelaide" },
  { label: "(GMT+09:30) Darwin", value: "Australia/Darwin" },
  { label: "(GMT+10:00) Brisbane", value: "Australia/Brisbane" },
  {
    label: "(GMT+10:00) Canberra, Melbourne, Sydney",
    value: "Australia/Canberra",
  },
  { label: "(GMT+10:00) Hobart", value: "Australia/Hobart" },
  { label: "(GMT+10:00) Guam, Port Moresby", value: "Pacific/Guam" },
  { label: "(GMT+10:00) Vladivostok", value: "Asia/Vladivostok" },
  {
    label: "(GMT+11:00) Magadan, Solomon Is., New Caledonia",
    value: "Asia/Magadan",
  },
  { label: "(GMT+12:00) Auckland, Wellington", value: "Pacific/Auckland" },
  { label: "(GMT+12:00) Fiji, Kamchatka, Marshall Is.", value: "Pacific/Fiji" },
  { label: "(GMT+13:00) Nuku'alofa", value: "Pacific/Tongatapu" },
];

const personalinfo = () => {
  const { data, setAuthValues, removeAuthValues } = useAuthData();
  const alert = useAlert();
  const {
    setValue,
    setError,
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
    criteriaMode: "all",
  });

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [isDateOfBirthOpen, setIsDateOfBirthOpen] = useState(false);
  const toggleClass = () => {
    setIsDateOfBirthOpen(!isDateOfBirthOpen);
  };
  const [timeZoneSelectedValueErrorMsg, setTimeZoneSelectedValueErrorMsg] =
    useState(null);
  const [languageSelectedValueErrorMsg, setLanguageSelectedValueErrorMsg] =
    useState(null);

  const [selectedStartDateErrorMsg, setSelectedStartDateErrorMsg] =
    useState(null);
  const onSubmit = async (d) => {
    setTimeZoneSelectedValueErrorMsg(null);
    setLanguageSelectedValueErrorMsg(null);
    setSelectedStartDateErrorMsg(null);

    if (selectedStartDate) {
      if (timeZoneSelectedValue) {
        console.log("VALUE: TIMEZONE");
        console.log(timeZoneSelectedValue);
        if (languageSelectedValue) {
          const updateUserProfileData = {
            firstName: d.firstName,
            lastName: d.lastName,
            contact_number: d.contact_number,
            date_of_birth: selectedStartDate,
            time_zone: timeZoneSelectedValue,
            website: d.website,
            location: values ? values.label : defaultValueLocation,
            language: languageSelectedValue,
          };

          console.log(updateUserProfileData);

          const response = await updateUserProfile(
            updateUserProfileData,
            token
          );

          if (response.status === 200) {
            const result =
              typeof window !== "undefined"
                ? localStorage.getItem("result")
                : null;
            const resultParse = JSON.parse(result);
            const newResult = {
              ...resultParse,
              firstName: d.firstName,
              lastName: d.lastName,
            };
            localStorage.setItem("result", JSON.stringify(newResult));
            setAuthValues({
              result: { ...data.result, firstName: d.firstName },
            });
            alert.show(
              <div style={{ textTransform: "none" }}>
                {ALERT_MESSAGE_PERSONAL_INFORMATION_UPDATE_SUCCESS}
              </div>,
              {
                type: "success",
              }
            );
          }
        } else {
          setLanguageSelectedValueErrorMsg("This field is required!");
        }
      } else {
        setTimeZoneSelectedValueErrorMsg("This field is required!");
      }
    } else {
      setSelectedStartDateErrorMsg("This field is required!");
    }
  };

  const [userData, setUserData] = useState({});
  const [defaultValueLocation, setDefaultValueLocation] = useState(null);
  const [profileImgPath, setProfileImgPath] = useState(null);
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

    const token = localStorage.getItem("token");

    if (token) {
      setToken(token);
      const response = await userPersonalDetails(token);
      if (response.status === 200) {
        setUserData(response.data);
        reset(response.data);
        if (response.data.date_of_birth) {
          setSelectedStartDate(new Date(response.data.date_of_birth));
        }
        if (response.data.time_zone) {
          setTimeZoneSelectedValue(response.data.time_zone);
        }
        if (response.data.location) {
          setDefaultValueLocation(response.data.location);
        }
        if (response.data.language) {
          setLanguageSelectedValue(response.data.language);
        }
        if (response.data.profile_picture) {
          setProfileImgPath(response.data.profile_picture);
          localStorage.setItem("profileImage", response.data.profile_picture);
        }
      }
    }
  }, [reset]);
  const [values, setValues] = useState(null);
  const MyContainer = ({ className, children }) => {
    return (
      <div className="customcalender">
        <CalendarContainer className={className}>
          <div style={{ position: "relative" }}>{children}</div>
        </CalendarContainer>
      </div>
    );
  };

  const [image, setImage] = useState(null);
  const handleImage = async (e) => {
    if (fileValidationHandler(e)) {
      setImage(URL.createObjectURL(e.target.files[0]));

      const profileImgData = {
        file: e.target.files[0],
      };
      const response = await saveUserProfileImg(profileImgData, token);
      if (response.status === 200) {
        setAuthValues({
          result: { ...data.result, profileImage: e.target.files[0].name },
        });
        alert.show("Profile Image Saved Successfully", { type: "success" });
      } else if (response.status === 401) {
        alert.show(response.msg, { type: "error" });
      } else {
        alert.show(response.message, { type: "error" });
      }
    }
  };

  const [fileValidationErrorMessage, setFileValidationErrorMessage] =
    useState(null);
  const fileValidationHandler = (e) => {
    let file_size = e?.target?.files[0]?.size;

    let temp_img_size = file_size / 1000 / 1000;

    // console.log("temp_img_size: " + temp_img_size);
    // console.log("MAX_PROFILE_PHOTO_SIZE: " + MAX_PROFILE_PHOTO_SIZE);

    if (temp_img_size > MAX_PROFILE_PHOTO_SIZE) {
      setFileValidationErrorMessage("Maximum File Size is 5 mb!");
    } else if (
      ["image/jpeg", "image/png", "image/gif"].includes(
        e?.target?.files[0]?.type
      ) === false
    ) {
      // console.log("FILE TYPE IS: ");
      // console.log(
      //   ["image/jpeg", "image/png", "image/gif"].includes(
      //     e.target.files[0].type
      //   )
      // );
      setFileValidationErrorMessage("Only JPEG, PNG & GIF file allowed!");
    } else {
      setFileValidationErrorMessage(null);
      return true;
    }

    //or if you like to have name and type
    // let file_name = event.target.files[0].name;
    // let file_type = event.target.files[0].type;
    //do whatever operation you want to do here
  };

  // TIMEZONE DROP DOWN START==========================================

  const [isActiveFilterTimeZone, setIsActiveFilterTimeZone] = useState(false);
  const handleStatus = () => {
    setIsActiveFilterTimeZone(!isActiveFilterTimeZone);
  };

  const [timeZoneSelectedValue, setTimeZoneSelectedValue] = useState(null);
  const timeZoneRadioHandler = (e) => {
    setIsActiveFilterTimeZone(false);
    setTimeZoneSelectedValue(e.target.value);
    setTimeZoneSelectedValueErrorMsg(null);
  };
  // TIMEZONE DROP DOWN END==========================================

  // LANGUAGE DROP DOWN START==========================================

  const [isActiveFilterLanguage, setIsActiveFilterLanguage] = useState(false);
  const handleLanguage = () => {
    setIsActiveFilterTimeZone(false);
    setIsActiveFilterLanguage(!isActiveFilterLanguage);
  };

  const [languageSelectedValue, setLanguageSelectedValue] = useState(null);
  const languageRadioHandler = (e) => {
    setIsActiveFilterLanguage(false);
    setLanguageSelectedValue(e.target.value);
    setLanguageSelectedValueErrorMsg(null);
  };
  // LANGUAGE DROP DOWN END==========================================

  return (
    <>
      <div className="bg-white border-radius-10">
        <form>
          <div className="dashboard_event_container pb-5">
            <h2 className="text-center">Personal Information</h2>
            <p className="text-gray-2 text-center mb-5">
              Set up your profile by providing the information below
            </p>
            <div>
              {image ? (
                <img
                  src={image ? image : "/img/organizer_1.png"}
                  height={100}
                  width={100}
                  className="rounded-circle"
                />
              ) : (
                <img
                  src={
                    profileImgPath
                      ? `${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${profileImgPath}/image`
                      : "/img/organizer_1.png"
                  }
                  height={100}
                  width={100}
                  className="rounded-circle"
                />
              )}
              <input
                accept="image/*"
                type="file"
                id="photo"
                onChange={handleImage}
                hidden
              />
              {fileValidationErrorMessage && (
                <p style={{ color: "red" }}>{fileValidationErrorMessage}</p>
              )}
              <label
                htmlFor="photo"
                className="btn btn-outline-primary font-weight-500 px-3 ms-2"
              >
                <i className="ri-image-add-fill pe-1" />
                Change Photo
              </label>
            </div>
            <div className="row mt-4 row-cols-1 row-cols-md-2">
              <div className="col">
                <div className="mb-3">
                  <label htmlFor>First Name*</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="ri-user-line" />
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      {...register("firstName", {
                        required: "This is required.",
                        pattern: {
                          value: /^[a-z ,.'-]+$/i,
                          message: "Only letters are allowed",
                        },
                      })}
                    />
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="firstName"
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
              <div className="col">
                <div className="mb-3">
                  <label htmlFor>Last Name*</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="ri-user-line" />
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      {...register("lastName", {
                        required: "This is required.",
                        pattern: {
                          value: /^[a-z ,.'-]+$/i,
                          message: "Only letters are allowed",
                        },
                      })}
                    />
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="lastName"
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
              <div className="col">
                <div className="mb-3">
                  <label htmlFor>Email*</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="ri-mail-line" />
                      </span>
                    </div>
                    <input
                      readOnly
                      disabled
                      type="email"
                      className="form-control"
                      defaultValue={userData.email}
                    />
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="mb-3">
                  <label htmlFor>Contact Number*</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="ri-phone-line" />
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      {...register("contact_number", {
                        required: "This is required.",
                        pattern: {
                          value:
                            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                          message: `Only numbers are allowed`,
                        },
                      })}
                    />
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="contact_number"
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
              <div className="col">
                <div className="mb-3">
                  <label htmlFor>Date of Birth*</label>
                  <div
                    className={`input-group border-radius-bottom-0 calender-focus ${
                      isDateOfBirthOpen ? "onfocus" : ""
                    }`}
                    style={{ overflow: "visible" }}
                    onClick={toggleClass}
                  >
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="ri-calendar-event-line" />
                      </span>
                    </div>
                    <Controller
                      name="attendee_date_of_birth"
                      control={control}
                      initialFocusedDate={null}
                      // defaultValue={data.event_start_date || new Date()}
                      render={({ ref, ...rest }) => (
                        <DatePicker
                          placeholderText="dd/MM/yyyy"
                          dateFormat="dd/MM/yyyy"
                          selected={selectedStartDate}
                          maxDate={new Date()}
                          onChange={(date) => {
                            setSelectedStartDate(date);
                            setIsDateOfBirthOpen(!isDateOfBirthOpen);
                            setValue("attendee_date_of_birth", new Date(date));
                            setSelectedStartDateErrorMsg(null);
                          }}
                          calendarContainer={MyContainer}
                        />
                      )}
                    />
                  </div>
                </div>
                {selectedStartDateErrorMsg && (
                  <p style={{ color: "red" }}>{selectedStartDateErrorMsg}</p>
                )}
              </div>
              <div className="col">
                <div className="mb-3">
                  <label htmlFor>Time Zone*</label>
                  <div
                    className="input-group me-0 me-sm-2"
                    style={{ overflow: "visible" }}
                  >
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="ri-time-line" />
                      </span>
                    </div>
                    <div
                      onClick={handleStatus}
                      className={`wrapper-dropdown-4 custom-linhight ${
                        isActiveFilterTimeZone ? "active" : ""
                      } form-select form-control form-control-sm`}
                      style={{ lineHeight: "62px" }}
                    >
                      {timeZoneSelectedValue ? timeZoneSelectedValue : ""}

                      <ul
                        className="dropdown ps-0 rounded-bottom"
                        style={{ width: "435px", marginLeft: "-41px" }}
                      >
                        {tzStrings.slice(0, 10).map((item, index) => {
                          return (
                            <li key={index}>
                              <input
                                type="radio"
                                id={`tz-${index}`}
                                onChange={(e) => {
                                  timeZoneRadioHandler(e);
                                }}
                                name="time_zone"
                                defaultValue={item.value}
                                className="form-check-input"
                              />
                              <label htmlFor={`tz-${index}`}>
                                {item.label}
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                  {timeZoneSelectedValueErrorMsg && (
                    <p style={{ color: "red" }}>
                      {timeZoneSelectedValueErrorMsg}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor>Personal Website*</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="ri-global-line" />
                  </span>
                </div>
                <input
                  type="url"
                  className="form-control"
                  {...register("website", {
                    required: "This is required.",
                    pattern: {
                      value:
                        /^((ftp|http|https):\/\/)?www\.([A-z]+)\.([A-z]{2,})/,
                      message: `Invalid website address`,
                    },
                  })}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="website"
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
            <div className="mb-3 d-none">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="ri-global-line" />
                  </span>
                </div>
                <input
                  type="url"
                  className="form-control"
                  defaultValue={
                    values
                      ? values.label
                      : defaultValueLocation
                      ? defaultValueLocation
                      : ""
                  }
                />
              </div>
            </div>
            <div className="mb-3 pb-5">
              <label htmlFor>Location*</label>
              <GooglePlacesAutocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                className="input-group"
                selectProps={{
                  defaultInputValue: defaultValueLocation,
                  isClearable: true,
                  values,
                  onChange: setValues,
                }}
              />
            </div>
            <div className="mb-3 pb-5">
              <label htmlFor>Language*</label>
              <div
                className="input-group me-0 me-sm-2"
                style={{ overflow: "visible" }}
              >
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="ri-earth-line" />
                  </span>
                </div>
                <div
                  onClick={handleLanguage}
                  className={`wrapper-dropdown-4 ${
                    isActiveFilterLanguage ? "active" : ""
                  } form-select form-control form-control-sm`}
                  style={{ lineHeight: "62px" }}
                >
                  {languageSelectedValue ? languageSelectedValue : ""}

                  <ul
                    className="dropdown ps-0 rounded-bottom"
                    style={{ width: "900px", marginLeft: "-58px" }}
                  >
                    {languageStrings.slice(0, 10).map((item, index) => {
                      return (
                        <li key={index}>
                          <input
                            type="radio"
                            id={`lang-${index}`}
                            onChange={(e) => {
                              languageRadioHandler(e);
                            }}
                            name="language"
                            defaultValue={item.value}
                            className="form-check-input"
                          />
                          <label htmlFor={`lang-${index}`}>{item.label}</label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              {languageSelectedValueErrorMsg && (
                <p style={{ color: "red" }}>{languageSelectedValueErrorMsg}</p>
              )}
            </div>
          </div>
        </form>
        <div className="text-end px-50 py-50 pb-50">
          <button
            type="submit"
            className="btn btn-secondary text-white"
            onClick={handleSubmit(onSubmit)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};
// personalinfo.layout = "AccountSetting";
personalinfo.layout = "AttendeesDashboard";
export default personalinfo;
