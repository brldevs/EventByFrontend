function EventSponsorDetails(props) {
  return (
    <div className="col bg-white">
      <div className="organizer sponsor border-radius-10 p-20 position-relative d-flex justify-content-center align-items-center">
        <img src={`../img/${props.img}`} className="w-75 d-block" />
        <span className="close-btn position-absolute">
          <i className="ri-close-line" />
        </span>
      </div>
    </div>
  );
}

export default EventSponsorDetails;
