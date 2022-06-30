import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventsAttendedSidebar from "../../../components/Event/EventsAttendedSidebar";
import UpcomingEvent from "../../../components/Event/Upcomingevent";
import CustomEventCalender from "../../../components/CustomEventCalender";
import UpcommingEventFullWidth from "../../../components/Event/Upcommingeventfullwidth";
import {
  getEventPreviewDataOPVById,
  getEventBannerByEventId,
  getEventCoOrgSponsorSpeakerById,
} from "../../../services/service";
const eventlist = [
  {
    id: 0,
    title: "All Day Event very long title",
    allDay: true,
    start: new Date(2022, 3, 0),
    end: new Date(2022, 3, 1),
  },
  {
    id: 1,
    title: "Long Event",
    start: new Date(2022, 3, 7),
    end: new Date(2022, 3, 10),
  },

  {
    id: 2,
    title: "DTS STARTS",
    start: new Date(2016, 2, 13, 0, 0, 0),
    end: new Date(2016, 2, 20, 0, 0, 0),
  },

  {
    id: 3,
    title: "DTS ENDS",
    start: new Date(2016, 10, 6, 0, 0, 0),
    end: new Date(2016, 10, 13, 0, 0, 0),
  },

  {
    id: 4,
    title: "Some Event",
    start: new Date(2022, 3, 9, 0, 0, 0),
    end: new Date(2022, 3, 10, 0, 0, 0),
  },
  {
    id: 5,
    title: "Conference",
    start: new Date(2022, 3, 11),
    end: new Date(2022, 3, 13),
    desc: "Big conference for important people",
  },
  {
    id: 6,
    title: "Meeting",
    start: new Date(2022, 3, 12, 10, 30, 0, 0),
    end: new Date(2022, 3, 12, 12, 30, 0, 0),
    desc: "Pre-meeting meeting, to prepare for the meeting",
  },
  {
    id: 7,
    title: "Lunch",
    start: new Date(2022, 3, 12, 12, 0, 0, 0),
    end: new Date(2022, 3, 12, 13, 0, 0, 0),
    desc: "Power lunch",
  },
  {
    id: 8,
    title: "Meeting",
    start: new Date(2022, 3, 12, 14, 0, 0, 0),
    end: new Date(2022, 3, 12, 15, 0, 0, 0),
  },
  {
    id: 9,
    title: "Happy Hour",
    start: new Date(2022, 3, 12, 17, 0, 0, 0),
    end: new Date(2022, 3, 12, 17, 30, 0, 0),
    desc: "Most important meal of the day",
  },
  {
    id: 10,
    title: "Dinner",
    start: new Date(2022, 3, 12, 20, 0, 0, 0),
    end: new Date(2022, 3, 12, 21, 0, 0, 0),
  },
  {
    id: 11,
    title: "Planning Meeting with Paige",
    start: new Date(2022, 3, 13, 8, 0, 0),
    end: new Date(2022, 3, 13, 10, 30, 0),
  },
  {
    id: 11.1,
    title: "Inconvenient Conference Call",
    start: new Date(2022, 3, 13, 9, 30, 0),
    end: new Date(2022, 3, 13, 12, 0, 0),
  },
  {
    id: 11.2,
    title: "Project Kickoff - Lou's Shoes",
    start: new Date(2022, 3, 13, 11, 30, 0),
    end: new Date(2022, 3, 13, 14, 0, 0),
  },
  {
    id: 11.3,
    title: "Quote Follow-up - Tea by Tina",
    start: new Date(2022, 3, 13, 15, 30, 0),
    end: new Date(2022, 3, 13, 16, 0, 0),
  },
  {
    id: 12,
    title: "Late Night Event",
    start: new Date(2022, 3, 17, 19, 30, 0),
    end: new Date(2022, 3, 18, 2, 0, 0),
  },
  {
    id: 12.5,
    title: "Late Same Night Event",
    start: new Date(2022, 3, 17, 19, 30, 0),
    end: new Date(2022, 3, 17, 23, 30, 0),
  },
  {
    id: 13,
    title: "Multi-day Event",
    start: new Date(2022, 3, 20, 19, 30, 0),
    end: new Date(2022, 3, 22, 2, 0, 0),
  },
  {
    id: 14,
    title: "Today",
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },
  {
    id: 16,
    title: "Video Record",
    start: new Date(2022, 3, 14, 15, 30, 0),
    end: new Date(2022, 3, 14, 19, 0, 0),
  },
  {
    id: 17,
    title: "Dutch Song Producing",
    start: new Date(2022, 3, 14, 16, 30, 0),
    end: new Date(2022, 3, 14, 20, 0, 0),
  },
  {
    id: 18,
    title: "Itaewon Halloween Meeting",
    start: new Date(2022, 3, 14, 16, 30, 0),
    end: new Date(2022, 3, 14, 17, 30, 0),
  },
  {
    id: 19,
    title: "Online Coding Test",
    start: new Date(2022, 3, 14, 17, 30, 0),
    end: new Date(2022, 3, 14, 20, 30, 0),
  },
  {
    id: 20,
    title: "An overlapped Event",
    start: new Date(2022, 3, 14, 17, 0, 0),
    end: new Date(2022, 3, 14, 18, 30, 0),
  },
  {
    id: 21,
    title: "Phone Interview",
    start: new Date(2022, 3, 14, 17, 0, 0),
    end: new Date(2022, 3, 14, 18, 30, 0),
  },
  {
    id: 22,
    title: "Cooking Class",
    start: new Date(2022, 3, 14, 17, 30, 0),
    end: new Date(2022, 3, 14, 19, 0, 0),
  },
  {
    id: 23,
    title: "Go to the gym",
    start: new Date(2022, 3, 14, 18, 30, 0),
    end: new Date(2022, 3, 14, 20, 0, 0),
  },
];
const localizer = momentLocalizer(moment);

function eventCalender() {
  const [eventData, setEventData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [eventBannerImg, setEventBannerImg] = useState(null);

  const [organizer, setOrganizer] = useState({});

  const [eventID, setEventID] = useState(null);
  const [participantID, setParticipantID] = useState(null);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    document.body.classList.toggle("attendees");
  }, []);

  useEffect(async () => {
    if (
      !localStorage.getItem("isSignUpWithoutEventBy") &&
      !localStorage.getItem("token")
    ) {
      router.replace("/");
    }
    document.body.classList.toggle("attendees");
    const participant_id =
      typeof window !== "undefined"
        ? localStorage.getItem("participant_id")
        : null;
    setParticipantID(participant_id);

    const eventId = id;
    if (eventId) {
      setEventID(eventId);
      const res = await getEventPreviewDataOPVById(eventId);

      const resBannerImg = await getEventBannerByEventId(eventId);

      if (resBannerImg) {
        setEventBannerImg(resBannerImg);
      }

      const resCoOrgSponsorSpeaker = await getEventCoOrgSponsorSpeakerById(
        eventId
      );

      if (resCoOrgSponsorSpeaker) {
        setOrganizer(resCoOrgSponsorSpeaker.data.organizers[0]);
      }

      if (res.status === 200) {
        setEventData(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [id]);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <section
          id="content"
          className="p-2 py-4 py-sm-5 pt-sm-0 p-sm-5 m-md-5"
        >
          <div className="mw-1370">
            <div className="mt-4 mt-md-0">
              <div className="d-flex align-items-start justify-content-between flex-wrap">
                <div className="mb-2 me-2">
                  <h2>Upcoming Events</h2>
                  <span className="text-gray-2">
                    Take a look at all your upcoming events
                  </span>
                </div>
                <button className="btn btn-primary font-weight-500 px-3">
                  <i className="ri-calendar-event-line me-2" /> See All Event
                </button>
              </div>
            </div>
            {eventData && (
              <UpcommingEventFullWidth
                eventData={eventData}
                eventBannerImg={eventBannerImg}
                organizer={organizer}
                eventID={eventID}
                participantID={participantID}
              />
            )}

            <div className="mt-4">
              <div className="row">
                <div className="col-lg-8">
                  <CustomEventCalender />
                </div>
                <EventsAttendedSidebar />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
eventCalender.layout = "Event";
export default eventCalender;
