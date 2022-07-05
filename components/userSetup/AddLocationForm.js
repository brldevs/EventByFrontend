import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import FromAppendPrepend from "../../components/utils/FromAppendPrepend";
import { useFormData } from "../../context";
import FormProgress from "../utils/FormProgress";
import { Form, Row, Col } from "react-bootstrap";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
function AddLocationForm({
  currentStep,
  totalStep,
  nextFormStep,
  prevFormStep,
}) {
  const { setFormValues, data } = useFormData();
  const [values, setValues] = useState(null);
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

  // const [locationAddress, setLocationAddress] = useState(null);
  // const locationHandler = (e) => {
  //   console.log(e.target.value);
  //   setLocationAddress(e.target.value);
  // };
  const [isDisableNextButton, setIsDisableNextButton] = useState(false);
  const [isDisableBackButton, setIsDisableBackButton] = useState(false);
  const onSubmit = async (d) => {
    setIsLocationError(false);

    console.log(values);
    if (!defaultLocationAddress) {
      setIsLocationError(true);
    } else {
      setIsLocationError(false);
      console.log("ONsubmit defaultLocationAddress" + defaultLocationAddress);
      localStorage.setItem("location_address_default", defaultLocationAddress);
      data = { ...data, ...d, location_address: defaultLocationAddress };
      setFormValues(data);
      console.table(data);
      nextFormStep();
    }
  };

  const [isLocationError, setIsLocationError] = useState(false);

  const setGooglePlacesAutocompleteValue = (d) => {
    setValues(d);
    if (d) {
      console.log("D.label = " + d.label);
      setDefaultLocationAddress(d.label);
      setIsLocationError(false);
    }
  };

  const [defaultLocationAddress, setDefaultLocationAddress] = useState();

  useEffect(() => {
    const location = localStorage.getItem("location_address_default");
    if (location) {
      console.log("calling UseEffect : " + location);
      setDefaultLocationAddress(location);
    }
  }, []);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} id="add-location-form">
        <div className="text-center set-location mb-250">
          <div className="row">
            <div className="col-md-7 mx-md-auto text-left googleplaceapi">
              {defaultLocationAddress && (
                <GooglePlacesAutocomplete
                  className="input-group"
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                  selectProps={{
                    defaultInputValue: defaultLocationAddress,
                    isClearable: true,
                    values,
                    onChange: setGooglePlacesAutocompleteValue,
                  }}
                />
              )}

              {!defaultLocationAddress && (
                <GooglePlacesAutocomplete
                  className="input-group"
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                  selectProps={{
                    values,
                    onChange: setGooglePlacesAutocompleteValue,
                  }}
                />
              )}

              {/* <h1> {defaultLocationAddress}</h1> */}
              {/* <div className="input-group d-none">
                <FromAppendPrepend icon="ri-map-pin-line" />

                {defaultLocationAddress && (
                  <Form.Control
                    type="text"
                    {...register("location_address")}
                    value={defaultLocationAddress}
                  />
                )}
                <div className="input-group-append">
                  <span className="input-group-text cursor-pointer text-primary">
                    <i className="ri-search-line" />
                  </span>
                </div>
              </div> */}
              {isLocationError && (
                <p style={{ color: "red" }}>This field is required!</p>
              )}
            </div>
          </div>
        </div>
        <FormProgress
          isDisableNextButton={isDisableNextButton}
          currentStep={currentStep}
          prevFormStep={prevFormStep}
          totalStep={totalStep}
          formId={"add-location-form"}
        />
      </form>
    </>
  );
}

export default AddLocationForm;
