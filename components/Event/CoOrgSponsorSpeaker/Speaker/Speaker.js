import React, { useState, useEffect } from "react";
import Popup from "../../../utils/Modal";
import TitleSubtitle from "../../../utils/Title/TitleSubtitle";
import { useFormData } from "../../../../context";
import { Col } from "react-bootstrap";
import SpeakerForm from "./SpeakerForm";
import { useAlert } from "react-alert";
import { deleteSpeaker } from "../../../../services/service";
function Speaker({ defaultSpeakerList, currentEventID, token }) {
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
  const [inputFields, setInputFields] = useState([]);

  const handleAddFields = (data) => {
    const tempData = { ...data, speakerId: null };
    const values = [...inputFields, tempData];
    setInputFields(values);
  };

  const handleRemoveFields = async (index) => {
    // remove by api calling
    if (data.speakersList[index].speakerId) {
      console.log("ID FOUND " + data.speakersList[index].speakerId);
      const dataSpeaker = {
        event_id: currentEventID,
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

  const [isSkipNowSpeaker, setIsSkipNowSpeaker] = useState(false);

  useEffect(() => {
    setInputFields(defaultSpeakerList);
  }, []);
  return (
    <>
      {!isSkipNowSpeaker && (
        <>
          <span className="font-18 mt-5 d-block">Add Event Speakers</span>
          <div className="font-14 mb-2 d-flex justify-content-between">
            <span className="text-gray-2 ">(Optional)</span>
            <span
              className="text-primary cursor-pointer"
              onClick={() => setIsSkipNowSpeaker(true)}
            >
              Skip Now
            </span>
          </div>
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
              />
            }
          />
          <div className="row row-cols-1 row-cols-lg-2 g-5">
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
      )}
    </>
  );
}

export default Speaker;
