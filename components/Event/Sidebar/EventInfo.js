import { parseWithOptions } from "date-fns/fp";
import ShareEvent from "../../utils/ShareEvent";
import { format, compareAsc } from "date-fns";
import React, { useState, useEffect } from "react";

function EventInfo({
  eventPreviewDataOPV,
  organizerEmail,
  remainingTickets,
  eventBannerImg,
}) {
  const { name, start_date, end_date, event_type, _id } = eventPreviewDataOPV;
  const [show, setShow] = useState(true);
  const {
    event_location,
    event_address_line1,
    event_address_line2,
    event_city_town,
    event_state,
    event_postal_code,
    event_country,
  } = eventPreviewDataOPV.event_type_details;

  const [isLoading, setIsLoading] = useState(true);
  const copytextHandler = () => {
    setShow(false);
    typeof window !== "undefined" &&
      navigator.clipboard.writeText(window.location.href);
    setTimeout(function () {
      setShow(true);
    }, 5000);
  };
  return (
    <>
      <div className="event-info bg-white border-radius-10 p-4">
        <h5 className="font-20 font-weight-500">Event Info.</h5>
        <hr className="hr my-3" />
        <div className="d-flex">
          <i className="ri-calendar-check-line font-20 me-2 text-gray-2" />
          <div>
            <div>EVENT DATE</div>
            <div className="font-14 text-gray-2">
              {format(new Date(start_date), "MMMM dd, yyyy")} to{" "}
              {format(new Date(end_date), "MMMM dd, yyyy")}
            </div>
            {/* <a
         href=""
         className="font-12 text-primary links text-decoration-underline"
       >
         Show All Date
       </a> */}
          </div>
        </div>
        <div className="d-flex mt-4">
          <i className="ri-time-line font-20 me-2 text-gray-2" />
          <div>
            <div>TIME</div>
            <div className="font-14 text-gray-2">
              {format(new Date(start_date), "p")} to{" "}
              {format(new Date(end_date), "p")}
            </div>
          </div>
        </div>

        {eventPreviewDataOPV?.ticket?.ticket_type === "paid" && (
          <div className="d-flex mt-4">
            <i className="ri-coupon-line font-20 me-2 text-gray-2" />
            <div>
              <div>REMAINING TICKETS</div>
              <div className="font-14 text-gray-2">{remainingTickets}</div>
            </div>
          </div>
        )}

        <div className="d-flex mt-4">
          <i className="ri-mail-line font-20 me-2 text-gray-2" />
          <div>
            <div>EMAIL</div>
            <div className="font-14 text-gray-2">{organizerEmail}</div>
          </div>
        </div>
        <div className="copy-link mt-4">
          <span className="font-14">Copy Event Link</span>
          <div className="d-flex border p-2 align-items-center rounded justify-content-between">
            <span
              className="font-12 text-gray-2"
              style={{ overflow: "hidden", marginRight: "8px" }}
            >
              {typeof window !== "undefined" && window.location.href}
            </span>
            <i
              className="ri-file-copy-line text-primary cursor-pointer"
              onClick={() => copytextHandler()}
              title="Copy Event Link"
            />
          </div>
        </div>

        {!show && <p className="text-secondary">Copied successfully</p>}
        <div className="social-share mt-4">
          <div className>
            <span className="font-20 me-4">Share Event</span>
            <hr className="hr my-3" />
            <ShareEvent
              f="102"
              p="14562"
              t="152"
              l="1562"
              w="14562"
              postUrl={
                typeof window !== "undefined" && encodeURI(window.location.href)
              }
              postTitle={encodeURI(name)}
              postImg={`${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${eventPreviewDataOPV.event_banner}/image`}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default EventInfo;
