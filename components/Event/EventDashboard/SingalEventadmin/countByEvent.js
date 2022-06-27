function CountByEvent({
  totalAttendees,
  totalEventViews,
  totalRSVP,
  totalTicketSold,
}) {
  return (
    <>
      <div className="eingle-event-dashboard-overview mt-4">
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4">
          <div className="col">
            <div className="d-flex align-items-center bg-white border-radius-10 p-30">
              <div className="icon me-3 border-radius-10 bg-secondary d-flex justify-content-center align-items-center text-white">
                <i className="ri-calendar-event-line" />
              </div>
              <div>
                <div className=" digit font-weight-700">{totalAttendees}</div>
                <div className="text-gray-2">Total Attendees</div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="d-flex bg-white align-items-center border-radius-10 p-30">
              <div className="icon me-3 border-radius-10 bg-danger d-flex justify-content-center align-items-center text-white">
                <i className="ri-eye-line" />
              </div>
              <div>
                <div className=" digit font-weight-700">{totalEventViews}</div>
                <div className="text-gray-2">Event Views</div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="d-flex align-items-center bg-white border-radius-10 p-30">
              <div className="icon me-3 border-radius-10 bg-info d-flex justify-content-center align-items-center text-white">
                <i className="ri-coupon-2-line" />
              </div>
              <div>
                <div className=" digit font-weight-700">{totalTicketSold}</div>
                <div className="text-gray-2">Tickets Sold</div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="d-flex align-items-center bg-white border-radius-10 p-30">
              <div className="icon me-3 border-radius-10 bg-info d-flex justify-content-center align-items-center text-white">
                <i className="ri-calendar-event-line" />
              </div>
              <div>
                <div className=" digit font-weight-700">{totalRSVP}</div>
                <div className="text-gray-2">Total RSVP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CountByEvent;
