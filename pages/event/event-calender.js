import dynamic from "next/dynamic";
import React, { useState, useRef } from "react";
//import "../../components/styles.css";
const CustomTuiCalendar = dynamic(
  () => import("../../components/CustomTuiCalendar"),
  {
    ssr: false,
  }
);

const CustomTuiModal = dynamic(
  () => import("../../components/CustomTuiModal"),
  {
    ssr: false,
  }
);

const start = new Date();
const end = new Date(new Date().setMinutes(start.getMinutes() + 60));
const attendees = [
  {
    id: "1",
    name: "Chin",
  },
  { id: "2", name: "Khanh" },
  { id: "3", name: "Linh" },
  { id: "4", name: "Hai" },
];
const schedules = [
  {
    id: "1",
    title: "1111",
    calendarId: "1",
    category: "time",
    attendees: ["Chin"],
    isVisible: true,
    start,
    end,
    raw: {
      by: "Quinton",
      address: "Quinton, San Francisco Area",
    },
  },
  {
    id: "2",
    title: "222",
    calendarId: "2",
    category: "time",
    attendees: ["Khanh"],
    isVisible: true,
    start: "2022-04-11 11:00:00",
    end: "2022-04-11 11:30:59",
    raw: {
      by: "Quinton",
      address: "Quinton, San Francisco Area",
    },
  },
  {
    id: "3",
    title: "333",
    calendarId: "3",
    category: "time",
    attendees: ["Hai"],
    isVisible: true,
    start: new Date(new Date().setHours(start.getHours() + 2)),
    end: new Date(new Date().setHours(start.getHours() + 4)),
    raw: {
      by: "Quinton",
      address: "Quinton, San Francisco Area",
    },
  },
  {
    id: "4",
    title: "4444",
    calendarId: "4",
    category: "time",
    attendees: ["Linh"],
    isVisible: true,
    start: new Date(new Date().setHours(start.getHours() + 2)),
    end: new Date(new Date().setHours(start.getHours() + 6)),
    raw: {
      by: "Quinton",
      address: "Quinton, San Francisco Area",
    },
  },
  {
    id: "5",
    title: "555",
    calendarId: "4",
    category: "time",
    attendees: ["Linh"],
    isVisible: true,
    start: new Date(new Date().setHours(start.getHours() + 24)),
    end: new Date(new Date().setHours(start.getHours() + 9)),
    raw: {
      by: "Quinton",
      address: "Quinton, San Francisco Area",
    },
  },
];

const colors = [
  {
    id: "1",
    color: "transparent",
    bgColor: "#2fe6c926",
    dragBgColor: "#34C38F",
    borderRadius: "50px",
    borderColor: "#2fe6c9",
  },
  {
    id: "2",
    color: "transparent",
    bgColor: "#F4696A26",
    dragBgColor: "#F4696A",
    borderRadius: "50px",
    borderColor: "#F4696A",
  },
  {
    id: "3",
    color: "transparent",
    bgColor: "#00a9ff26",
    borderRadius: "50px",
    dragBgColor: "#00a9ff",
    borderColor: "#00a9ff",
  },
  {
    id: "4",
    color: "transparent",
    borderRadius: "50px",
    bgColor: "#F2B34C26",
    dragBgColor: "#F2B34C",
    borderColor: "#F2B34C",
  },
  {
    id: "5",
    color: "transparent",
    bgColor: "#74788D26",
    borderRadius: "50px",
    dragBgColor: "#74788D",
    borderColor: "#74788D",
  },
  {
    id: "6",
    color: "transparent",
    bgColor: "#343A4026",
    borderRadius: "50px",
    dragBgColor: "#343A40",
    borderColor: "#343A40",
  },
  {
    id: "7",
    color: "transparent",
    bgColor: "#FFFFFF26",
    borderRadius: "50px",
    dragBgColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
];
// default keys and styles
const themeConfig = {
  "common.border": "1px solid #e5e5e5",
  "common.backgroundColor": "white",
  "common.holiday.color": "#ff4040",
  "common.saturday.color": "#333",
  "common.dayname.color": "#333",
  "common.today.color": "#333",

  // creation guide style
  "common.creationGuide.backgroundColor": "rgba(81, 92, 230, 0.05)",
  "common.creationGuide.border": "1px solid #515ce6",

  // month header 'dayname'
  "month.dayname.height": "31px",
  "month.dayname.borderLeft": "1px solid #e5e5e5",
  "month.dayname.paddingLeft": "10px",
  "month.dayname.paddingRight": "10px",
  "month.dayname.backgroundColor": "inherit",
  "month.dayname.fontSize": "12px",
  "month.dayname.fontWeight": "normal",
  "month.dayname.textAlign": "left",

  // month day grid cell 'day'
  "month.holidayExceptThisMonth.color": "rgba(255, 64, 64, 0.4)",
  "month.dayExceptThisMonth.color": "rgba(51, 51, 51, 0.4)",
  "month.weekend.backgroundColor": "inherit",
  "month.day.fontSize": "14px",

  // month schedule style
  "month.schedule.borderRadius": "2px",
  "month.schedule.height": "24px",
  "month.schedule.marginTop": "2px",
  "month.schedule.marginLeft": "8px",
  "month.schedule.marginRight": "8px",

  // month more view
  "month.moreView.border": "1px solid #d5d5d5",
  "month.moreView.boxShadow": "0 2px 6px 0 rgba(0, 0, 0, 0.1)",
  "month.moreView.backgroundColor": "white",
  "month.moreView.paddingBottom": "17px",
  "month.moreViewTitle.height": "44px",
  "month.moreViewTitle.marginBottom": "12px",
  "month.moreViewTitle.backgroundColor": "inherit",
  "month.moreViewTitle.borderBottom": "none",
  "month.moreViewTitle.padding": "12px 17px 0 17px",
  "month.moreViewList.padding": "0 17px",

  // week header 'dayname'
  "week.dayname.height": "42px",
  "week.dayname.borderTop": "1px solid #e5e5e5",
  "week.dayname.borderBottom": "1px solid #e5e5e5",
  "week.dayname.borderLeft": "inherit",
  "week.dayname.paddingLeft": "0",
  "week.dayname.backgroundColor": "inherit",
  "week.dayname.textAlign": "left",
  "week.today.color": "#333",
  "week.pastDay.color": "#bbb",

  // week vertical panel 'vpanel'
  "week.vpanelSplitter.border": "1px solid #e5e5e5",
  "week.vpanelSplitter.height": "3px",

  // week daygrid 'daygrid'
  "week.daygrid.borderRight": "1px solid #e5e5e5",
  "week.daygrid.backgroundColor": "inherit",

  "week.daygridLeft.width": "72px",
  "week.daygridLeft.backgroundColor": "inherit",
  "week.daygridLeft.paddingRight": "8px",
  "week.daygridLeft.borderRight": "1px solid #e5e5e5",

  "week.today.backgroundColor": "rgba(81, 92, 230, 0.05)",
  "week.weekend.backgroundColor": "inherit",

  // week timegrid 'timegrid'
  "week.timegridLeft.width": "72px",
  "week.timegridLeft.backgroundColor": "inherit",
  "week.timegridLeft.borderRight": "1px solid #e5e5e5",
  "week.timegridLeft.fontSize": "11px",
  "week.timegridLeftTimezoneLabel.height": "40px",
  "week.timegridLeftAdditionalTimezone.backgroundColor": "white",

  "week.timegridOneHour.height": "52px",
  "week.timegridHalfHour.height": "26px",
  "week.timegridHalfHour.borderBottom": "none",
  "week.timegridHorizontalLine.borderBottom": "1px solid #e5e5e5",

  "week.timegrid.paddingRight": "8px",
  "week.timegrid.borderRight": "10px solid #e5e5e5",
  "week.timegridSchedule.borderRadius": "2px",
  "week.timegridSchedule.paddingLeft": "2px",

  "week.currentTime.color": "#000",
  "week.currentTime.fontSize": "11px",
  "week.currentTime.fontWeight": "normal",

  "week.pastTime.color": "#bbb",
  "week.pastTime.fontWeight": "normal",

  "week.futureTime.color": "#333",
  "week.futureTime.fontWeight": "normal",

  "week.currentTimeLinePast.border": "1px dashed #515ce6",
  "week.currentTimeLineBullet.backgroundColor": "#515ce6",
  "week.currentTimeLineToday.border": "1px solid #515ce6",
  "week.currentTimeLineFuture.border": "none",

  // week creation guide style
  "week.creationGuide.color": "#515ce6",
  "week.creationGuide.fontSize": "11px",
  "week.creationGuide.fontWeight": "bold",

  // week daygrid schedule style
  "week.dayGridSchedule.borderRadius": "2px",
  "week.dayGridSchedule.height": "24px",
  "week.dayGridSchedule.marginTop": "2px",
  "week.dayGridSchedule.marginLeft": "8px",
  "week.dayGridSchedule.marginRight": "8px",
};
const calendars = [
  {
    id: "1",
    name: "BPA Technical",
  },
  {
    id: "2",
    name: "Aqua 2 Cleaning",
  },
  {
    id: "3",
    name: "Aqua 4 Cleaning",
  },
  {
    id: "4",
    name: "Luxury 6 Cleaning",
  },
  {
    id: "5",
    name: "Luxury 6 Management",
  },
  {
    id: "6",
    name: "Aqua 3 Management",
  },
  {
    id: "7",
    name: "Aqua 2 Management",
  },
];

const EventCalender = () => {
  const [modal, setModal] = useState(false);
  const [event, setEvent] = useState(null);
  const childRef = useRef();

  const toggle = () => {
    setModal(!modal);
    setEvent(null);
  };

  function onBeforeCreateSchedule(event) {
    // console.log('onBeforeCreateSchedule', event)
    event.guide.clearGuideElement();
    setModal(true);
    setEvent(event);
  }

  function handleCreateSchedule(newEvent) {
    // call api
    const result = true;

    if (result) {
      const newSchedule = {
        ...event,
        id: schedules.length,
        title: newEvent.title,
        calendarId: newEvent.calendarId,
        category: event.isAllDay ? "allday" : "time",
        attendees: newEvent.attendees,
        isVisible: true,
        start: newEvent.start,
        end: newEvent.end,

        isAllDay: event.isAllDay,
        dueDateClass: "",
        location: event.location,
        // raw: {
        //   class: event.raw["class"]
        // },
        state: event.state,
        body: event.body,
      };

      childRef.current.createSchedule(newSchedule);
      setModal(false);
    }
  }

  function onBeforeUpdateSchedule(event) {
    // console.log('onBeforeUpdateSchedule', event)

    const { schedule, changes } = event;

    // resize & drag n drop
    if (changes) {
      // call api
      const result = true;
      if (result) {
        return childRef.current.updateSchedule(schedule, changes);
      }
    }

    setModal(true);
    setEvent(event);
  }

  async function handleUpdateSchedule(updateEvent) {
    // call api
    const result = true;

    if (result) {
      const { schedule } = event;

      // way 1: library not support
      // update api fail with attendees
      // childRef.current.updateSchedule(schedule, updateEvent)

      // way 2: stupid
      await childRef.current.deleteSchedule(schedule);

      const newSchedule = {
        ...event,
        id: schedules.length + 2,
        title: updateEvent.title,
        calendarId: updateEvent.calendarId,
        category: event.isAllDay ? "allday" : "time",
        attendees: updateEvent.attendees,
        isVisible: true,
        start: updateEvent.start,
        end: updateEvent.end,

        isAllDay: event.isAllDay,
        dueDateClass: "",
        location: event.location,
        // raw: {
        //   class: event.raw["class"]
        // },
        state: event.state,
        body: event.body,
      };

      await childRef.current.createSchedule(newSchedule);

      setModal(false);
    }
  }

  function onBeforeDeleteSchedule(event) {
    // console.log('onBeforeDeleteSchedule', event)

    // call api
    const result = true;

    if (result) {
      const { schedule } = event;
      childRef.current.deleteSchedule(schedule);
    }

    return true;
  }

  const formatCalendars = calendars.map((element) => ({
    ...colors.find((element2) => element2.id === element.id),
    ...element,
  }));

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12 mx-md-auto mx-lg-0 col-lg-12 bg-white p-5">
            <CustomTuiCalendar
              scheduleView={true}
              taskView={true}
              ref={childRef}
              {...{
                isReadOnly: true,
                showSlidebar: false,
                showMenu: true,
                taskView: false,
                scheduleView: ["time"],
                useCreationPopup: false,
                onCreate: () => {
                  console.log("create that!!!");
                  childRef.current.getAlert();
                },
                createText: "Tao moi",
                calendars: formatCalendars,
                schedules,
                /*onBeforeCreateSchedule,
                 onBeforeUpdateSchedule,
                 onBeforeDeleteSchedule,*/
              }}
            />
            {/* <CustomTuiModal
              {...{
                isOpen: modal,
                toggle,
                onSubmit:
                  event?.triggerEventName === "mouseup"
                    ? handleCreateSchedule
                    : handleUpdateSchedule,
                submitText:
                  event?.triggerEventName === "mouseup" ? "Save" : "Update",
                calendars: formatCalendars,
                attendees,
                schedule: event?.schedule,
                startDate: event?.start,
                endDate: event?.end,
              }}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};
EventCalender.layout = "Event";
export default EventCalender;
