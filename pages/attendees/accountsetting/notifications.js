import { useEffect } from "react";
function Notifications() {
  return (
    <div className="content_area flex-1 ">
      <div className="bg-white border-radius-10">
        <div className="text-end px-50 py-50 pb-0">
          <button className="btn btn-secondary text-white">Save Changes</button>
        </div>
        <div className="dashboard_event_container notification_panel pb-5">
          <h2 className="text-center">Notification &amp; Alerts</h2>
          <p className="text-gray-2 text-center mb-5">
            Configure your notifications and alerts settings for EventBy
          </p>
          <div className="border bg-white border-radius-10 py-30 px-50 d-flex justify-content-between align-items-center">
            <div>
              <h6 className="font-24">Smart Notifications</h6>
              <span className="text-gray-2">
                Turn on notifications to get real-time updates about your
                events.
              </span>
            </div>
            <div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" />
              </div>
            </div>
          </div>
          <div className="p-50 border mt-5 border-radius-10 choice bg-white">
            <h6 className="font-24">
              Choose When To Receive Emails &amp; Notifications
            </h6>
            <div className="font-18 mt-5">About EventBy</div>
            <div className="mt-2">
              <div className="mb-1">
                <input
                  id="e1"
                  type="checkbox"
                  className="me-2 form-check-input"
                />
                <label htmlFor="e1">
                  Updates about new Eventby features and announcements
                </label>
              </div>
              <div className="mb-1">
                <input
                  id="e2"
                  type="checkbox"
                  className="me-2 form-check-input"
                />
                <label htmlFor="e2">
                  Personalized event recommendations and news
                </label>
              </div>
              <div className="mb-1">
                <input
                  id="e3"
                  type="checkbox"
                  className="me-2 form-check-input"
                />
                <label htmlFor="e3">
                  Helpful updates and tips for organizing events on EventBy
                </label>
              </div>
            </div>
            <div className="font-18 mt-5">
              About Events Or Organizers You Follow
            </div>
            <div className="mt-2">
              <div className="mb-1">
                <input
                  id="o1"
                  type="checkbox"
                  className="me-2 form-check-input"
                />
                <label htmlFor="o1">
                  Organizers &amp; profiles you follow announces a new event
                </label>
              </div>
              <div className="mb-1">
                <input
                  id="o2"
                  type="checkbox"
                  className="me-2 form-check-input"
                />
                <label htmlFor="o2">
                  Organizers &amp; profiles you follow register for events near
                  me
                </label>
              </div>
              <div className="mb-1">
                <input
                  id="o3"
                  type="checkbox"
                  className="me-2 form-check-input"
                />
                <label htmlFor="o3">
                  Requests for feedback on an event after you have attended
                </label>
              </div>
              <div className="mb-1">
                <input
                  id="o4"
                  type="checkbox"
                  className="me-2 form-check-input"
                />
                <label htmlFor="o4">
                  New comments &amp; discussions on events you have attended
                </label>
              </div>
            </div>
            <div className="font-18 mt-5">
              Do Not Want To Receive Emails &amp; Notifications?
            </div>
            <div className="mt-2 pb-4">
              <div className="mb-1">
                <input
                  id="n1"
                  type="checkbox"
                  className="me-2 form-check-input"
                />
                <label htmlFor="n1">Unsubscribe from EventBy newsletters</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Notifications.layout = "AttendeesDashboard";
export default Notifications;
