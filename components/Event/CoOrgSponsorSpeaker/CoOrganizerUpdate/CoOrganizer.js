import $ from "jquery";
import React, { useState, useEffect } from "react";
import Popup from "../../../utils/Modal";
import TitleSubtitle from "../../../utils/Title/TitleSubtitle";
import { useFormData } from "../../../../context";
import { Col } from "react-bootstrap";
import CoOrganizerForm from "./CoOrganizerForm";
import {
  getEventPreviewDataOPVById,
  deleteCoOrganizer,
} from "../../../../services/service";
import { useAlert } from "react-alert";

function CoOrganizer({ eventId }) {
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
    data.coOrgList ? [...data.coOrgList] : []
  );

  const handleAddFields = (data) => {
    const values = [...inputFields, data];
    setInputFields(values);
  };

  const handleRemoveFields = async (index) => {
    // remove by api calling
    if (data.coOrgList[index].coOrgId) {
      console.log("ID FOUND " + data.coOrgList[index].coOrgId);
      const dataCoOrganizer = {
        event_id: eventId,
        co_organizer_id: data.coOrgList[index].coOrgId,
      };
      const response = await deleteCoOrganizer(dataCoOrganizer, token);
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
    const values2 = data.coOrgList;
    values2.splice(index, 1);
    setFormValues({ ...data, coOrgList: values2 });
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
        if (response.data.co_organizer.length > 0) {
          const co_organizer_list = response.data.co_organizer.map((item) => {
            return {
              coOrgId: item._id,
              coOrgName: item.name,
              coOrgEmail: item.email,
            };
          });
          setInputFields(co_organizer_list);
          setFormValues({ ...data, coOrgList: co_organizer_list });
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
        title="Add Event Co-Organizer"
        subtitle="(Optional)"
        righttext=""
      />
      <Popup
        title="Add Event Co-Organizer"
        show={show}
        handleClose={() => setShow(false)}
        submitAction={PopSubmitHandler}
        data={
          <CoOrganizerForm
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
                      <div className="font-18">{data.coOrgName} </div>
                      <span className="text-gray-2 font-13">
                        {data.coOrgEmail}
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
              <i className="ri-user-line" /> Add Co-Organizer
            </div>
          </div>
        </Col>
      </div>
    </>
  );
}

export default CoOrganizer;
