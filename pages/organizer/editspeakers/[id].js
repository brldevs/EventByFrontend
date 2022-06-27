import Head from "next/head";
import { Col, Row } from "react-bootstrap";
import GetOrganizersSponsorsSpeakers from "/components/Event/Addeventcoorganizer/GetOrganizersSponsorsSpeakers";
import TitleSubtitle from "/components/utils/Title/TitleSubtitle";

import EventDashboard from "../../../components/layout/EventDashboard";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CoOrganizer from "../../../components/Event/CoOrgSponsorSpeaker/CoOrganizerUpdate/CoOrganizer";
import Speaker from "../../../components/Event/CoOrgSponsorSpeaker/SpeakerUpdate/Speaker";
import Sponsor from "../../../components/Event/CoOrgSponsorSpeaker/SponsorUpdate/Sponsor";

import { useForm } from "react-hook-form";
import { useFormData } from "../../../context";
import { useAlert } from "react-alert";
import {
  eventAddCoOrg,
  eventAddSpeaker,
  eventAddSponsor,
} from "../../../services/service";
import EventCard from "../../../components/Event/EventCard";
const COORGANIZER = [
  {
    id: "1",
    name: "Mark Adam",
    email: "example@gmail.com",
    img: "organizer_2.png",
  },
  {
    id: "2",
    name: "Mark Adam",
    email: "example@gmail.com",
    img: "organizer_2.png",
  },
  {
    id: "3",
    name: "Mark Adam",
    email: "example@gmail.com",
    img: "organizer_2.png",
  },
  {
    id: "4",
    name: "Mark Adam",
    email: "example@gmail.com",
    img: "organizer_2.png",
  },
  {
    id: "5",
    name: "Mark Adam",
    email: "example@gmail.com",
    img: "organizer_2.png",
  },
];

const SPEAKER = [
  {
    id: "1",
    name: "Mark Adam",
    email: "example@gmail.com",
    img: "organizer_1.png",
  },
  {
    id: "2",
    name: "Mark Adam",
    email: "example@gmail.com",
    img: "organizer_1.png",
  },
  {
    id: "3",
    name: "Mark Adam",
    email: "example@gmail.com",
    img: "organizer_1.png",
  },
  {
    id: "4",
    name: "Mark Adam",
    email: "example@gmail.com",
    img: "organizer_1.png",
  },
  {
    id: "5",
    name: "Mark Adam",
    email: "example@gmail.com",
    img: "organizer_1.png",
  },
];

const SPONSOR = [
  { id: "1", img: "sponsor_4.png" },
  { id: "2", img: "sponsor_4.png" },
  { id: "3", img: "sponsor_4.png" },
  { id: "4", img: "sponsor_4.png" },
];
function addorganizers() {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const PopSubmitHandler = function (event) {
    event.preventDefault();
    console.log("submission");
  };

  const [eventId, setEventId] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  console.log("EventID : " + id);

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

  const onSubmit = async (d) => {
    console.table(data);

    setFormValues({ ...data });

    // EVENT CO-ORG, SPEAKER AND SPONSOR START
    const event_id = eventId;
    if (event_id) {
      if (data.coOrgList) {
        await eventAddCoOrg(data.coOrgList, token, event_id);
      }
      if (data.speakersList) {
        await eventAddSpeaker(data.speakersList, token, event_id);
      }
      if (data.sponsorsList) {
        await eventAddSponsor(data.sponsorsList, token, event_id);
      }
      alert.show("Data Updated Successfully", { type: "info" });
    }
    // EVENT CO-ORG, SPEAKER AND SPONSOR END
  };

  useEffect(async () => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap.bundle.js")
      : null;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(token);

    if (!token) {
      router.replace("/");
    }

    if (id) {
      setEventId(id);
    }
  }, [id]);

  return (
    <>
      <EventDashboard eventId={eventId}>
        <Head>
          <title>Add Organizer</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <EventCard eventId={eventId} />
        <div className="bg-white mt-4  border-radius-10">
          <div className="text-end px-50 py-50 pb-0">
            <button className="btn btn-secondary text-white" onClick={onSubmit}>
              Save Changes
            </button>
          </div>

          <div className="dashboard_event_container">
            <h2 className="text-center">Add Speakers</h2>
            <p className="text-gray-2 text-center">Add or remove Speakers</p>
            <div className="pb-5">
              <Row>
                <Col className="col-md-10 mx-md-auto">
                  {/* CoOrgSponsorSpeakerForm COMPONENT START */}
                  <Speaker eventId={eventId} />

                  {/* CoOrgSponsorSpeakerForm COMPONENT END */}
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </EventDashboard>
    </>
  );
}
// addorganizers.layout = "Empty";
addorganizers.layout = "Event";
export default addorganizers;
