import { Col } from "react-bootstrap";
import Popup from "../../utils/Modal";
import { useState } from "react";
import { useAlert } from "react-alert";

const GetOrganizersSponsorsSpeakers = (props) => {
  const alert = useAlert();
  const [coorganizer, setCoorganizer] = useState(props.list);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  function PopSubmitHandler(event) {
    event.preventDefault();
  }

  const removeCoorganizer = (id) => {
    var newCoorganizer = coorganizer.filter(function (item) {
      return item.id !== id;
    });
    setCoorganizer(newCoorganizer);
    alert.show("Videos deleted successfully.");
  };

  const co_organizers = (
    <>
      <h4 className="font-18 mb-3">Add New Event Co-Organizer</h4>
      <form onSubmit={PopSubmitHandler} method="post">
        <div className="mb-3">
          <label htmlFor>Full Name*</label>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="ri-user-line" />
              </span>
            </div>
            <input type="text" className="form-control" defaultValue="Mark" />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor>Email*</label>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="ri-mail-line" />
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Email ID"
            />
          </div>
        </div>
        <button type="button" className="btn btn-primary me-2 px-4">
          Add..
        </button>
        <button
          className="btn light-btn btn-outline-primary"
          onClick={() => setShow(false)}
        >
          Cancel
        </button>
      </form>
      <label htmlFor className="mt-4 font-18">
        Add Existing Co-Organizer
      </label>
      <div className="row row-cols-1 row-cols-sm-2 g-2">
        <div className="col">
          <div className="checkbox">
            <input type="checkbox" hidden id="organizer1" />
            <label htmlFor="organizer1" className="d-flex align-items-center">
              <img
                src="/img/organizer_1.png"
                className="rounden-circle"
                height={60}
                width={60}
              />
              <span>Sports &amp; Fitness</span>
              <span className="tik-icon d-none">
                <i className="ri-check-line text-light" />
              </span>
            </label>
          </div>
        </div>
        <div className="col">
          <div className="checkbox">
            <input type="checkbox" hidden id="organizer2" />
            <label htmlFor="organizer2" className="d-flex align-items-center">
              <img
                src="/img/organizer_2.png"
                className="rounden-circle"
                height={60}
                width={60}
              />
              <span>Sports &amp; Fitness</span>
              <span className="tik-icon d-none">
                <i className="ri-check-line text-light" />
              </span>
            </label>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div
        className={
          props.type !== "Sponsor"
            ? "row row-cols-1 row-cols-lg-2 g-3"
            : "row row-cols-2 g-2 row-cols-sm-3 row-cols-lg-4 row-cols-xl-5"
        }
      >
        <Popup
          title=""
          show={show}
          handleClose={() => setShow(false)}
          submitAction={PopSubmitHandler}
          data={co_organizers}
        />

        {props.type !== "Sponsor" &&
          coorganizer.map((organizer) => (
            <Col>
              <div className="border-radius-10 organizer d-flex align-items-center p-20 position-relative">
                <img
                  src={`../img/${organizer.img}`}
                  className="rounded-circle d-block me-3"
                />
                <div className="d-flex flex-column">
                  <div className="font-18">{organizer.name} </div>
                  <span className="text-gray-2 font-13">
                    {organizer.email} {organizer.key}
                  </span>
                </div>
                <span
                  className="close-btn position-absolute"
                  onClick={() => removeCoorganizer(organizer.id)}
                >
                  <i className="ri-close-line" />
                </span>
              </div>
            </Col>
          ))}

        {props.type !== "Sponsor" && (
          <Col>
            <div
              variant="primary"
              onClick={handleShow}
              className="border-radius-10 organizer add d-flex justify-content-center align-items-center p-20 position-relative"
            >
              <div className="font-18 text-primary">
                <i className="ri-user-line" /> Add Co-Organizer
              </div>
            </div>
          </Col>
        )}
      </div>

      <div className="row row-cols-2 g-2 row-cols-sm-3 row-cols-lg-4 row-cols-xl-5">
        {props.type == "Sponsor" &&
          coorganizer.map((organizer) => (
            <div className="col">
              <div className="organizer sponsor border-radius-10 p-20 position-relative d-flex justify-content-center align-items-center">
                <img src={`../img/${organizer.img}`} className="w-75 d-block" />
                <span
                  className="close-btn position-absolute"
                  onClick={() => removeCoorganizer(organizer.id)}
                >
                  <i className="ri-close-line" />
                </span>
              </div>
            </div>
          ))}

        {props.type == "Sponsor" && (
          <Col>
            <div
              variant="primary"
              onClick={handleShow}
              className="sponsor border-radius-10 organizer add d-flex justify-content-center align-items-center p-20 position-relative"
            >
              <div className="font-18 text-primary">Add New</div>
            </div>
          </Col>
        )}
      </div>
    </>
  );
};

export default GetOrganizersSponsorsSpeakers;
