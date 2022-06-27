import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useFormData } from "../../../context";
import FormProgress from "../../utils/FormProgress";
import CoOrganizer from "../CoOrgSponsorSpeaker/CoOrganizer/CoOrganizer";
import Speaker from "../CoOrgSponsorSpeaker/Speaker/Speaker";
import Sponsor from "../CoOrgSponsorSpeaker/Sponsor/Sponsor";
import { useAlert } from "react-alert";
import {
  eventAddCoOrg,
  eventAddSpeaker,
  eventAddSponsor,
  getEventPreviewDataOPVById,
} from "../../../services/service";
function CoOrgSponsorSpeakerForm({
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
  const [currentEventID, setCurrentEventID] = useState(null);
  const [defaultCoOrgList, setDefaultCoOrgList] = useState([]);
  const [defaultSpeakerList, setDefaultSpeakerList] = useState([]);
  const [defaultSponsorList, setDefaultSponsorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(async () => {
    setIsLoading(true);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(token);

    const current_event_id =
      typeof window !== "undefined"
        ? localStorage.getItem("currentEventID")
        : null;
    setCurrentEventID(current_event_id);

    if (current_event_id) {
      const response = await getEventPreviewDataOPVById(current_event_id);

      console.log("RESPONSE: " + JSON.stringify(response));

      if (response.status === 200) {
        if (response.data.co_organizer.length > 0) {
          // coOrgName coOrgEmail
          const co_organizer_list = response.data.co_organizer.map((item) => {
            return {
              coOrgId: item._id,
              coOrgName: item.name,
              coOrgEmail: item.email,
            };
          });
          console.log("TESTING VALUE: " + JSON.stringify(co_organizer_list));

          setDefaultCoOrgList(co_organizer_list);
          setFormValues({ ...data, coOrgList: co_organizer_list });
        }
        if (response.data.speakers.length > 0) {
          const speakers_list = response.data.speakers.map((item) => {
            return {
              speakerId: item._id,
              speakerName: item.name,
              speakerEmail: item.email,
            };
          });
          setDefaultSpeakerList(speakers_list);
          setFormValues({ ...data, speakersList: speakers_list });
        }
        if (response.data.sponsors.length > 0) {
          const sponsor_list = response.data.sponsors.map((item) => {
            return {
              sponsorId: item._id,
              companyName: item.name,
              companyWebsiteLink: item.website,
              fileSponsorPreviewDefault: item.profilePath,
            };
          });
          setDefaultSponsorList(sponsor_list);
          setFormValues({ ...data, sponsorsList: sponsor_list });
        }
        setIsLoading(false);
      }
    }
  }, []);
  const [isDisableNextButton, setIsDisableNextButton] = useState(false);
  const [isDisableBackButton, setIsDisableBackButton] = useState(false);
  const onSubmit = async (d) => {
    // return nextFormStep(); //temporary blocked below code
    // setIsDisableNextButton(true);
    console.table(data);

    setFormValues({ ...data });

    if (currentEventID) {
      // EVENT CO-ORG, SPEAKER AND SPONSOR START
      if (data.coOrgList) {
        console.log("BEFORE SENDIN REQ: ");
        console.log(data.coOrgList);
        await eventAddCoOrg(data.coOrgList, token, currentEventID);
      }
      if (data.speakersList) {
        await eventAddSpeaker(data.speakersList, token, currentEventID);
      }
      if (data.sponsorsList) {
        await eventAddSponsor(data.sponsorsList, token, currentEventID);
      }
      alert.show("Data Updated Successfully", {
        type: "success",
      });
      nextFormStep();
      // EVENT CO-ORG, SPEAKER AND SPONSOR END

      // if (res.status === 200) {
      //   alert.show("Data Updated Successfully", {
      //     type: "success",
      //   });
      //   nextFormStep();
      // } else {
      //   alert.show(res.message, { type: "error" });
      // }
    }
  };

  return (
    <Row>
      {!isLoading && (
        <form onSubmit={handleSubmit(onSubmit)} id="coorg-sponsor-speaker-form">
          <Col className="mw-770">
            <CoOrganizer
              defaultCoOrgList={defaultCoOrgList}
              currentEventID={currentEventID}
              token={token}
            />
            <Speaker
              defaultSpeakerList={defaultSpeakerList}
              currentEventID={currentEventID}
              token={token}
            />
            <Sponsor
              defaultSponsorList={defaultSponsorList}
              currentEventID={currentEventID}
              token={token}
            />
          </Col>
          <FormProgress
            isDisableNextButton={isDisableNextButton}
            currentStep={currentStep}
            prevFormStep={prevFormStep}
            totalStep={totalStep}
            formId={"coorg-sponsor-speaker-form"}
          />
        </form>
      )}
    </Row>
  );
}

export default CoOrgSponsorSpeakerForm;
