import React, { useState, useEffect } from "react";
import Popup from "../../../utils/Modal";
import TitleSubtitle from "../../../utils/Title/TitleSubtitle";
import { useFormData } from "../../../../context";
import { Col } from "react-bootstrap";
import { deleteCoOrganizer } from "../../../../services/service";
import CoOrganizerForm from "./CoOrganizerForm";
import { useAlert } from "react-alert";

function CoOrganizer({ defaultCoOrgList, currentEventID, token }) {
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
    const tempData = { ...data, coOrgId: null };
    const values = [...inputFields, tempData];
    setInputFields(values);
  };

  const handleRemoveFields = async (index) => {
    // remove by api calling
    if (data.coOrgList[index].coOrgId) {
      console.log("ID FOUND " + data.coOrgList[index].coOrgId);
      const dataCoOrganizer = {
        event_id: currentEventID,
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

  const [isSkipNowCoOrganizer, setIsSkipNowCoOrganizer] = useState(false);
  useEffect(() => {
    setInputFields(defaultCoOrgList);
  }, []);
  return (
    <>
      {!isSkipNowCoOrganizer && (
        <>
          <span className="font-18  d-block">Add Event Co-Organizer</span>
          <div className="font-14 mb-2 d-flex justify-content-between">
            <span className="text-gray-2 ">(Optional)</span>
            <span
              className="text-primary cursor-pointer"
              onClick={() => setIsSkipNowCoOrganizer(true)}
            >
              Skip Now
            </span>
          </div>

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
      )}
    </>
  );
}

export default CoOrganizer;
