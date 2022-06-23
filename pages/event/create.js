import Head from "next/head";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import BasicInfoForm from "../../components/Event/EventForm/BasicInfoForm";
import CoOrgSponsorSpeakerForm from "../../components/Event/EventForm/CoOrgSponsorSpeakerForm";
import EventCreateForm from "../../components/Event/EventForm/EventCreateForm";
import EventDetailsForm from "../../components/Event/EventForm/EventDetailsForm";
import EventMediaDetailsForm from "../../components/Event/EventForm/EventMediaDetailsForm";
import EventTicketForm from "../../components/Event/EventForm/EventTicketForm";
import PublishForm from "../../components/Event/EventForm/PublishForm";
import ProfileProgressBar from "../../components/utils/ProfileProgressBar";
import { useRouter } from "next/router";

const Event = () => {
  const router = useRouter();
  const [formStep, setFormStep] = useState(0);
  const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);
  const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Create Event</title>
        <meta property="og:title" content="" key="title" />
      </Head>
      <ProfileProgressBar
        currentStep={formStep}
        prevFormStep={prevFormStep}
        nextFormStep={nextFormStep}
        totalStep={6}
      >
        {formStep === 0 && (
          <EventCreateForm
            formStep={formStep}
            nextFormStep={nextFormStep}
            formHeading="Set Your Event’s Basic Information"
            formTitle="Tell us a bit about your event and quickly get started"
            formComp={
              <BasicInfoForm
                currentStep={formStep}
                totalStep={6}
                nextFormStep={nextFormStep}
                prevFormStep={prevFormStep}
              />
            }
          />
        )}
        {formStep === 1 && (
          <EventCreateForm
            formStep={formStep}
            nextFormStep={nextFormStep}
            formHeading="Create Event Page"
            formTitle="Tell us a bit about your event and quickly get started"
            formComp={
              <EventDetailsForm
                currentStep={formStep}
                totalStep={6}
                nextFormStep={nextFormStep}
                prevFormStep={prevFormStep}
              />
            }
          />
        )}

        {formStep === 2 && (
          <EventCreateForm
            formStep={formStep}
            nextFormStep={nextFormStep}
            formHeading="Ticket Page"
            formTitle="Create custom tickets for your events or make them free for all"
            formComp={
              <EventTicketForm
                currentStep={formStep}
                totalStep={6}
                nextFormStep={nextFormStep}
                prevFormStep={prevFormStep}
              />
            }
          />
        )}

        {formStep === 3 && (
          <EventCreateForm
            formStep={formStep}
            nextFormStep={nextFormStep}
            formHeading="Add The Finer Details To Your Event"
            formTitle="Tell us a bit about your event and quickly get started"
            formComp={
              <EventMediaDetailsForm
                currentStep={formStep}
                totalStep={6}
                nextFormStep={nextFormStep}
                prevFormStep={prevFormStep}
              />
            }
          />
        )}

        {formStep === 4 && (
          <EventCreateForm
            formStep={formStep}
            nextFormStep={nextFormStep}
            formHeading="Add Co-Organizers, Sponsors, Speakers & More"
            formTitle="Or skip this step, you can also add this information afterwards"
            formComp={
              <CoOrgSponsorSpeakerForm
                currentStep={formStep}
                totalStep={6}
                nextFormStep={nextFormStep}
                prevFormStep={prevFormStep}
              />
            }
          />
        )}

        {formStep === 5 && (
          <EventCreateForm
            formStep={formStep}
            nextFormStep={nextFormStep}
            formHeading="Publish Your Event"
            formTitle="Publish your event and create memories"
            formComp={
              <PublishForm
                currentStep={formStep}
                totalStep={6}
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
Event.layout = "Login";
export default Event;
