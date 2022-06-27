import $ from "jquery";
import React, { useState, useEffect } from "react";
import Popup from "../../../utils/Modal";
import TitleSubtitle from "../../../utils/Title/TitleSubtitle";
import { useFormData } from "../../../../context";
import { Col } from "react-bootstrap";
import SponsorForm from "./SponsorForm";
import {
  getEventPreviewDataOPVById,
  deleteSponsor,
} from "../../../../services/service";
import { useAlert } from "react-alert";

function Sponsor({ eventId }) {
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
    const values = [...inputFields, data];
    setInputFields(values);
  };

  const handleRemoveFields = async (index) => {
    // remove by api calling
    if (data.sponsorsList[index].sponsorId) {
      console.log("ID FOUND " + data.sponsorsList[index].sponsorId);
      const dataCoOrganizer = {
        event_id: eventId,
        sponsor_id: data.sponsorsList[index].sponsorId,
      };
      const response = await deleteSponsor(dataCoOrganizer, token);
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
    const values2 = data.sponsorsList;
    values2.splice(index, 1);
    setFormValues({ ...data, sponsorsList: values2 });
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
        if (response.data.sponsors.length > 0) {
          const sponsor_list = response.data.sponsors.map((item) => {
            return {
              sponsorId: item._id,
              companyName: item.name,
              companyWebsiteLink: item.website,
              fileSponsorPreviewDefault: item.profilePath,
            };
          });
          setInputFields(sponsor_list);
          setFormValues({ ...data, sponsorsList: sponsor_list });
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
        title="Add Event Sponsor"
        subtitle="(Optional)"
        righttext=""
      />
      <Popup
        title=""
        show={show}
        handleClose={() => setShow(false)}
        submitAction={PopSubmitHandler}
        data={
          <SponsorForm
            setShow={setShow}
            handleAddFields={handleAddFields}
            inputFields={inputFields}
            eventId={eventId}
          />
        }
      />

      <div className="row row-cols-2 g-2 row-cols-sm-3 row-cols-lg-4 row-cols-xl-5">
        {!isLoading && (
          <>
            {inputFields.length > 0 &&
              inputFields.map((data, index) => (
                <Col key={index}>
                  <div className="organizer sponsor border-radius-10 p-20 position-relative d-flex justify-content-center align-items-center">
                    {data.fileSponsorPreviewDefault ? (
                      <img
                        src={
                          data.fileSponsorPreviewDefault
                            ? `${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${data.fileSponsorPreviewDefault}/image`
                            : "/img/photo_drag_background.svg"
                        }
                        className="w-75 d-block"
                      />
                    ) : (
                      <img
                        src={`${
                          data.fileSponsorPreview
                            ? data.fileSponsorPreview
                            : "../img/sponsor_4.png"
                        }`}
                        className="w-75 d-block"
                      />
                    )}

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
            className="sponsor border-radius-10 organizer add d-flex justify-content-center align-items-center p-20 position-relative"
          >
            <div className="font-18 text-primary">Add New</div>
          </div>
        </Col>
      </div>
    </>
  );
}

export default Sponsor;
