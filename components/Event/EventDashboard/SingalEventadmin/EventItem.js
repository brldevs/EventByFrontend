import Image from "next/image";
function EventItem() {
  console.log("calling");
  return (
    <div className="top-view-event bg-white p-20 border-radius-10">
      <div className="row align-items-center">
        <div className="col-lg-6 d-flex  align-items-center">
          <div className="image">
            <Image
              src="/img/dashboard_event_photo_1.jpg"
              width={120}
              height={120}
              className="border-radius-10"
            />
            <span className="online-btn">Online</span>
          </div>
          <div>
            <h5 className="font-24">Color Implementation in Design</h5>
            <div>
              <span className="text-gray-2">By : </span>
              Quinton,
              <span className="text-gray-2">San Francisco Area</span>
            </div>
            <span className="badge">Recurring</span>
          </div>
        </div>
        <div className="col-lg-6 d-flex align-items-center justify-content-between">
          <div className="text-gray-2">
            <div>
              <i className="ri-calendar-check-line" />
              July 23, 2021
            </div>
            <div>
              <i className="ri-time-line" />
              8:00 AM to 2:30 PM
            </div>
          </div>
          <div className>
            <span>Ticket Sold</span>
            <div className="d-flex mb-2 my-progress align-items-center">
              <span className="font-12 text-gray-2 me-2">18/50</span>
              <div
                className="rounded-pill"
                style={{
                  backgroundColor: "#D6DAE5",
                  height: "5px",
                  width: "100px",
                  overflow: "hidden",
                }}
              >
                <div
                  className="bg-secondary"
                  style={{ width: "40%", height: "100%" }}
                />
              </div>
            </div>
          </div>
          <div className="text-end">
            <a href="" className="btn btn-primary">
              View Event
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventItem;
