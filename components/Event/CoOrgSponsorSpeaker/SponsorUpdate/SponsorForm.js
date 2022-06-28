import { ErrorMessage } from "@hookform/error-message";
import React, { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useFormData } from "../../../../context";
import { useAlert } from "react-alert";
import {
  getAllSponsor,
  eventSponsorAddByEventIdAndSponsorId,
} from "../../../../services/service";

function SponsorForm({ setShow, handleAddFields, inputFields, eventId }) {
  const alert = useAlert();
  const [sponsorList, setSponsorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setFormValues, data } = useFormData();
  const [fileSponsorPreview, setFileSponsorPreview] = useState(null);
  const [fileSponsorPic, setFileSponsorPic] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
  });

  const onSubmit = async (d) => {
    setAlreadySponsorAddedErrorMsg(null);
    console.table(d);

    d = { ...d, fileSponsorPreview, fileSponsorPic };

    handleAddFields(d);

    const values = [...inputFields, d];
    setFormValues({ ...data, sponsorsList: values });

    setShow(false);
  };

  const handleChange = (event) => {
    setFileSponsorPreview(URL.createObjectURL(event.target.files[0]));
    setFileSponsorPic(event.target.files[0]);
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
    }

    const res = await getAllSponsor(accessToken);

    if (res.status === 200) {
      setSponsorList(res.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const [isLeftBoxSelected, setIsLeftBoxSelected] = useState(false);
  const [isRightBoxSelected, setIsRightBoxSelected] = useState(false);

  const [
    alreadySponsorAddedErrorMsg,
    setAlreadySponsorAddedErrorMsg,
  ] = useState(null);

  const platformHandler = async (id, sponsorId) => {
    setAlreadySponsorAddedErrorMsg(null);
    setIsLeftBoxSelected(false);
    setIsRightBoxSelected(false);

    if (id === 0) setIsLeftBoxSelected(!isLeftBoxSelected);
    if (id === 1) setIsRightBoxSelected(!isRightBoxSelected);

    const res = await eventSponsorAddByEventIdAndSponsorId(
      token,
      eventId,
      sponsorId
    );

    if (res.status === 200) {
      alert.show(res.message);
      setShow(false);
    } else {
      setAlreadySponsorAddedErrorMsg(res.message);
      alert.show(res.message);
    }
  };
  return (
    <>
      <div>
        <h4 className="font-18">Add New Event Sponsor.</h4>
        <form>
          <div>
            <div className="row mb-3 g-3">
              <div className="col-sm-9">
                <label htmlFor>Company Name*</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="ri-user-line" />
                    </span>
                  </div>
                  <input
                    type="text"
                    {...register("companyName", {
                      required: "This is required.",
                    })}
                    placeholder="Company Name"
                    className="form-control"
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name="companyName"
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
              <div className="col-sm-3">
                <label htmlFor>Logo</label>
                <input
                  accept="image/*"
                  type="file"
                  hidden
                  id="logo"
                  onChange={handleChange}
                />
                <label htmlFor="logo" className="m-0 d-block">
                  {!fileSponsorPreview && (
                    <img src="/img/upload_icon.png" width={100} className />
                  )}

                  {fileSponsorPreview && (
                    <img src={fileSponsorPreview} height={100} width={100} />
                  )}
                </label>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor>Website Link*</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="ri-mail-line" />
                  </span>
                </div>
                <input
                  type="text"
                  {...register("companyWebsiteLink", {
                    required: "This is required.",
                  })}
                  className="form-control"
                  placeholder="Paste link here"
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="companyWebsiteLink"
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

export default SponsorForm;
