import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { getEventsForCalender } from "../services/service";

const CustomTuiCalendar = dynamic(() => import("./CustomTuiCalendar"), {
  ssr: false,
});

const CustomTuiModal = dynamic(() => import("./CustomTuiModal"), {
  ssr: false,
});
const start = new Date();
const end = new Date(new Date().setMinutes(start.getMinutes() + 60));

// const schedules = [
//   {
//     id: "1",
//     title: "Online Free Event ",
//     calendarId: "1",
//     category: "time",
//     attendees: ["Chin"],
//     isVisible: true,
//     start,
//     end,
//     raw: {
//       by: "Quinton ",
//       address: "Quinton, San Francisco Area",
//       ticketSold: "74/80",
//     },
//   },
//   {
//     id: "2",
//     title: "Online Free Event ",
//     calendarId: "2",
//     category: "time",
//     attendees: ["Khanh"],
//     isVisible: true,
//     start: "2022-04-07 06:00:00",
//     end: "2022-04-08 06:39:59",
//     raw: {
//       by: "Quinton ",
//       address: "Quinton, San Francisco Area",
//       ticketSold: "74/80",
//     },
//   },
//   {
//     id: "3",
//     title: "Online Free Event ",
//     calendarId: "3",
//     category: "time",
//     attendees: ["Hai"],
//     isVisible: true,
//     start: new Date(new Date().setHours(start.getHours() + 2)),
//     end: new Date(new Date().setHours(start.getHours() + 2)),
//     raw: {
//       by: "Quinton ",
//       address: "Quinton, San Francisco Area",
//       ticketSold: "74/80",
//     },
//   },
//   {
//     id: "4",
//     title: "Online Free Event ",
//     calendarId: "4",
//     category: "time",
//     attendees: ["Linh"],
//     isVisible: true,
//     start: new Date(new Date().setHours(start.getHours() + 2)),
//     end: new Date(new Date().setHours(start.getHours() + 6)),
//     raw: {
//       by: "Quinton ",
//       address: "Quinton, San Francisco Area",
//       ticketSold: "74/80",
//     },
//   },
//   {
//     id: "5",
//     title: "Online Free Event ",
//     calendarId: "4",
//     category: "time",
//     attendees: ["Linh"],
//     isVisible: true,
//     start: new Date(new Date().setHours(start.getHours() + 24)),
//     end: new Date(new Date().setHours(start.getHours() + 9)),
//     raw: {
//       by: "Quinton ",
//       address: "Quinton, San Francisco Area",
//       ticketSold: "74/80",
//     },
//   },
// ];

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
  "common.saturday.color": "#9BA4BB",
  "common.dayname.color": "#9BA4BB",
  "common.today.color": "#9BA4BB",

  // creation guide style
  "common.creationGuide.backgroundColor": "rgba(81, 92, 230, 0.05)",
  "common.creationGuide.border": "1px solid #9BA4BB",

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
  "week.today.color": "#9BA4BB",
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
  "week.timegrid.borderRight": "1px solid #e5e5e5",
  "week.timegridSchedule.borderRadius": "2px",
  "week.timegridSchedule.paddingLeft": "2px",

  "week.currentTime.color": "#9BA4BB",
  "week.currentTime.fontSize": "11px",
  "week.currentTime.fontWeight": "normal",

  "week.pastTime.color": "#bbb",
  "week.pastTime.fontWeight": "normal",

  "week.futureTime.color": "#9BA4BB",
  "week.futureTime.fontWeight": "normal",

  "week.currentTimeLinePast.border": "1px dashed #9BA4BB",
  "week.currentTimeLineBullet.backgroundColor": "#9BA4BB",
  "week.currentTimeLineToday.border": "1px solid #9BA4BB",
  "week.currentTimeLineFuture.border": "none",

  // week creation guide style
  "week.creationGuide.color": "#9BA4BB",
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

export default function CustomEventCalender() {
  const [schedules, setSchedules] = useState([]);
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
        isReadOnly: true,
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
        isReadOnly: true,
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

  const tempData = [
    {
      financialInfo: {
        totalTickets: 200,
        sold: 0,
        remaining: 200,
      },
      totalParticipant: 10,
      ticket: {
        _id: "62aeb9dc9251fb45d62d3f1c",
        ticket_type: "paid",
        custom_ticket: [
          {
            _id: "62aeb9dc9251fb45d62d3f1e",
            name: "Gold",
            price: "10",
            currency: "$ USD",
            totalTickets: 100,
            sold: 0,
            createdAt: "2022-06-19T05:53:32.975Z",
            updatedAt: "2022-06-19T05:53:32.975Z",
            __v: 0,
          },
          {
            _id: "62aeb9dc9251fb45d62d3f20",
            name: "Silver",
            price: "8",
            currency: "$ USD",
            totalTickets: 100,
            sold: 0,
            createdAt: "2022-06-19T05:53:32.978Z",
            updatedAt: "2022-06-19T05:53:32.978Z",
            __v: 0,
          },
        ],
        event: "62aeb9b79251fb45d62d3f08",
        createdAt: "2022-06-19T05:53:32.973Z",
        updatedAt: "2022-06-19T05:53:32.979Z",
        __v: 0,
      },
      event_type_details: {
        _id: "62aeb9b79251fb45d62d3f06",
        createdAt: "2022-06-19T05:52:55.913Z",
        updatedAt: "2022-06-19T05:53:10.072Z",
        __v: 0,
        event_address_line1: " ",
        event_address_line2: "",
        event_city_town: "Dhaka",
        event_country: "Bangladesh",
        event_lat: "23.7492",
        event_location: "Khilgaon Model College, Dhaka, Bangladesh",
        event_long: "90.4256",
        event_postal_code: "1219",
        event_state: "Dhaka Division",
      },
      organizer: [
        {
          _id: "62aabb72e19bdc68bbe459ce",
          firstName: "Syed Shafaet",
          lastName: "Hossain",
          location: "Lalmatia,Dhaka",
        },
      ],
      data: {
        _id: "62aeb9b79251fb45d62d3f08",
        name: "Today Event physical paid ",
        description: "Today Event physical paid ",
        start_date: "2022-06-20T05:52:22.184Z",
        end_date: "2022-06-21T05:52:22.184Z",
        event_type_details: "62aeb9b79251fb45d62d3f06",
        event_status: "EVENT_CREATED",
        organizer: ["62aabb72e19bdc68bbe459ce"],
        co_organizer: ["62aeba799251fb45d62d3f5f"],
        speakers: ["62aeba799251fb45d62d3f5d"],
        sponsors: ["62aeba799251fb45d62d3f65"],
        likes: [],
        mail: [],
        invitee: [],
        participant: [],
        event_timeInputs: [],
        event_assets: [
          {
            path: "1655618059766_movie (copy).mp4",
            _id: "62aeba0c9251fb45d62d3f2c",
          },
          {
            path: "1655618060537_movie (6th copy).mp4",
            _id: "62aeba0c9251fb45d62d3f2d",
          },
          {
            path: "1655618060803_images (10).jpeg",
            _id: "62aeba0c9251fb45d62d3f2e",
          },
          {
            path: "1655618060805_images (6).jpeg",
            _id: "62aeba0c9251fb45d62d3f2f",
          },
          {
            path: "1655618060805_images (6).jpeg",
            _id: "62aeba0c9251fb45d62d3f30",
          },
        ],
        createdAt: "2022-06-19T05:52:55.927Z",
        updatedAt: "2022-06-19T07:21:11.160Z",
        __v: 0,
        total_view: 10,
        event_type: "physical",
        planned_event_type: "Film",
        total_guest: "0-20",
        ticket: "62aeb9dc9251fb45d62d3f1c",
        event_banner: "1655618061338_images (5).jpeg",
        event_banner_description:
          '<p><span class="ql-size-huge">Hello</span> world</p>',
        is_event_draft: false,
        is_scheduled: false,
        scheduled_date_time: "2022-06-19T05:56:31.906Z",
      },
    },
  ];
  const [calendarData, setCalendarData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(async () => {
    const token = localStorage.getItem("token");

    const data = {
      type: "month",
    };

    setIsLoading(true);
    const response = await getEventsForCalender(data, token);

    if (response.status === 200) {
      setSchedules(
        response.data.map((item) => {
          return {
            id: item.data._id,
            title: item.data.name,
            calendarId: "4",
            category: "time",
            attendees: ["Linh"],
            isVisible: true,
            start: item.data.start_date,
            end: item.data.end_date,

            raw: {
              by: `${item.organizer[0].firstName} ${item.organizer[0].lastName} `,
              totalParticipant: item.totalParticipant,
              address: item.event_type_details.event_location,
              ticketSold: `${item.financialInfo.sold} / ${item.financialInfo.totalTickets}`,
            },
          };
        })
      );
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {/* <p>{JSON.stringify(schedules)}</p> */}
      {!isLoading && (
        <>
          {/* {JSON.stringify(schedules)} */}
          <div className="bg-white p-4 rounded">
            <CustomTuiCalendar
              ref={childRef}
              {...{
                showSlidebar: false,
                showMenu: true,
                taskView: false,
                isReadOnly: true,
                scheduleView: ["time"],
                useCreationPopup: false,
                onCreate: () => {
                  console.log("create that!!!");
                  childRef.current.getAlert();
                },
                createText: "Tao moi",
                calendars: formatCalendars,
                // calendarData,
                schedules,
                /*onBeforeCreateSchedule,
            onBeforeUpdateSchedule,
            onBeforeDeleteSchedule,*/
              }}
            />
          </div>
        </>
      )}
    </>
  );
}
