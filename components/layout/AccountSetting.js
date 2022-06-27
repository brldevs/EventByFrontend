import NavMenu from "../nav/NavMenu";
import DashboardSideMenu from "/components/nav/DashboardSideMenu";
import { PersonealSeeting, Attendees } from "../../components/utils/data";
import { useRouter } from "next/router";

function AccountSetting({ children }) {
  const router = useRouter();
  return (
    <>
      <header id="nav">
        <NavMenu />
      </header>
      <section id="dashboard">
        <div className="side-menu-icon d-none" id="side-menu-open">
          <span className="icon">
            <i className="ri-arrow-right-s-line" />
          </span>
        </div>
        <div className="d-flex">
          <DashboardSideMenu
            title="ACCOUNT SETTINGS"
            menu={
              router.pathname === "/attendees/accountsetting/personalinfo"
                ? Attendees
                : PersonealSeeting
            }
          />
          <div className="content_area flex-1 p-30">{children}</div>
        </div>
      </section>
    </>
  );
}

export default AccountSetting;
