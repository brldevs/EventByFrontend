import $ from "jquery";
import React, { useEffect, useState } from "react";
import { getAllEventsFinancialInfoByOrganizer } from "../../../services/service";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
function EventFilterFrom({
  token,
  currentPage,
  limit,
  totalItem,
  setPageCount,
  setUpComingEventsData,
  setFilterStatus,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    setValue,
    setError,
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
  });

  const onSubmit = async (data) => {
    data = { ...data, isSingleEvent, isRecurringEvent };
    console.table(data);
    setFormValues(data);
    nextFormStep();
  };

  const [isActiveFilterStatus, setIsActiveFilterStatus] = useState(false);
  const handleStatus = () => {
    setIsActiveFilterStatus(!isActiveFilterStatus);
  };

  const [statusSelectedValue, setStatusSelectedValue] = useState(null);
  const statusRadioHandler = (e) => {
    setIsActiveFilterStatus(false);
    setStatusSelectedValue(e.target.value);
    setFilterStatus(e.target.value);
    filterEventByStatus(e.target.value);
  };

  // filtering by Status
  const filterEventByStatus = async (status) => {
    if (status === "Published") {
      const res = await getAllEventsFinancialInfoByOrganizer(
        token,
        currentPage,
        limit
      );
      setIsLoading(true);
      if (res.status === 200) {
        const filteredData = await res.data.filter((d) => {
          const { data: item } = d;
          return (
            item["is_event_draft"] === false && item["is_scheduled"] === false
          );
        });
        setUpComingEventsData(filteredData);

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } else if (status === "Draft") {
      const res = await getAllEventsFinancialInfoByOrganizer(
        token,
        currentPage,
        limit
      );
      setIsLoading(true);
      if (res.status === 200) {
        const filteredData = await res.data.filter((d) => {
          const { data: item } = d;
          return (
            item["is_event_draft"] === true && item["is_scheduled"] === false
          );
        });
        setUpComingEventsData(filteredData);

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } else if (status === "Scheduled") {
      const res = await getAllEventsFinancialInfoByOrganizer(
        token,
        currentPage,
        limit
      );
      setIsLoading(true);
      if (res.status === 200) {
        const filteredData = await res.data.filter((d) => {
          const { data: item } = d;
          return (
            item["is_event_draft"] === false && item["is_scheduled"] === true
          );
        });
        setUpComingEventsData(filteredData);

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } else {
      const res = await getAllEventsFinancialInfoByOrganizer(
        token,
        currentPage,
        limit
      );
      setIsLoading(true);
      if (res.status === 200) {
        setUpComingEventsData(res.data);

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const MyContainer = ({ className, children }) => {
    return (
      <div className="customcalender">
        <CalendarContainer className={className}>
          <div style={{ position: "relative" }}>{children}</div>
        </CalendarContainer>
      </div>
    );
  };

  useEffect(() => {
    $(".input-group .form-control").on("focus", function () {
      $(this).parent().css({
        "border-color": "#2DC774",
        color: "#2DC774",
      });
    });
    $(".input-group .form-control").on("focusout", function () {
      $(this).parent().css({
        "border-color": "#E9ECF0",
        color: "#A5ADC1",
      });
    });
  });

  const [isStartingDate, setStartingDate] = useState(false);
  const toggleClass = () => {
    setStartingDate(!isStartingDate);
  };

  const [searchEventByName, setSearchEventByName] = useState(null);

  const getResultByEventName = async () => {
    if (searchEventByName) {
      const res = await getAllEventsFinancialInfoByOrganizer(
        token,
        currentPage,
        limit,
        searchEventByName
      );
      if (res.status === 200) {
        setUpComingEventsData(res.data);
      }
    }
  };

  const getResultByEventStartDate = async (searchEventByStartDate) => {
    if (searchEventByStartDate) {
      const res = await getAllEventsFinancialInfoByOrganizer(
        token,
        currentPage,
        limit,
        null,
        searchEventByStartDate
      );
      if (res.status === 200) {
        setUpComingEventsData(res.data);
      }
    }
  };

  return (
    <>
      <div className="search-event bg-white border-radius-10 p-30 pb-4 mt-4">
        <div className="d-flex justify-content-between flex-wrap align-items-start">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search Events"
              value={searchEventByName}
              onChange={(e) => setSearchEventByName(e.target.value)}
            />
            <div className="input-group-append">
              <span
                className="input-group-text text-primary cursor-pointer"
                onClick={getResultByEventName}
              >
                <i className="ri-search-line" />
              </span>
            </div>
          </div>
          <div className="d-flex flex-wrap flex-sm-nowrap">
            {/* TEMPORARY HIDE FILTER START */}
            {/* <div
              className="input-group me-0 me-sm-2"
              style={{ overflow: "visible" }}
            >
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="ri-filter-line" />
                </span>
              </div>
              <div
                onClick={handleStatus}
                className={`wrapper-dropdown-4 ${
                  isActiveFilterStatus ? "active" : ""
                } form-select form-control form-control-sm`}
              >
                {statusSelectedValue ? statusSelectedValue : "Status"}

                <ul
                  className="dropdown ps-0 rounded-bottom"
                  style={{ width: "200px", marginLeft: "-58px" }}
                >
                  <li>
                    <input
                      type="radio"
                      id="st-1"
                      onChange={(e) => {
                        statusRadioHandler(e);
                      }}
                      name="status"
                      defaultValue="Published"
                      className="form-check-input"
                    />
                    <label htmlFor="st-1">Published</label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="st-2"
                      onChange={(e) => {
                        statusRadioHandler(e);
                      }}
                      name="status"
                      defaultValue="Draft"
                      className="form-check-input"
                    />
                    <label htmlFor="st-2">Draft</label>
                  </li>
                  <li className="rounded-bottom">
                    <input
                      type="radio"
                      id="st-3"
                      onChange={(e) => {
                        statusRadioHandler(e);
                      }}
                      name="status"
                      defaultValue="Scheduled"
                      className="form-check-input"
                    />
                    <label htmlFor="st-3">Scheduled</label>
                  </li>
                  <li className="rounded-bottom">
                    <input
                      type="radio"
                      id="st-4"
                      onChange={(e) => {
                        statusRadioHandler(e);
                      }}
                      name="status"
                      defaultValue="Expired"
                      className="form-check-input"
                    />
                    <label htmlFor="st-4">Expired</label>
                  </li>
                </ul>
              </div>
            </div> */}
            {/* TEMPORARY HIDE FILTER END */}

            <div className="col">
              {/* <div 
                className={`myevent-date-selector input-group border-radius-bottom-0 calender-focus ${
                  isStartingDate ? "onfocus" : ""
                }`}
                style={{ overflow: "visible" }}
                onClick={toggleClass}
              >
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="ri-calendar-line" />
                  </span>
                </div>
                {/* <input type="date" className="form-control ps-0" name />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    setStartingDate(!isStartingDate);
                    getResultByEventStartDate(date.toISOString());
                  }}
                  calendarContainer={MyContainer}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventFilterFrom;
