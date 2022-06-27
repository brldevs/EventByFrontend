import Link from "next/link";
import { useRouter } from "next/router";

function DashboardSideMenu(props) {
  const router = useRouter();
  return (
    <div className="sidebar left-250">
      <div className="top">
        <span className="icon" id="side-menu-hide">
          <i className="ri-arrow-left-s-line" />
        </span>
        <span className="font-16">{props.title}</span>
      </div>
      <div className="menu">
        <ul className="nav flex-column">
          {props.menu.map((link, index) => {
            return (
              <li key={index} className="nav-item">
                <Link
                  href={`${link.path}/${
                    props.title === "Manage Event" ? props.eventId : ""
                  }`}
                >
                  <a
                    className={`nav-link icon ${
                      router.pathname.includes(link.path) ? "active" : ""
                    } navicon ${link.icon}`}
                  >
                    {link.name}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default DashboardSideMenu;
