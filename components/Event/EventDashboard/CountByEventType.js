function CountByEventType(props) {
  return (
    <>
      <div className="col">
        <div className="d-flex bg-white border-radius-10 p-4">
          <div className="icon me-3 border-radius-10 bg-secondary d-flex justify-content-center align-items-center text-white">
            <i className="ri-calendar-check-line" />
          </div>
          <div className="pt-2">
            <div className=" digit font-weight-700 text-dark">
              {props.published}
            </div>
            <div className="text-gray-2">Published Events</div>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="d-flex bg-white border-radius-10 p-4">
          <div className="icon me-3 border-radius-10 bg-danger d-flex justify-content-center align-items-center text-white">
            <i className="ri-draft-line" />
          </div>
          <div className="pt-2">
            <div className=" digit font-weight-700 text-dark">
              {props.drafted}
            </div>
            <div className="text-gray-2">Drafted Events</div>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="d-flex bg-white border-radius-10 p-4">
          <div className="icon me-3 border-radius-10 bg-info d-flex justify-content-center align-items-center text-white">
            <i className="ri-calendar-event-line" />
          </div>
          <div className="pt-2">
            <div className=" digit font-weight-700 text-dark">
              {props.scheduled}
            </div>
            <div className="text-gray-2">Scheduled Events</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CountByEventType;
