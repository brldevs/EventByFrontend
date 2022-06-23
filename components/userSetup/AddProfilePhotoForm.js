import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFormData } from "../../context";
import FormProgress from "../utils/FormProgress";
import { MAX_PROFILE_PHOTO_SIZE } from "../../constants";

function AddProfilePhotoForm({
  currentStep,
  totalStep,
  nextFormStep,
  prevFormStep,
}) {
  const { setFormValues, data } = useFormData();
  const [file, setFile] = useState(null);
  const [fileView, setFileView] = useState(null);

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

  const [fileValidation, setFileValidation] = useState(false);

  const [isDisableNextButton, setIsDisableNextButton] = useState(false);
  const [isDisableBackButton, setIsDisableBackButton] = useState(false);
  const [submitFile, setSubmitFile] = useState(null);
  const onSubmit = async (d) => {
    if (file || data.file) {
      setFileValidation(false);

      localStorage.setItem("submitFile", file);
      data = { ...data, ...d, file: file || data.file, token };
      console.table(data);

      setFormValues(data);
      nextFormStep();
    } else {
      setFileValidation(true);
    }
  };

  const [fileValidationErrorMessage, setFileValidationErrorMessage] = useState(
    null
  );

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleChange = (event) => {
    if (fileValidationHandler(event)) {
      setFile(event.target.files[0]);
      setFileView(URL.createObjectURL(event.target.files[0]));

      // --------
      localStorage.setItem("files[0]", event.target.files[0]);
      getBase64(event.target.files[0]).then((base64) => {
        localStorage["fileBase64"] = base64;
      });
    }
    setFileValidation(false);
  };

  const [localStorageSavedFile, setLocalStorageSavedFile] = useState(null);
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(token);

    const localStorageFile =
      typeof window !== "undefined" ? localStorage.getItem("fileBase64") : null;
    setFileView(localStorageFile);

    const localStorageFile0 =
      typeof window !== "undefined" ? localStorage.getItem("files[0]") : null;
    setFile(localStorageFile);

    const fileLocalStorage =
      typeof window !== "undefined" ? localStorage.getItem("submitFile") : null;
    // const z = JSON.parse(fileLocalStorage);
    // setSubmitFile(z);
  }, []);

  const fileValidationHandler = (event) => {
    let file_size = event.target.files[0].size;

    let temp_img_size = file_size / 1000 / 1000;

    console.log("temp_img_size: " + temp_img_size);
    console.log("MAX_PROFILE_PHOTO_SIZE: " + MAX_PROFILE_PHOTO_SIZE);

    if (temp_img_size > MAX_PROFILE_PHOTO_SIZE) {
      setFileValidationErrorMessage("Maximum File Size is 5 mb!");
    } else {
      setFileValidationErrorMessage(null);
      return true;
    }

    //or if you like to have name and type
    // let file_name = event.target.files[0].name;
    // let file_type = event.target.files[0].type;
    //do whatever operation you want to do here
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} id="add-profile-photo-form">
        <div className="text-center profile-page">
          <div className="user-icon d-flex justify-content-center align-items-center rounded-circle">
            {fileView && (
              <label for="raised-button-file">
                <div className="user-icon d-flex justify-content-center align-items-center rounded-circle">
                  <Image
                    src={fileView}
                    height={200}
                    width={200}
                    className="rounded-circle"
                  />
                  <span className="edit rounded-circle">
                    <i className="ri-pencil-fill" />
                  </span>
                </div>
              </label>
            )}
            {!fileView && (
              <label for="raised-button-file">
                <div className="user-icon d-flex justify-content-center align-items-center rounded-circle">
                  <i className="ri-user-line" />
                  <span className="edit rounded-circle">
                    <i className="ri-pencil-fill" />
                  </span>
                </div>
              </label>
            )}
            {/* 
            <label for="raised-button-file" className="edit rounded-circle">
              <i className="ri-pencil-fill" forhtml="raised-button-file" />
            </label> */}
          </div>
          <input
            accept="image/*"
            id="raised-button-file"
            type="file"
            name="profileImg"
            onChange={handleChange}
            hidden
          />

          {fileValidation && (
            <p style={{ color: "red" }}>This field is required!</p>
          )}
          {fileValidationErrorMessage && (
            <p style={{ color: "red" }}>{fileValidationErrorMessage}</p>
          )}
          <div className="text-gray-2">
            Add a profile photo so people <br />
            can recognize you
          </div>
        </div>

        <FormProgress
          isDisableNextButton={isDisableNextButton}
          currentStep={currentStep}
          prevFormStep={prevFormStep}
          totalStep={totalStep}
          formId={"add-profile-photo-form"}
        />
      </form>
    </>
  );
}

export default AddProfilePhotoForm;
