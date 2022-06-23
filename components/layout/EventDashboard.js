import EventItem from "../../components/Event/EventDashboard/SingalEventadmin/EventItem";
import DashboardSideMenu from "../../components/nav/DashboardSideMenu";
import { NavLinkSingleEvent } from "../../components/utils/data";
import NavMenu from "../nav/NavMenu";

function EventDashboard({ children, eventId }) {
  return (
    <>
      {/* <header id="nav">
        <NavMenu />
      </header> */}
      <section id="dashboard">
        <div className="side-menu-icon d-none" id="side-menu-open">
          <span className="icon">
            <i className="ri-arrow-right-s-line" />
          </span>
        </div>
        <div className="d-flex">
          {/* <p>{eventId}</p> */}
          <DashboardSideMenu
            title="Manage Event"
            menu={NavLinkSingleEvent}
            eventId={eventId}
          />
          <div className="content_area flex-1 p-30">
            {/* <EventItem /> */}
            {children}
          </div>
        </div>
      </section>
    </>
  );
}

export default EventDashboard;
