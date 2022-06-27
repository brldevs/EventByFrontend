import Head from "next/head";
import Link from "next/link";
import FromAppendPrepend from "../../components/utils/FromAppendPrepend";
import React, { Fragment, useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import ProfileProgressBar from "../../components/utils/ProfileProgressBar";
import UserSetupForm from "../../components/userSetup/UserSetupForm";
import AddProfilePhotoForm from "../../components/userSetup/AddProfilePhotoForm";
import AddLocationForm from "../../components/userSetup/AddLocationForm";
import AddCategoryForm from "../../components/userSetup/AddCategoryForm";
import { useRouter } from "next/router";
import { checkUserProfileSetupStatus } from "../../services/service";
import { useAuthData } from "../../context/auth";
const profileSetup = ({ data }) => {
  const [formStep, setFormStep] = useState(0);
  const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);
  const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);

  const [formHeading, setFormHeading] = useState();

  const Router = useRouter();

  useEffect(async () => {
    const accessToken = localStorage.getItem("token");
    const result = JSON.parse(localStorage.getItem("result"));
    const response = await checkUserProfileSetupStatus(accessToken);

    if (!accessToken) {
      Router.replace("/");
    } else if (accessToken && result.role === "attendee") {
      Router.replace("/attendees");
    } else if (response.status === 200) {
      if (response.profile_setup_completed) {
        Router.replace("/event/dashboard");
      }
    }
    if (result) {
      setFormHeading(result.firstName);
    }
  }, [data]);

  return (
    <>
      <ProfileProgressBar
        currentStep={formStep}
        prevFormStep={prevFormStep}
        nextFormStep={nextFormStep}
        totalStep={3}
      >
        {formStep === 0 && (
          <UserSetupForm
            formStep={formStep}
            nextFormStep={nextFormStep}
            formHeading={
              formHeading ? `Hi ${formHeading} , 👋 Welcome To EventBy!` : null
            }
            formComp={
              <AddProfilePhotoForm
                currentStep={formStep}
                totalStep={3}
                nextFormStep={nextFormStep}
                prevFormStep={prevFormStep}
              />
            }
          />
        )}

        {formStep === 1 && (
          <UserSetupForm
            formStep={formStep}
            nextFormStep={nextFormStep}
            formHeading="Set Your Area Location"
            formTitle={
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "15px",
                  lineHeight: "25px",
                  color: "#9BA4BB",
                }}
              >
                You can meet your group at events locally and online. Set your
                location so we can get you
                <br /> connected with groups in your area, or you can just join
                online
              </p>
            }
            formComp={
              <AddLocationForm
                currentStep={formStep}
                totalStep={3}
                nextFormStep={nextFormStep}
                prevFormStep={prevFormStep}
              />
            }
          />
        )}

        {formStep === 2 && (
          <UserSetupForm
            formStep={formStep}
            nextFormStep={nextFormStep}
            formHeading="Choose What You Like To See"
            formTitle={
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "15px",
                  lineHeight: "25px",
                  color: "#9BA4BB",
                }}
              >
                Choose up to 5 interesting categories so that we can make a
                <br />
                good recommendation for you
              </p>
            }
            formComp={
              <AddCategoryForm
                currentStep={formStep}
                totalStep={3}
                nextFormStep={nextFormStep}
                prevFormStep={prevFormStep}
              />
            }
          />
        )}
      </ProfileProgressBar>
    </>
  );
};

profileSetup.layout = "Login";
export default profileSetup;
