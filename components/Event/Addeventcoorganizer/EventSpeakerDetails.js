import { Col } from "react-bootstrap";
function EventSpeakerDetails() {
  return (
    <Col>
      <div className="border-radius-10 organizer d-flex align-items-center p-20 position-relative">
        <img
          src="/img/organizer_1.png"
          className="rounded-circle d-block me-3"
        />
        <div className="d-flex flex-column">
          <div className="font-18">Willam Smith</div>
          <span className="text-gray-2 font-13">example@gmail.com</span>
        </div>
        <span className="close-btn position-absolute">
          <i className="ri-close-line" />
        </span>
      </div>
    </Col>
  );
}

export default EventSpeakerDetails;
