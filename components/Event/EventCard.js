import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  getEventPreviewDataOPVById,
  getEventCoOrgSponsorSpeakerById,
} from "../../services/service";
import { format, compareAsc } from "date-fns";
import Link from "next/link";
import placeholderImg from "../../public/img/placeholderImg.jpg";

export default function EventCard({ eventId }) {
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [eventPreviewDataOPV, setEventPreviewDataOPV] = useState({});
  const [organizerName, setOrganizerName] = useState(null);

  const [financialInfo, setFinancialInfo] = useState({});

  useEffect(async () => {
    if (eventId) {
      setIsLoading(true);
      const res = await getEventPreviewDataOPVById(eventId);

      if (res.status === 200) {
        setEventPreviewDataOPV(res.data);
        if (res.financialInfo) {
          setFinancialInfo(res.financialInfo);
        }

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }

      const resCoOrgSponsorSpeakerList = await getEventCoOrgSponsorSpeakerById(
        eventId
      );

      if (resCoOrgSponsorSpeakerList.data) {
        const name =
          resCoOrgSponsorSpeakerList.data.organizers[0].firstName +
          " " +
          resCoOrgSponsorSpeakerList.data.organizers[0].lastName;
        setOrganizerName(name);
      }
    }
  }, [eventId]);
  return (
    <>
      {!isLoading && (
        <div className="top-view-event bg-white p-20 border-radius-10">
          <div className="row align-items-center">
            <div className="col-lg-6 d-flex  align-items-center">
              <div className="image">
                <Image
                  src={
                    eventPreviewDataOPV.event_banner
                      ? `${NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${eventPreviewDataOPV.event_banner}/image`
                      : placeholderImg
                  }
                  className="border-radius-10"
                  alt=""
                  width={130}
                  height={130}
                />
                <span className="online-btn">
                  {eventPreviewDataOPV.event_type}
                </span>
              </div>
              <div>
                <h5 className="font-24">{eventPreviewDataOPV.name}</h5>
                <div>
                  <span className="text-gray-2">By : </span>
                  {organizerName},{" "}
                  <span className="text-gray-2">
                    {eventPreviewDataOPV.event_type_details.event_location}
                  </span>
                </div>
                {/* <span className="badge">Recurring</span> */}
              </div>
            </div>
            <div className="col-lg-6 d-flex align-items-center justify-content-between">
              <div className="text-gray-2">
                <div>
                  <i className="ri-calendar-check-line me-2" />
                  {format(
                    new Date(eventPreviewDataOPV.start_date),
                    "MMMM dd, yyyy"
                  )}
                </div>
                <div>
                  <i className="ri-time-line me-2" />
                  <span>
                    {format(new Date(eventPreviewDataOPV.start_date), "p")} to{" "}
                    {format(new Date(eventPreviewDataOPV.end_date), "p")}
                  </span>
                </div>
              </div>
              {eventPreviewDataOPV?.ticket?.ticket_type === "paid" && (
                <div>
                  <span>Ticket Sold</span>
                  <div className="d-flex mb-2 my-progress align-items-center">
                    <span className="font-12 text-gray-2 me-2">
                      {financialInfo.sold}/{financialInfo.totalTickets}
                    </span>
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
                        style={{
                          width: `${
                            (financialInfo.sold / financialInfo.totalTickets) *
                            100
                          }%`,
                          height: "100%",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="text-end">
                <Link href={`/event/${eventId}`}>
                  <a target="_blank" className="btn btn-primary">
                    View Event
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
