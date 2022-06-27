import moment from "moment";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { getAllEventsFinancialInfoByOrganizer } from "../../services/service";
import { useRouter } from "next/router";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventFilterFrom from "../../components/Event/EventDashboard/EventFilterFrom";
import MyEventItem from "../../components/Event/EventDashboard/MyEventItem";
import CustomEventCalender from "../../components/CustomEventCalender";
import { useAuthData } from "../../context/auth";
import ReactPaginate from "react-paginate";

///const localizer = momentLocalizer(moment);

const eventList = [
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

function myEvent() {
  const { data, setAuthValues, removeAuthValues } = useAuthData();

  const [organizerId, setOrganizerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isListView, setIsListView] = useState(true);
  const [isGridView, setIsGridView] = useState(false);
  const [isCalendarView, setIsCalendarView] = useState(false);
  const router = useRouter();

  const [token, setToken] = useState("");
  const [totalPublishedEvent, setTotalPublishedEvent] = useState(0);
  const [locationAddress, setLocationAddress] = useState(null);

  const [upComingEventsData, setUpComingEventsData] = useState([]);

  const [isPaginationShow, setIsPaginationShow] = useState(false);
  useEffect(async () => {
    console.log("organizerId " + organizerId);
    setIsLoading(true);
    const accessToken = localStorage.getItem("token");
    const result = await JSON.parse(localStorage.getItem("result"));

    if (!accessToken) {
      router.replace("/");
      setIsLoading(false);
    }
    if (accessToken) {
      if (result.id) {
        setOrganizerId(result.id);
        setIsLoading(false);
      }
      setToken(accessToken);
      const res = await getAllEventsFinancialInfoByOrganizer(
        accessToken,
        currentPage,
        limit
      );

      if (res.status === 200) {
        if (res.data.length > 0) {
          setIsPaginationShow(true);
        } else {
          setIsPaginationShow(false);
        }

        setUpComingEventsData(res.data);
        setTotalItem(res.total_events_created);

        setIsLoading(false);

        setPageCount(Math.ceil(res.total_events_created / limit));
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  // ////////////////////////////////////--PAGINATION CODE START
  const [totalItem, setTotalItem] = useState(0); //NEED TO CHANGE AFTER TURZO VAI GIVE TOTAL DATA COUNT
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(5);

  const [filterStatus, setFilterStatus] = useState(null);

  const changePage = async ({ selected }) => {
    setIsLoading(true);
    setCurrentPage(selected);
    const res = await getAllEventsFinancialInfoByOrganizer(
      token,
      selected,
      limit
    );

    if (filterStatus === "Published") {
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
    } else if (filterStatus === "Draft") {
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
    } else if (filterStatus === "Scheduled") {
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
      setIsLoading(true);
      if (res.status === 200) {
        setUpComingEventsData(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  };
  // ////////////////////////////////////--PAGINATION CODE END

  return (
    <>
      <Head>
        <title>My Event</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="mw-1370 mt-5">
        <div className="d-flex flex-wrap justify-content-between align-items-end">
          <span className="font-30 font-weight-700 me-3 me-sm-0 lh-1">
            My Events
          </span>
          <div className="mt-3 mt-sm-0">
            <button
              className={`btn btn-sm m-1 ${isGridView && "active"}`}
              onClick={() => {
                setIsListView(false);
                setIsGridView(true);
                setIsCalendarView(false);
              }}
            >
              <i className="ri-layout-grid-fill" />
              Grid
            </button>
            <button
              className={`btn btn-sm m-1 ${isListView && "active"}`}
              onClick={() => {
                setIsListView(true);
                setIsGridView(false);
                setIsCalendarView(false);
              }}
            >
              <i className="ri-list-check" />
              List
            </button>
            <button
              className={`btn btn-sm m-1 ${isCalendarView && "active"}`}
              onClick={() => {
                setIsListView(false);
                setIsGridView(false);
                setIsCalendarView(true);
              }}
            >
              <i className="ri-calendar-line" />
              Calender
            </button>
          </div>
        </div>
        <EventFilterFrom
          token={token}
          currentPage={currentPage}
          limit={limit}
          totalItem={totalItem}
          setPageCount={setPageCount}
          setUpComingEventsData={setUpComingEventsData}
          setFilterStatus={setFilterStatus}
        />
        {isListView && (
          <div className="list-event mt-4 mb-5" id="grid-content">
            <div className="row row-cols-1 gy-4" id="grid-content-row">
              {upComingEventsData && (
                <MyEventItem upComingEventsData={upComingEventsData} />
              )}
              {isPaginationShow && (
                <nav className="dashboard page mt-4">
                  <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    breakLabel={""}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={0}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName={"pagination"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
                </nav>
              )}
            </div>
          </div>
        )}
        {isGridView && (
          <div className="mt-4 mb-5 grid-event" id="grid-content">
            <div
              className="row row-cols-1 gy-4 row-cols-md-2 row-cols-xl-3"
              id="grid-content-row"
            >
              <MyEventItem upComingEventsData={upComingEventsData} />
            </div>
            {isPaginationShow && (
              <nav className="dashboard page mt-4">
                <ReactPaginate
                  previousLabel={"<"}
                  nextLabel={">"}
                  breakLabel={""}
                  pageRangeDisplayed={5}
                  marginPagesDisplayed={0}
                  pageCount={pageCount}
                  onPageChange={changePage}
                  containerClassName={"pagination"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </nav>
            )}
          </div>
        )}
        {isCalendarView && (
          <div className="col-lg-12 col-xl-12 mt-5 bg-white p-sm-4">
            <CustomEventCalender />
          </div>
        )}
      </div>
    </>
  );
}

myEvent.layout = "Event";
export default myEvent;
