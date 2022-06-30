import "bootstrap/dist/css/bootstrap.min.css";
// This is Test Commit by shafaet
import $ from "jquery";
import React from "react";
import { positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import "remixicon/fonts/remixicon.css";
import AccountSetting from "../components/layout/AccountSetting";
import AttendeesDashboard from "../components/layout/AttendeesDashboard";
import AttendeesWothoutsidebar from "../components/layout/AttendeesWothoutsidebar";
import Empty from "../components/layout/Empty";
import Event from "../components/layout/Event";
import EventDashboard from "../components/layout/EventDashboard";
import Eventpublic from "../components/layout/Eventpublic";
import { SSRProvider } from "@react-aria/ssr";
import Login from "../components/layout/Login";
import FormProvider from "../context";
import AuthProvider from "../context/auth";
import "../components/styles2.css";
import "../styles/main.scss";
import "react-quill/dist/quill.snow.css";
import { SessionProvider } from "next-auth/react";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import SimpleReactLightbox from "simple-react-lightbox";

if (typeof window === "object") {
  $(".date-custom-canelder label").on("click", function () {
    $(this).parent().addClass("active");
  });

  //Side Menu
  $("#side-menu-open").on(function () {
    $("#dashboard .sidebar").removeClass("left-250");
  });

  $("#side-menu-hide").on(function () {
    $("#dashboard .sidebar").addClass("left-250");
  });

  $("#dashboard .content_area").on(function () {
    $("#dashboard .sidebar").addClass("left-250");
  });
  //End Side Menu

  //For Changing inpute group color on focus

  //For Changing inpute group color on focus End
  //Grid view and List View
  $("#grid-view").on("click", function () {
    console.log(11);
    $("#grid-content").removeClass("list-event");
    $("#grid-content").addClass("grid-event");
    $("#grid-content-row").addClass("row-cols-md-2 row-cols-xl-3");
  });

  $("#list-view").on("click", function () {
    $("#grid-content").addClass("list-event");
    $("#grid-content").removeClass("grid-event");
    $("#grid-content-row").removeClass("row-cols-md-2 row-cols-xl-3");
  });
  //Grid view and List View  End

  //For Enable Tooltip
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  // var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  //   return new bootstrap.Tooltip(tooltipTriggerEl);
  // });
  //End  Enable Tooltip

  //For Changing inpute group color on focus

  //For Changing inpute group color on focus End

  var i = 2;
  //Custom Checkbox
  $(".checkbox").on("mousedown", function () {
    if ($(this).children("input[type=checkbox]").is(":checked")) {
      $(this).children("label").removeClass("bg-primary text-white");
      $(this).children().children(".tik-icon").addClass("d-none");
    } else {
      $(this).children("label").addClass("bg-primary text-white");
      $(this).children().children(".tik-icon").removeClass("d-none");
    }
  });
  //End Custom Checkbox

  $(".form-check-input.all").on("change", function () {
    if ($(this).is(":checked")) {
      $(".form-check-input.attendance-check").prop("checked", true);
    } else {
      $(".form-check-input.attendance-check").prop("checked", false);
    }
  });

  $(".form-check-input.attendance-check").on("change", function () {
    if (!$(this).is(":checked")) {
      $(".form-check-input.all").prop("checked", false);
    }
  });
}

// pages/_app.jsx
const layouts = {
  Login: Login,
  Event: Event,
  Empty: Empty,
  EventDashboard: EventDashboard,
  Eventpublic: Eventpublic,
  AccountSetting: AccountSetting,
  AttendeesDashboard: AttendeesDashboard,
  AttendeesWothoutsidebar: AttendeesWothoutsidebar,
};
const options = {
  timeout: 5000,
  position: positions.TOP_RIGHT,
  offset: "30px",
  containerStyle: {
    zIndex: 999999,
  },
};
const types = {
  INFO: "info",
  SUCCESS: "success",
  ERROR: "error",
};

const transitions = {
  FADE: "fade",
  SCALE: "scale",
};

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  const Layout = layouts[Component.layout] || ((children) => <>{children}</>);
  return (
    <SSRProvider>
      <SessionProvider session={session}>
        <AlertProvider
          template={AlertTemplate}
          {...options}
          className="notification"
        >
          <ReactNotifications />
          <AuthProvider>
            <FormProvider>
              <SimpleReactLightbox>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </SimpleReactLightbox>
            </FormProvider>
          </AuthProvider>
        </AlertProvider>
      </SessionProvider>
    </SSRProvider>
  );
};
export default App;
