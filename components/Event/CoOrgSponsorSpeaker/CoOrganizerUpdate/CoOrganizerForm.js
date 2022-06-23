import { ErrorMessage } from "@hookform/error-message";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFormData } from "../../../../context";
import {
  getAllCoOrganizer,
  eventCoOrganizerAddByEventIdAndCoOrganizerId,
} from "../../../../services/service";
import { useAlert } from "react-alert";

function CoOrganizerForm({ setShow, handleAddFields, inputFields, eventId }) {
  const alert = useAlert();
  const [coOrganizerList, setCoOrganizerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setFormValues, data } = useFormData();
  const [fileCoOrgPreview, setFileCoOrgPreview] = useState(null);
  const [fileCoOrgPic, setFileCoOrgPic] = useState(null);
  const handleChange = (event) => {
    setFileCoOrgPreview(URL.createObjectURL(event.target.files[0]));
    setFileCoOrgPic(event.target.files[0]);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
  });

  const onSubmit = async (d) => {
    setAlreadyCoOrgAddedErrorMsg(null);
    console.table(d);

    d = { ...d, fileCoOrgPreview, fileCoOrgPic };

    handleAddFields(d);

    const values = [...inputFields, d];
    setFormValues({ ...data, coOrgList: values });

    setShow(false);
  };

  const [token, setToken] = useState(null);

  useEffect(async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("token");

    if (!accessToken) {
      router.replace("/");
      setIsLoading(false);
    } else {
      setToken(accessToken);
      setIsLoading(false);
    }

    // const res = await getAllCoOrganizer(accessToken);

    // if (res.status === 200) {
    //   setCoOrganizerList(res.data);
    //   setIsLoading(false);
    // } else {
    //   setIsLoading(false);
    // }
  }, []);

  const [isLeftBoxSelected, setIsLeftBoxSelected] = useState(false);
  const [isRightBoxSelected, setIsRightBoxSelected] = useState(false);

  const [alreadyCoOrgAddedErrorMsg, setAlreadyCoOrgAddedErrorMsg] =
    useState(null);

  const platformHandler = async (id, coOrganizerId) => {
    setAlreadyCoOrgAddedErrorMsg(null);
    setIsLeftBoxSelected(false);
    setIsRightBoxSelected(false);

    if (id === 0) setIsLeftBoxSelected(!isLeftBoxSelected);
    if (id === 1) setIsRightBoxSelected(!isRightBoxSelected);

    const res = await eventCoOrganizerAddByEventIdAndCoOrganizerId(
      token,
      eventId,
      coOrganizerId
    );

    if (res.status === 200) {
      alert.show(res.message);

      setShow(false);
    } else {
      setAlreadyCoOrgAddedErrorMsg(res.message);
      alert.show(res.message);
    }
  };
  return (
    <>
      <div>
        <h4 className="font-18 my-3">Add New Event Co-Organizer</h4>
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
                    {...register("coOrgName", {
                      required: "This is required.",
                    })}
                    placeholder="Full Name"
                    className="form-control"
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name="coOrgName"
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
                  {...register("coOrgEmail", {
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
                name="coOrgEmail"
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
          className="btn btn-primary me-2 px-4"
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
        {/* <label htmlFor className="mt-4 font-18">
          Add Existing Co-Organizer 00
        </label>
        {alreadyCoOrgAddedErrorMsg && (
          <p style={{ color: "red" }}>{alreadyCoOrgAddedErrorMsg}</p>
        )} */}
        {/* {isLoading ? (
          <p>Loading...</p>
        ) : (
            <div className="row row-cols-1 row-cols-sm-2 g-2">
              {coOrganizerList &&
                coOrganizerList.map((data, index) => {
                  return (
                    <div className="col" key={index}>
                      <div className="checkbox">
                        <input type="checkbox" hidden id={index} />
                        <label
                          htmlFor={index}
                          className="d-flex align-items-center"
                          onClick={() => {
                            platformHandler(index, data._id);
                          }}
                        >
                          <div className="border-radius-10 organizer d-flex align-items-center p-20 position-relative">
                            <img
                              src={`${
                                data.profilePath
                                  ? process.env.NEXT_PUBLIC_BASE_URL +
                                  "/getAssetWithPath/" +
                                  data.profilePath +
                                  "/image"
                                  : "/img/organizer_2.png"
                                }`}
                              className="rounded-circle d-block me-3"
                            />
                            <div className="d-flex flex-column">
                              <div className="font-18">{data.name} </div>
                              <span className="text-gray-2 font-13">
                                {data.email}
                              </span>
                            </div>
                          </div>
                          {index % 2 !== 0 ? (
                            <span
                              className={`tik-icon ${
                                isRightBoxSelected ? "selectd" : "d-none"
                                }`}
                            >
                              <i className="ri-check-line text-white" />
                            </span>
                          ) : (
                              <span
                                className={`tik-icon ${
                                  isLeftBoxSelected ? "selectd" : "d-none"
                                  }`}
                              >
                                <i className="ri-check-line text-white" />
                              </span>
                            )}
                        </label>
                      </div>
                    </div>
                  );
                })}
            </div>
          )} */}
      </div>
    </>
  );
}

export default CoOrganizerForm;
