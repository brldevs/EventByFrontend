import $ from "jquery";
import React, { useState, useEffect } from "react";
import Popup from "../../../utils/Modal";
import TitleSubtitle from "../../../utils/Title/TitleSubtitle";
import { useFormData } from "../../../../context";
import { Col } from "react-bootstrap";
import SpeakerForm from "./SpeakerForm";
import {
  getEventPreviewDataOPVById,
  deleteSpeaker,
} from "../../../../services/service";
import { useAlert } from "react-alert";

function Speaker({ eventId }) {
  const alert = useAlert();

  const { setFormValues, data } = useFormData();

  const [show, setShow] = useState(false);

  const showPopUpForm = () => {
    setShow(true);
  };

  function PopSubmitHandler(event) {
    event.preventDefault();
  }

  //   dynamic start*********************************************************************
  const [inputFields, setInputFields] = useState(
    data.speakersList ? [...data.speakersList] : []
  );

  const handleAddFields = (data) => {
    const values = [...inputFields, data];
    setInputFields(values);
  };

  const handleRemoveFields = async (index) => {
    // remove by api calling
    if (data.speakersList[index].speakerId) {
      console.log("ID FOUND " + data.speakersList[index].speakerId);
      const dataSpeaker = {
        event_id: eventId,
        speaker_id: data.speakersList[index].speakerId,
      };
      const response = await deleteSpeaker(dataSpeaker, token);
      if (response.status === 200) {
        alert.show("Data Deleted Successfully", {
          type: "success",
        });
      }
    }
    // remove local
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);

    // remove from context
    const values2 = data.speakersList;
    values2.splice(index, 1);
    setFormValues({ ...data, speakersList: values2 });
  };

  //   dynamic end*********************************************************************
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  useEffect(async () => {
    setIsLoading(true);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(token);
    if (eventId) {
      const response = await getEventPreviewDataOPVById(eventId);

      console.log("RESPONSE: " + JSON.stringify(response));

      if (response.status === 200) {
        if (response.data.speakers.length > 0) {
          const speaker_list = response.data.speakers.map((item) => {
            return {
              speakerId: item._id,
              speakerName: item.name,
              speakerEmail: item.email,
            };
          });
          setInputFields(speaker_list);
          setFormValues({ ...data, speakersList: speaker_list });
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
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
  }, [eventId]);
  return (
    <>
      <TitleSubtitle
        title="Add Event Speakers"
        subtitle="(Optional)"
        righttext=""
      />

      <Popup
        title=""
        show={show}
        handleClose={() => setShow(false)}
        submitAction={PopSubmitHandler}
        data={
          <SpeakerForm
            setShow={setShow}
            handleAddFields={handleAddFields}
            inputFields={inputFields}
            eventId={eventId}
          />
        }
      />

      <div className="row row-cols-1 row-cols-lg-2 g-3">
        {!isLoading && (
          <>
            {inputFields.length > 0 &&
              inputFields.map((data, index) => (
                <Col key={index}>
                  <div className="border-radius-10 organizer d-flex align-items-center p-20 position-relative">
                    <img
                      src="/img/avata.png"
                      className="rounded-circle d-block me-3"
                    />
                    <div className="d-flex flex-column">
                      <div className="font-18">{data.speakerName} </div>
                      <span className="text-gray-2 font-13">
                        {data.speakerEmail}
                      </span>
                    </div>
                    <span
                      className="close-btn position-absolute"
                      onClick={() => handleRemoveFields(index)}
                    >
                      <i className="ri-close-line" />
                    </span>
                  </div>
                </Col>
              ))}
          </>
        )}

        <Col>
          <div
            variant="primary"
            onClick={showPopUpForm}
            className="border-radius-10 organizer add d-flex justify-content-center align-items-center p-20 position-relative"
          >
            <div className="font-18 text-primary">
              <i className="ri-user-line" /> Add Speaker
            </div>
          </div>
        </Col>
      </div>
    </>
  );
}

export default Speaker;
