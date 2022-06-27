import React, { Fragment, useState, useEffect } from "react";
import { ErrorMessage } from "@hookform/error-message";
function OnlineForm({
  register,
  setFormValues,
  data,
  errors,
  onlinePlatFormProps,
  platformHandler,
  defaultOnlineData = null,
}) {
  const {
    isGoogleMeet,
    isZoom,
    isOthers,
    isOnlinePlatformError,
    setIsGoogleMeet,
    setIsZoom,
    setIsOthers,
    setIsOnlinePlatformError,
  } = onlinePlatFormProps;

  const [defaultEventPlatFormLink, setDefaultEventPlatFormLink] = useState(
    null
  );
  useEffect(() => {
    if (defaultOnlineData) {
      setDefaultEventPlatFormLink(defaultOnlineData.event_platform_link);
      if (defaultOnlineData.event_platform === "Google Meet") {
        setIsGoogleMeet(true);
        setIsZoom(false);
        setIsOthers(false);
      } else if (defaultOnlineData.event_platform === "Zoom") {
        setIsZoom(true);
        setIsOthers(false);
      } else {
        setIsGoogleMeet(false);
        setIsZoom(false);
        setIsOthers(true);
      }
    }
  }, [defaultOnlineData]);

  return (
    <Fragment>
      <label>Platform</label>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 mb-4">
        <div className="col">
          <div className="checkbox">
            <input type="checkbox" hidden id="1" />
            <label
              htmlFor="1"
              className="d-flex align-items-center"
              onClick={() => platformHandler("1")}
            >
              <img
                style={{ margin: "7px 0" }}
                height={26}
                className="me-3"
                src="/img/meet.svg"
                alt="Meet"
              />
              <span>Meet</span>
              <span
                className={`tik-icon ${isGoogleMeet ? "selectd" : "d-none"}`}
              >
                <i className="ri-check-line text-white" />
              </span>
            </label>
          </div>
        </div>
        <div className="col">
          <div className="checkbox">
            <input type="checkbox" name hidden id="2" />
            <label
              htmlFor="2"
              className="d-flex align-items-center"
              onClick={() => platformHandler("2")}
            >
              <img
                style={{ margin: "7px 0" }}
                height={26}
                className="me-3"
                src="/img/zoom.svg"
                alt="Meet"
              />
              <span>Zoom</span>
              <span className={`tik-icon ${isZoom ? "selectd" : "d-none"}`}>
                <i className="ri-check-line text-white" />
              </span>
            </label>
          </div>
        </div>
        <div className="col">
          <div className="checkbox">
            <input type="checkbox" name hidden id="3" />
            <label
              htmlFor="3"
              className="d-flex align-items-center"
              onClick={() => platformHandler("3")}
            >
              <i className="ri-album-line" />
              <span>Others</span>
              <span className={`tik-icon ${isOthers ? "selectd" : "d-none"}`}>
                <i className="ri-check-line text-white" />
              </span>
            </label>
          </div>
        </div>
      </div>
      {isOnlinePlatformError && (
        <p style={{ color: "red" }}>This is required.</p>
      )}

      <div className="d-flex justify-content-between">
        <label>Platform Link</label>
        {isGoogleMeet && (
          <a
            htmlFor
            className="text-primary"
            target="_blank"
            href="https://meet.google.com/"
          >
            Get Your Google Meet Link Here
          </a>
        )}
        {isZoom && (
          <a
            htmlFor
            className="text-primary"
            target="_blank"
            href="https://zoom.us/"
          >
            Get Your Zoom Link Here
          </a>
        )}
      </div>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">
            <i className="ri-link" />
          </span>
        </div>
        <input
          type="text"
          {...register("event_platform_link", {
            required: "This is required.",
          })}
          defaultValue={defaultEventPlatFormLink}
          className="form-control"
          placeholder="Paste your link here"
        />
      </div>
      <ErrorMessage
        errors={errors}
        name="event_platform_link"
        render={({ messages }) =>
          messages &&
          Object.entries(messages).map(([type, message]) => (
            <p key={type} style={{ color: "red" }}>
              {message}
            </p>
          ))
        }
      />
      <div className="mt-4 mb-4">
        <input
          id="agree"
          {...register("emailToAttendees", { required: "This is required." })}
          type="checkbox"
          defaultChecked="true"
          className="me-2 form-check-input m-0"
        />
        <label htmlFor="agree" style={{ lineHeight: "25px" }}>
          Mail attendees the event link
        </label>
        <ErrorMessage
          errors={errors}
          name="emailToAttendees"
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
    </Fragment>
  );
}

export default OnlineForm;
