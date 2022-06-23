import React, { useState, useEffect } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { useFormData } from "../../../../context";
import $ from "jquery";
import { useAlert } from "react-alert";
import {
  getAllSpeaker,
  eventSpeakerAddByEventIdAndSpeakerId,
} from "../../../../services/service";

function SpeakerForm({ setShow, handleAddFields, inputFields }) {
  const alert = useAlert();
  const [speakerList, setSpeakerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setFormValues, data } = useFormData();
  const [fileSpeakerPreview, setFileSpeakerPreview] = useState(null);
  const [fileSpeakerPic, setFileSpeakerPic] = useState(null);
  const handleChange = (event) => {
    setFileSpeakerPreview(URL.createObjectURL(event.target.files[0]));
    setFileSpeakerPic(event.target.files[0]);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
  });

  const onSubmit = async (d) => {
    console.table(d);

    d = { ...d, fileSpeakerPreview, fileSpeakerPic };

    handleAddFields(d);

    const values = [...inputFields, d];
    setFormValues({ ...data, speakersList: values });

    setShow(false);
  };

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

    setIsLoading(true);
    const accessToken = localStorage.getItem("token");

    if (!accessToken) {
      router.replace("/");
      setIsLoading(false);
    } else {
      setToken(accessToken);
    }

    const res = await getAllSpeaker(accessToken);

    if (res.status === 200) {
      setSpeakerList(res.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const [isLeftBoxSelected, setIsLeftBoxSelected] = useState(false);
  const [isRightBoxSelected, setIsRightBoxSelected] = useState(false);

  const platformHandler = async (id, speakerId) => {
    setIsLeftBoxSelected(false);
    setIsRightBoxSelected(false);

    if (id === 0) setIsLeftBoxSelected(!isLeftBoxSelected);
    if (id === 1) setIsRightBoxSelected(!isRightBoxSelected);

    const res = await eventSpeakerAddByEventIdAndSpeakerId(
      token,
      data.event_id,
      speakerId
    );

    if (res.status === 200) {
      alert.show(res.message);

      setShow(false);
    } else {
      alert.show(res.message);
    }
  };

  return (
    <>
      <div>
        <h4 className="font-18 mb-3">
          <h4 className="font-18">Add Event Speakers</h4>
        </h4>
        <form>
          <div>
            <div className="row mb-3 g-3">
              <div className="col-sm-12">
                <label htmlFor>Full Name*</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="ri-user-line" />
                    </span>
                  </div>
                  <input
                    type="text"
                    {...register("speakerName", {
                      required: "This is required.",
                    })}
                    placeholder="Full Name"
                    className="form-control"
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name="speakerName"
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

            <div className="mb-3">
              <label htmlFor>Email*</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="ri-mail-line" />
                  </span>
                </div>
                <input
                  type="text"
                  {...register("speakerEmail", {
                    required: "This is required.",
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Please enter a valid email",
                    },
                  })}
                  className="form-control"
                  placeholder="Enter Email ID"
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="speakerEmail"
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
        </form>
        <button
          type="button"
          className="btn btn-primary me-2"
          onClick={handleSubmit(onSubmit)}
        >
          Add
        </button>
        <button
          className="btn light-btn btn-outline-primary"
          onClick={() => setShow(false)}
        >
          Cancel
        </button>
      </div>
    </>
  );
}

export default SpeakerForm;
