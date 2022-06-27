import { useEffect } from "react";
import NavMenu from "../nav/NavMenu";
import Footer from "./Footer";
import DashboardSideMenu from "/components/nav/DashboardSideMenu";
import { Attendees } from "/components/utils/data";
export default function AttendeesWothoutsidebar({ children }) {
  useEffect(() => {
    document.body.classList.toggle("attendees");
  }, []);
  return (
    <>
      <NavMenu />
      <section id="dashboard">
        <div className="side-menu-icon d-none" id="side-menu-open">
          <span className="icon">
            <i className="ri-arrow-right-s-line" />
          </span>
        </div>
        <div className="d-flex">
          <div className="content_area flex-1 p-30">{children}</div>
        </div>
      </section>

      <Footer />
    </>
  );
}
