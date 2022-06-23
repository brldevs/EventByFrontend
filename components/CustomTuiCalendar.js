import React, {
  useRef,
  useLayoutEffect,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import TuiCalendar from "tui-calendar";
import moment from "moment";
import "tui-calendar/dist/tui-calendar.css";
import { Col, Row, Button, Modal } from "react-bootstrap";
import MyEventItem from "./Event/EventDashboard/MyEventItem";
import OnsaleFalg from "./Event/EventDashboard/OnSaleFlag";
import Link from "next/link";
import { format } from "date-fns";
import UserProgressBar from "./Event/EventDashboard/UserProgressBar";

const CustomTuiCalendar = forwardRef(
  (
    {
      height = "auto",
      defaultView = "week",
      calendars = [],
      schedules = [],
      isReadOnly = true,
      showSlidebar = false,
      showMenu = false,
      onCreate,
      createText = "New schedule",
      onBeforeCreateSchedule = () => false,
      onBeforeUpdateSchedule = () => false,
      onBeforeDeleteSchedule = () => false,
      ...rest
    },
    ref
  ) => {
    const calendarInstRef = useRef(null);
    const tuiRef = useRef(null);
    const wrapperRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [renderRange, setRenderRange] = useState("");
    const [workweek, setWorkweek] = useState(true);
    const [narrowWeekend, setNarrowWeekend] = useState(true);
    const [startDayOfWeek, setStartDayOfWeek] = useState(1);
    const [type, setType] = useState("Weekly");
    const [checkedCalendars, setCheckedCalendars] = useState(
      calendars.map((element) => ({ ...element, isChecked: true }))
    );
    const [filterSchedules, setFilterSchedules] = useState(schedules);
    const [show, setShow] = useState(false);
    const [selectschedule, setSelectschedule] = useState({});
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    setShow;
    useImperativeHandle(ref, () => ({
      getAlert() {
        alert("getAlert from Child");
      },
      createSchedule,
      updateSchedule,
      deleteSchedule,
    }));
    const themeConfig = {
      "common.border": "1px dashed #e5e5e5",
      "common.backgroundColor": "white",
      "common.holiday.color": "#9BA4BB",
      "common.saturday.color": "#9BA4BB",
      "common.dayname.color": "#9BA4BB",
      "common.today.color": "#9BA4BB",

      // creation guide style
      "common.creationGuide.backgroundColor": "rgba(81, 92, 230, 0.05)",
      "common.creationGuide.border": "1px dashed #515ce6",

      // month header 'dayname'
      "month.dayname.height": "31px",
      "month.dayname.borderLeft": "1px dashed #e5e5e5",
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
      "month.moreView.border": "1px dashed #d5d5d5",
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
      "week.dayname.borderTop": "1px dashed #e5e5e5",
      "week.dayname.borderBottom": "1px dashed #e5e5e5",
      "week.dayname.borderLeft": "inherit",
      "week.dayname.paddingLeft": "0",
      "week.dayname.backgroundColor": "inherit",
      "week.dayname.textAlign": "left",
      "week.today.color": "#9BA4BB",
      "week.pastDay.color": "#9BA4BB",

      // week vertical panel 'vpanel'
      "week.vpanelSplitter.border": "1px dashed #e5e5e5",
      "week.vpanelSplitter.height": "3px",

      // week daygrid 'daygrid'
      "week.daygrid.borderRight": "1px dashed #e5e5e5",
      "week.daygrid.backgroundColor": "inherit",

      "week.daygridLeft.width": "72px",
      "week.daygridLeft.backgroundColor": "inherit",
      "week.daygridLeft.paddingRight": "8px",
      "week.daygridLeft.borderRight": "1px dashed #e5e5e5",

      "week.today.backgroundColor": "rgba(81, 92, 230, 0.05)",
      "week.weekend.backgroundColor": "inherit",

      // week timegrid 'timegrid'
      "week.timegridLeft.width": "72px",
      "week.timegridLeft.backgroundColor": "inherit",
      "week.timegridLeft.borderRight": "1px dashed #e5e5e5",
      "week.timegridLeft.fontSize": "11px",
      "week.timegridLeftTimezoneLabel.height": "40px",
      "week.timegridLeftAdditionalTimezone.backgroundColor": "white",

      "week.timegridOneHour.height": "52px",
      "week.timegridHalfHour.height": "26px",
      "week.timegridHalfHour.borderBottom": "none",
      "week.timegridHorizontalLine.borderBottom": "1px dashed #e5e5e5",

      "week.timegrid.paddingRight": "8px",
      "week.timegrid.borderRight": "1px dashed #e5e5e5",
      "week.timegridSchedule.borderRadius": "2px",
      "week.timegridSchedule.paddingLeft": "2px",

      "week.currentTime.color": "#9BA4BB",
      "week.currentTime.fontSize": "11px",
      "week.currentTime.fontWeight": "normal",

      "week.pastTime.color": "#bbb",
      "week.pastTime.fontWeight": "normal",

      "week.futureTime.color": "#9BA4BB",
      "week.futureTime.fontWeight": "normal",

      "week.currentTimeLinePast.border": "1px dashed #515ce6",
      "week.currentTimeLineBullet.backgroundColor": "#515ce6",
      "week.currentTimeLineToday.border": "1px dashed #515ce6",
      "week.currentTimeLineFuture.border": "none",

      // week creation guide style
      "week.creationGuide.color": "#9BA4BB",
      "week.creationGuide.fontSize": "11px",
      "week.creationGuide.fontWeight": "bold",

      // week daygrid schedule style
      "week.dayGridSchedule.borderRadius": "200px",
      "week.dayGridSchedule.height": "24px",
      "week.dayGridSchedule.marginTop": "2px",
      "week.dayGridSchedule.marginLeft": "8px",
      "week.dayGridSchedule.marginRight": "8px",
    };
    useEffect(() => {
      calendarInstRef.current = new TuiCalendar(tuiRef.current, {
        useDetailPopup: false,
        useCreationPopup: false,
        template: {
          milestone: function (schedule) {
            return (
              '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' +
              schedule.bgColor +
              '">' +
              schedule.title +
              "</span>"
            );
          },
          milestoneTitle: function () {
            return '<span class="tui-full-calendar-left-content">MILESTONE</span>';
          },
          task: function (schedule) {
            return "#" + schedule.title;
          },
          taskTitle: function () {
            return '<span class="tui-full-calendar-left-content">TASK</span>';
          },
          allday: function (schedule) {
            return _getTimeTemplate(schedule, true);
          },
          alldayTitle: function () {
            return '<span class="tui-full-calendar-left-content">ALL DAY</span>';
          },
          time: function (schedule) {
            return _getTimeTemplate(schedule, false);
          },
          goingDuration: function (schedule) {
            return (
              '<span class="calendar-icon ic-travel-time"></span>' +
              schedule.goingDuration +
              "min."
            );
          },
          comingDuration: function (schedule) {
            return (
              '<span class="calendar-icon ic-travel-time"></span>' +
              schedule.comingDuration +
              "min."
            );
          },
          monthMoreTitleDate: function (date, dayname) {
            var day = date.split(".")[2];

            return (
              '<span class="tui-full-calendar-month-more-title-day">' +
              day +
              '</span> <span class="tui-full-calendar-month-more-title-day-label">' +
              dayname +
              "</span>"
            );
          },
          monthMoreClose: function () {
            return '<span class="tui-full-calendar-icon tui-full-calendar-ic-close"></span>';
          },
          monthGridHeader: function (dayModel) {
            var date = parseInt(dayModel.date.split("-")[2], 10);
            var classNames = ["tui-full-calendar-weekday-grid-date "];

            if (dayModel.isToday) {
              classNames.push("tui-full-calendar-weekday-grid-date-decorator");
            }

            return (
              '<span class="' + classNames.join(" ") + '">' + date + "</span>"
            );
          },
          monthGridHeaderExceed: function (hiddenSchedules) {
            return (
              '<span class="weekday-grid-more-schedules">+' +
              hiddenSchedules +
              "</span>"
            );
          },
          monthGridFooter: function () {
            return "";
          },
          monthGridFooterExceed: function (hiddenSchedules) {
            return "";
          },
          monthDayname: function (model) {
            return model.label.toString().toLocaleUpperCase();
          },
          weekDayname: function (model) {
            return (
              '<span class="tui-full-calendar-dayname-name line-height-22 text-gray-2 text-uppercase d-inline-block w-100">' +
              model.dayName +
              '</span>&nbsp;&nbsp;&nbsp;<span class="tui-full-calendar-dayname-date line-height-0 d-inline-block  w-100">' +
              model.date +
              "</span>"
            );
          },
          weekGridFooterExceed: function (hiddenSchedules) {
            return "+" + hiddenSchedules;
          },
          dayGridTitle: function (viewName) {
            // use another functions instead of 'dayGridTitle'
            // milestoneTitle: function() {...}
            // taskTitle: function() {...}
            // alldayTitle: function() {...}

            var title = "";
            switch (viewName) {
              case "milestone":
                title =
                  '<span class="tui-full-calendar-left-content">MILESTONE</span>';
                break;
              case "task":
                title =
                  '<span class="tui-full-calendar-left-content">TASK</span>';
                break;
              case "allday":
                title =
                  '<span class="tui-full-calendar-left-content">ALL DAY</span>';
                break;
              default:
                break;
            }

            return title;
          },
          // schedule: function(schedule) {
          //   // use another functions instead of 'schedule'
          //   // milestone: function() {...}
          //   // task: function() {...}
          //   // allday: function() {...}

          //   var tpl;

          //   switch (category) {
          //     case "milestone":
          //       tpl =
          //         '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' +
          //         schedule.bgColor +
          //         '">' +
          //         schedule.title +
          //         "</span>";
          //       break;
          //     case "task":
          //       tpl = "#" + schedule.title;
          //       break;
          //     case "allday":
          //       tpl = _getTimeTemplate(schedule, true);
          //       break;
          //     default:
          //       break;
          //   }

          //   return tpl;
          // },
          collapseBtnTitle: function () {
            return '<span class="tui-full-calendar-icon tui-full-calendar-ic-arrow-solid-top"></span>';
          },
          // timezoneDisplayLabel: function(timezoneOffset, displayLabel) {
          //   var gmt, hour, minutes;

          //   if (!displayLabel) {
          //     gmt = timezoneOffset < 0 ? "-" : "+";
          //     hour = Math.abs(parseInt(timezoneOffset / 60, 10));
          //     minutes = Math.abs(timezoneOffset % 60);
          //     displayLabel = gmt + getPadStart(hour) + ":" + getPadStart(minutes);
          //   }

          //   return displayLabel;
          // },
          timegridDisplayPrimayTime: function (time) {
            // will be deprecated. use 'timegridDisplayPrimaryTime'
            var meridiem = "am";
            var hour = time.hour;

            if (time.hour > 12) {
              meridiem = "pm";
              hour = time.hour - 12;
            }

            return hour + " " + meridiem;
          },
          timegridDisplayPrimaryTime: function (time) {
            var meridiem = "am";
            var hour = time.hour;

            if (time.hour > 12) {
              meridiem = "pm";
              hour = time.hour - 12;
            }

            return hour + " " + meridiem;
          },
          // timegridDisplayTime: function(time) {
          //   return getPadStart(time.hour) + ":" + getPadStart(time.hour);
          // },
          timegridCurrentTime: function (timezone) {
            var templates = [];

            if (timezone.dateDifference) {
              templates.push(
                "[" +
                  timezone.dateDifferenceSign +
                  timezone.dateDifference +
                  "]<br>"
              );
            }

            templates.push(moment(timezone.hourmarker).format("HH:mm a"));

            return templates.join("");
          },
          popupIsAllDay: function () {
            return "All Day";
          },
          popupStateFree: function () {
            return "Free";
          },
          popupStateBusy: function () {
            return "Busy";
          },
          titlePlaceholder: function () {
            return "Subject";
          },
          locationPlaceholder: function () {
            return "Location";
          },
          startDatePlaceholder: function () {
            return "Start date";
          },
          endDatePlaceholder: function () {
            return "End date";
          },
          popupSave: function () {
            return "Save";
          },
          popupUpdate: function () {
            return "Update";
          },
          popupDetailDate: function (isAllDay, start, end) {
            var isSameDate = moment(start).isSame(end);
            var endFormat = (isSameDate ? "" : "YYYY/MM/DD ") + "HH:mm";

            if (isAllDay) {
              return (
                moment(start).format("YYYY/MM/DD") +
                (isSameDate ? "" : " - " + moment(end).format("YYYY/MM/DD"))
              );
            }

            return (
              moment(start.toDate()).format("YYYY/MM/DD HH:mm") +
              " - " +
              moment(end.toDate()).format(endFormat)
            );
          },
          popupDetailLocation: function (schedule) {
            return "Location : " + schedule.location;
          },
          // popupDetailUser: function (schedule) {
          // 	return 'Staff : ' + (schedule.attendees || []).join(', ')
          // },
          popupDetailState: function (schedule) {
            return "State : " + schedule.state || "Busy";
          },
          popupDetailRepeat: function (schedule) {
            return "Repeat : " + schedule.recurrenceRule;
          },
          popupDetailBody: function (schedule) {
            return "Body : " + schedule.body;
          },
          popupEdit: function () {
            return "Edit";
          },
          popupDelete: function () {
            return "Delete";
          },
        },
        theme: themeConfig,
        // template: {
        //   time: function(schedule) {
        //     // console.log(schedule);
        //     return _getTimeTemplate(schedule, false);
        //   }
        // },
        calendars,
        ...rest,
      });
      setRenderRangeText();
      // render schedules
      calendarInstRef.current.clear();
      calendarInstRef.current.createSchedules(filterSchedules, true);
      calendarInstRef.current.render();

      calendarInstRef.current.on("beforeCreateSchedule", function (event) {
        onBeforeCreateSchedule(event);
        setShow(false);
      });
      calendarInstRef.current.on("beforeUpdateSchedule", function (event) {
        onBeforeUpdateSchedule(event);
        setShow(false);
      });
      calendarInstRef.current.on("beforeDeleteSchedule", function (event) {
        onBeforeDeleteSchedule(event);
        setShow(false);
      });
      calendarInstRef.current.on("clickSchedule", function (event) {
        console.log(event);
        // var schedule = event.schedule;
        setSelectschedule(event);
        setShow(true);
        // console.log(
        //   " pageX" +
        //     event.event.pageX +
        //     "event.schedule.pageY" +
        //     event.event.pageY +
        //     "  -----"
        // );

        // JSON.stringify(selectschedule);
        //const guideElemenet = schedule.guide.guideElement;
      });
      calendarInstRef.current.on("clickDayname", function (event) {
        // console.log("clickDayname", event);
        if (calendarInstRef.current.getViewName() === "week") {
          calendarInstRef.current.setDate(new Date(event.date));
          calendarInstRef.current.changeView("day", true);
        }
        setShow(false);
      });

      calendarInstRef.current.on("clickMore", function (event) {
        // console.log("clickMore", event.date, event.target);
        setShow(false);
      });

      calendarInstRef.current.on("clickTimezonesCollapseBtn", function (
        timezonesCollapsed
      ) {
        // console.log(timezonesCollapsed);
      });

      calendarInstRef.current.on("afterRenderSchedule", function (event) {
        // var schedule = event.schedule;
        // var element = calendarInstRef.current.getElement(
        //   schedule.id,
        //   schedule.calendarId
        // );
        // use the element
        // console.log(element);
        setShow(false);
      });

      return () => {
        calendarInstRef.current.destroy();
      };
    }, [tuiRef, schedules]);

    useLayoutEffect(() => {
      // console.log("before render");
    });

    function currentCalendarDate(format) {
      var currentDate = moment([
        calendarInstRef.current.getDate().getFullYear(),
        calendarInstRef.current.getDate().getMonth(),
        calendarInstRef.current.getDate().getDate(),
      ]);

      return currentDate.format(format);
    }

    function setRenderRangeText() {
      var options = calendarInstRef.current.getOptions();
      var viewName = calendarInstRef.current.getViewName();

      var html = [];
      if (viewName === "day") {
        html.push(currentCalendarDate("YYYY.MM.DD"));
      } else if (
        viewName === "month" &&
        (!options.month.visibleWeeksCount ||
          options.month.visibleWeeksCount > 4)
      ) {
        html.push(currentCalendarDate("YYYY.MM"));
      } else {
        html.push(
          moment(calendarInstRef.current.getDateRangeStart().getTime()).format(
            "YYYY.MM.DD"
          )
        );
        html.push(" ~ ");
        html.push(
          moment(calendarInstRef.current.getDateRangeEnd().getTime()).format(
            " MM.DD"
          )
        );
      }
      setRenderRange(html.join(""));
    }

    function _getTimeTemplate(schedule, isAllDay) {
      var html = [];

      if (!isAllDay) {
        html.push(
          "<strong>" +
            moment(schedule.start.toDate()).format("HH:mm") +
            "</strong> "
        );
      }
      if (schedule.isPrivate) {
        html.push('<span class="calendar-font-icon ic-lock-b"></span>');
        html.push(" Private");
      } else {
        if (schedule.isReadOnly) {
          html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
        } else if (schedule.recurrenceRule) {
          html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
        } else if (schedule.attendees.length) {
          html.push('<span class="calendar-font-icon ic-user-b"></span>');
        } else if (schedule.location) {
          html.push('<span class="calendar-font-icon ic-location-b"></span>');
        }

        html.push(" " + schedule.title);
      }

      return html.join("");
    }

    useEffect(() => {
      document.addEventListener("click", handleClick, false);

      return () => {
        document.removeEventListener("click", handleClick, false);
      };
    });

    const handleClick = (e) => {
      if (wrapperRef.current?.contains(e.target)) {
        // inside click
        // console.log("inside");
        return;
      }
      // outside click
      // ... do whatever on click outside here ...
      // console.log("outside");
      setOpen(false);
    };

    const handleAllChecked = (event) => {
      const cloneCheckedCalendars = [...checkedCalendars];
      cloneCheckedCalendars.forEach(
        (element) => (element.isChecked = event.target.checked)
      );
      setCheckedCalendars(cloneCheckedCalendars);
      filterCalendar(cloneCheckedCalendars);
    };

    const handleCheckChildElement = (event) => {
      const cloneCheckedCalendars = [...checkedCalendars];
      cloneCheckedCalendars.forEach((element) => {
        if (element.id === event.target.value)
          element.isChecked = event.target.checked;
      });
      setCheckedCalendars(cloneCheckedCalendars);
      filterCalendar(cloneCheckedCalendars);
    };

    const filterCalendar = (cloneCheckedCalendars) => {
      const filterCalendars = cloneCheckedCalendars
        .filter((element) => element.isChecked === false)
        .map((item) => item.id);
      const cloneSchedules = filterSchedules.filter((element) => {
        return filterCalendars.indexOf(element.calendarId) === -1;
      });

      // rerender
      calendarInstRef.current.clear();
      calendarInstRef.current.createSchedules(cloneSchedules, true);
      calendarInstRef.current.render();
    };

    // const capitalizeFirstLetter = (value = "") => {
    //   return [...value[0].toUpperCase(), ...value.slice(1)].join("");
    // };

    function createSchedule(schedule) {
      console.log("createSchedule");

      calendarInstRef.current.createSchedules([schedule]);
      const cloneFilterSchedules = [...filterSchedules];
      setFilterSchedules((prevState) => [...cloneFilterSchedules, schedule]);
    }

    function updateSchedule(schedule, changes) {
      console.log("updateSchedule");

      calendarInstRef.current.updateSchedule(
        schedule.id,
        schedule.calendarId,
        changes
      );
      const cloneFilterSchedules = [...filterSchedules];
      setFilterSchedules((prevState) =>
        cloneFilterSchedules.map((item) => {
          if (item.id === schedule.id) {
            return { ...item, ...changes };
          }
          return item;
        })
      );
    }

    function deleteSchedule(schedule) {
      console.log("deleteSchedule");

      calendarInstRef.current.deleteSchedule(schedule.id, schedule.calendarId);
      const cloneFilterSchedules = [...filterSchedules];
      setFilterSchedules((prevState) =>
        cloneFilterSchedules.filter((item) => item.id !== schedule.id)
      );
    }

    const [organizerId, setOrganizerId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem("token");

      if (accessToken) {
        const result = await JSON.parse(localStorage.getItem("result"));
        if (result.id) {
          setOrganizerId(result.id);
          setIsLoading(false);
        }
        setIsLoading(false);
      }
    }, []);

    return (
      <div>
        {showSlidebar && (
          <div id="lnb">
            {onCreate && (
              <div className="lnb-new-schedule">
                <button
                  id="btn-new-schedule"
                  type="button"
                  className="btn btn-default btn-block lnb-new-schedule-btn"
                  data-toggle="modal"
                  onClick={onCreate}
                >
                  {createText}
                </button>
              </div>
            )}
            <div id="lnb-calendars" className="lnb-calendars">
              <div>
                <div className="lnb-calendars-item">
                  <label>
                    <input
                      className="tui-full-calendar-checkbox-square"
                      type="checkbox"
                      defaultValue="all"
                      checked={checkedCalendars.every(
                        (element) => element.isChecked === true
                      )}
                      onChange={handleAllChecked}
                    />
                    <span />
                    <strong>View all</strong>
                  </label>
                </div>
              </div>
              <div id="calendarList" className="lnb-calendars-d1">
                {checkedCalendars.map((element, i) => {
                  return (
                    <div key={i} className="lnb-calendars-item">
                      <label>
                        <input
                          type="checkbox"
                          className="tui-full-calendar-checkbox-round"
                          defaultValue={element.id}
                          checked={element.isChecked}
                          onChange={handleCheckChildElement}
                        />
                        <span
                          style={{
                            borderColor: element.bgColor,
                            backgroundColor: element.isChecked
                              ? element.bgColor
                              : "transparent",
                          }}
                        />
                        <span>{element.name}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="lnb-footer">© NHN Corp.</div>
          </div>
        )}

        <div id="right" style={{ left: !showSlidebar && 0 }}>
          {showMenu && (
            <div className="mb-2">
              <Row className="row justify-content-md-rught">
                <div className="col-lg-6">
                  {/* <span
                    id="renderRange"
                    className="render-range btn btn-outline-primary btn-sm p-2 text-primary"
                  >
                    {renderRange}
                  </span> */}
                </div>

                <div className="col-lg-3">
                  {/* <span id="menu-navi">
                    <button
                      type="button"
                      className="btn btn-default btn-sm move-today py-2 px-4 border-0"
                      style={{ marginRight: "4px" }}
                      data-action="move-today"
                      onClick={() => {
                        // console.log("today");
                        calendarInstRef.current.today();
                        setRenderRangeText();
                      }}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      className="btn btn-default btn-sm move-day pt-2 pb-2 border-0"
                      style={{ marginRight: "4px" }}
                      data-action="move-prev"
                      onClick={() => {
                        // console.log("pre");
                        calendarInstRef.current.prev();
                        setRenderRangeText();
                      }}
                    >
                      <i
                        className="calendar-icon ic-arrow-line-left"
                        data-action="move-prev"
                      />
                    </button>
                    <button
                      type="button"
                      className="btn btn-default btn-sm move-day pt-2 pb-2 border-0"
                      style={{ marginRight: "4px" }}
                      data-action="move-next"
                      onClick={() => {
                        // console.log("next");
                        calendarInstRef.current.next();
                        setRenderRangeText();
                      }}
                    >
                      <i
                        className="calendar-icon ic-arrow-line-right"
                        data-action="move-next"
                      />
                    </button>
                  </span> */}
                </div>
                <div className="col-lg-3">
                  <span
                    ref={wrapperRef}
                    className={`dropdown ${open && "open"}`}
                  >
                    <button
                      id="dropdownMenu-calendarType"
                      className="btn btn-default btn-sm form-select p-2 select-range"
                      type="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded={open}
                      onClick={() => setOpen(!open)}
                    >
                      <span id="calendarTypeName ">{type}</span>&nbsp;
                    </button>
                    <ul
                      className="dropdown-menu"
                      role="menu"
                      aria-labelledby="dropdownMenu-calendarType"
                      style={{ width: "194px", marginTop: "7px" }}
                    >
                      <li role="presentation">
                        <a
                          href="/"
                          onClick={(e) => {
                            e.preventDefault();
                            calendarInstRef.current.changeView("day", true);
                            setType("Daily");
                            setOpen(false);
                          }}
                          className="dropdown-menu-title dropdown-item"
                          role="menuitem"
                          data-action="toggle-daily"
                        >
                          <span className="text-info">Daily</span>
                        </a>
                      </li>
                      <li role="presentation">
                        <a
                          href="/"
                          onClick={(e) => {
                            e.preventDefault();
                            calendarInstRef.current.changeView("week", true);
                            setType("Weekly");
                            setOpen(false);
                          }}
                          className="dropdown-menu-title dropdown-item"
                          role="menuitem"
                          data-action="toggle-weekly"
                        >
                          <span>Weekly</span>
                          <span className="icon">
                            <i className="ri-check-line"></i>
                          </span>
                        </a>
                      </li>
                      <li role="presentation">
                        <a
                          href="/"
                          onClick={(e) => {
                            e.preventDefault();
                            calendarInstRef.current.setOptions(
                              { month: { visibleWeeksCount: 6 } },
                              true
                            ); // or null
                            calendarInstRef.current.changeView("month", true);
                            setType("Monthly");
                            setOpen(false);
                          }}
                          className="dropdown-menu-title dropdown-item"
                          role="menuitem"
                          data-action="toggle-monthly"
                        >
                          <span>Monthly</span>
                        </a>
                      </li>
                      {/* <li role="presentation">
                        <a
                          href="/"
                          onClick={(e) => {
                            e.preventDefault();
                            calendarInstRef.current.setOptions(
                              { month: { visibleWeeksCount: 2 } },
                              true
                            ); // or null
                            calendarInstRef.current.changeView("month", true);
                            setType("2 weeks");
                            setOpen(false);
                          }}
                          className="dropdown-menu-title dropdown-item"
                          role="menuitem"
                          data-action="toggle-weeks2"
                        >
                          <span>2 weeks</span>
                        </a>
                      </li>
                      <li role="presentation">
                        <a
                          href="/"
                          onClick={(e) => {
                            e.preventDefault();
                            calendarInstRef.current.setOptions(
                              { month: { visibleWeeksCount: 3 } },
                              true
                            ); // or null
                            calendarInstRef.current.changeView("month", true);
                            setType("3 weeks");
                            setOpen(false);
                          }}
                          className="dropdown-menu-title dropdown-item"
                          role="menuitem"
                          data-action="toggle-weeks3"
                        >
                          <span>3 weeks</span>
                        </a>
                      </li> */}
                      {/* <li role="presentation" className="dropdown-divider" />
                      <li role="presentation ms-2">
                        <a
                          href="/"
                          onClick={(e) => {
                            e.preventDefault();
                            calendarInstRef.current.setOptions(
                              { month: { workweek } },
                              true
                            );
                            calendarInstRef.current.setOptions(
                              { week: { workweek } },
                              true
                            );
                            calendarInstRef.current.changeView(
                              calendarInstRef.current.getViewName(),
                              true
                            );
                            setWorkweek(!workweek);
                            setOpen(false);
                          }}
                          role="menuitem"
                          data-action="toggle-workweek"
                        >
                          <input
                            type="checkbox"
                            className="tui-full-calendar-checkbox-square"
                            checked={workweek}
                            onChange={() => {}}
                          />
                          <span className="checkbox-title " />
                          Show weekends
                        </a>
                      </li>
                      <li role="presentation">
                        <a
                          href="/"
                          onClick={(e) => {
                            e.preventDefault();
                            calendarInstRef.current.setOptions(
                              { week: { startDayOfWeek } },
                              true
                            );
                            calendarInstRef.current.setOptions(
                              { month: { startDayOfWeek } },
                              true
                            );
                            calendarInstRef.current.changeView(
                              calendarInstRef.current.getViewName(),
                              true
                            );
                            setStartDayOfWeek(startDayOfWeek === 1 ? 0 : 1);
                            setOpen(false);
                          }}
                          role="menuitem"
                          data-action="toggle-start-day-1"
                        >
                          <input
                            type="checkbox"
                            className="tui-full-calendar-checkbox-square"
                            checked={startDayOfWeek !== 1 ? true : false}
                            onChange={() => {}}
                          />
                          <span className="checkbox-title" />
                          Start Week on Monday
                        </a>
                      </li>
                      <li role="presentation">
                        <a
                          href="/"
                          onClick={(e) => {
                            e.preventDefault();
                            calendarInstRef.current.setOptions(
                              { month: { narrowWeekend } },
                              true
                            );
                            calendarInstRef.current.setOptions(
                              { week: { narrowWeekend } },
                              true
                            );
                            calendarInstRef.current.changeView(
                              calendarInstRef.current.getViewName(),
                              true
                            );
                            setNarrowWeekend(!narrowWeekend);
                            setOpen(false);
                          }}
                          role="menuitem"
                          data-action="toggle-narrow-weekend"
                        >
                          <input
                            type="checkbox"
                            className="tui-full-calendar-checkbox-square"
                            checked={narrowWeekend}
                            onChange={() => {}}
                          />
                          <span className="checkbox-title" />
                          Narrower than weekdays
                        </a>
                      </li> */}
                    </ul>
                  </span>
                </div>
              </Row>
              {show && (
                <div
                  className="grid-event "
                  style={{
                    position: "absolute",
                    top: selectschedule.event.pageY,
                    zIndex: "9999",
                    width: "417px",
                    left: selectschedule.event.pageX,
                  }}
                >
                  <div className="event-item">
                    {/* <div className="image">
                <img
                  src="https://www.eventby.xyz/backend/api/event/getEventBannerById/624d45dad0879189bd3af7d3"
                  className="w-100 d-block border-radius-10"
                  alt="banner_img"
                />
                <span className="online-btn">Online</span>
              </div> */}
                    <div className="event-content">
                      <div className="all-content shadow">
                        <div className="texts">
                          {/* {JSON.stringify(selectschedule.schedule.)} */}
                          <div className="date-and-option">
                            <div className="date text-gray-2 font-12">
                              <span className="me-3">
                                <i className="ri-checkbox-blank-circle-fill text-secondary me-1" />
                                {selectschedule.schedule.is_event_draft
                                  ? "Drafted"
                                  : "On Sale"}
                              </span>
                              <span>
                                <i className="ri-calendar-check-line me-1" />
                                {/* July 23, 2022{" "} */}
                                {format(
                                  new Date(selectschedule.schedule.start),
                                  "MMMM dd, yyyy"
                                )}
                              </span>
                            </div>
                            <span
                              className="badge"
                              style={{
                                backgroundColor: "rgba(250, 131, 133, 0.1)",
                                color: "#FB8284",
                                marginTop: "-7px",
                              }}
                            >
                              {/* Recurring */}
                            </span>
                            <div className="dropdown dropdown-dashboard">
                              <i
                                className="ri-more-2-fill"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{ color: "rgb(180, 187, 204)" }}
                              />
                              <ul
                                className="dropdown-menu"
                                aria-labelledby="dropdownMenuButton1"
                              >
                                <li>
                                  <Link
                                    href={`/event/${selectschedule.schedule.id}`}
                                  >
                                    <a
                                      target="_blank"
                                      className="dropdown-item"
                                    >
                                      <span>View Event</span>
                                      <span className="icon">
                                        <i className="ri-check-line" />
                                      </span>
                                    </a>
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={`/organizer/eventOverView/${selectschedule.schedule.id}`}
                                  >
                                    <a
                                      target="_blank"
                                      className="dropdown-item"
                                    >
                                      <span>Manage Event</span>
                                      <span className="icon">
                                        <i className="ri-check-line" />
                                      </span>
                                    </a>
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={`/event/${selectschedule.schedule.id}`}
                                  >
                                    <a
                                      target="_blank"
                                      className="dropdown-item"
                                    >
                                      <span>Share Event</span>
                                      <span className="icon">
                                        <i className="ri-check-line" />
                                      </span>
                                    </a>
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={`/organizer/eventattendees/${selectschedule.schedule.id}`}
                                  >
                                    <a
                                      target="_blank"
                                      className="dropdown-item"
                                    >
                                      <span>Event Invitee</span>
                                      <span className="icon">
                                        <i className="ri-check-line" />
                                      </span>
                                    </a>
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={`/organizer/eventparticipants/${selectschedule.schedule.id}`}
                                  >
                                    <a
                                      target="_blank"
                                      className="dropdown-item"
                                    >
                                      <span>Event Participant</span>
                                      <span className="icon">
                                        <i className="ri-check-line" />
                                      </span>
                                    </a>
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <h6 className="font-18 title font-weight-500">
                            {selectschedule.schedule.title}
                          </h6>
                          <div className="quinton">
                            <span className="text-gray-2">By:</span>
                            <span className="font-weight-500 text-dark">
                              {selectschedule.schedule.raw.by}
                            </span>
                            <span className="text-gray-2">
                              {selectschedule.schedule.raw.address}
                            </span>
                          </div>
                        </div>
                        <div className="upcoming-event mt-3 flex-wrap d-flex align-items-center justify-content-between">
                          {selectschedule.schedule.totalParticipant > 0 ? (
                            <>
                              <div className="d-flex flex-wrap align-items-center mb-2">
                                <div className="followers me-2 mb-2">
                                  {selectschedule.schedule.totalParticipant ===
                                    1 && (
                                    <span className="d-inline-block rounded-circle">
                                      <img src="/img/organizer_1.png" />
                                    </span>
                                  )}

                                  {selectschedule.schedule.totalParticipant ===
                                    2 && (
                                    <>
                                      <span className="d-inline-block rounded-circle">
                                        <img src="/img/organizer_1.png" />
                                      </span>
                                      <span className="d-inline-block rounded-circle">
                                        <img src="/img/organizer_2.png" />
                                      </span>
                                    </>
                                  )}

                                  {selectschedule.schedule.totalParticipant ===
                                    3 && (
                                    <>
                                      <span className="d-inline-block rounded-circle">
                                        <img src="/img/organizer_1.png" />
                                      </span>
                                      <span className="d-inline-block rounded-circle">
                                        <img src="/img/organizer_2.png" />
                                      </span>
                                      <span className="d-inline-block rounded-circle">
                                        <img src="/img/organizer_3.png" />
                                      </span>
                                    </>
                                  )}

                                  {selectschedule.schedule.totalParticipant ===
                                    4 && (
                                    <>
                                      <span className="d-inline-block rounded-circle">
                                        <img src="/img/organizer_1.png" />
                                      </span>
                                      <span className="d-inline-block rounded-circle">
                                        <img src="/img/organizer_2.png" />
                                      </span>
                                      <span className="d-inline-block rounded-circle">
                                        <img src="/img/organizer_3.png" />
                                      </span>
                                      <span className="d-inline-block rounded-circle">
                                        <img src="/img/organizer_4.png" />
                                      </span>
                                    </>
                                  )}
                                  {selectschedule.schedule.totalParticipant >
                                    4 && (
                                    <>
                                      <span className="d-inline-block rounded-circle">
                                        <img src="/img/organizer_1.png" />
                                      </span>
                                      <span className="d-inline-block rounded-circle">
                                        <img src="/img/organizer_2.png" />
                                      </span>
                                      <span className="d-inline-block rounded-circle">
                                        <img src="/img/organizer_3.png" />
                                      </span>
                                      <span className="d-inline-block rounded-circle">
                                        <img src="/img/organizer_4.png" />
                                      </span>
                                    </>
                                  )}
                                </div>
                                <span className="font-10 text-gray-2">
                                  {selectschedule.schedule.totalParticipant >
                                  500
                                    ? `${selectschedule.schedule.totalParticipant}+ More`
                                    : selectschedule.schedule.totalParticipant}
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="d-flex flex-wrap align-items-center mb-2">
                                <div className="followers me-2 mb-2"></div>
                              </div>
                            </>
                          )}
                          <div>
                            <span
                              className="font-weight-500"
                              style={{
                                color: "rgb(101, 111, 137)",
                                fontSize: "12px",
                              }}
                            >
                              Ticket Sold
                            </span>
                            <div className="d-flex mb-2 my-progress align-items-center">
                              <span className="font-12 text-gray-2 me-2">
                                {selectschedule.schedule.raw.ticketSold}
                              </span>
                              <div
                                className="rounded-pill"
                                style={{
                                  backgroundColor: "rgb(214, 218, 229)",
                                  height: "5px",
                                  width: "100px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  className="bg-secondary"
                                  style={{ width: "40%", height: "100%" }}
                                />
                                00000000000000000
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={tuiRef} style={{ height }} />
        </div>
      </div>
    );
  }
);

export default CustomTuiCalendar;
