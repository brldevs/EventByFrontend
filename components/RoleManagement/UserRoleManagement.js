import React, { useEffect, useState } from "react";
import $ from "jquery";
export default function UserRoleManagement({
  setShow,
  handleAddFields,
  inputFields,
}) {
  const handleChange = (event) => {};

  useEffect(async () => {
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
  }, []);

  const [isLeftBoxSelected, setIsLeftBoxSelected] = useState(false);
  const [isRightBoxSelected, setIsRightBoxSelected] = useState(false);

  const platformHandler = async (id, speakerId) => {
    setIsLeftBoxSelected(false);
    setIsRightBoxSelected(false);

    if (id === 0) setIsLeftBoxSelected(!isLeftBoxSelected);
    if (id === 1) setIsRightBoxSelected(!isRightBoxSelected);

    const res = await eventSpeakerAddByEventIdAndSpeakerId(
      token,
      data.event_id,
      speakerId
    );

    if (res.status === 200) {
      alert.show(res.message);

      setShow(false);
    } else {
      alert.show(res.message);
    }
  };

  return (
    <>
      <div>
        <h4 className="font-18 mb-3">
          <h4 className="font-18">Add Custom Roles</h4>
        </h4>
        <form>
          <div>
            <div className="row mb-3 g-3">
              <div className="col-sm-12">
                <label htmlFor>Role Name*</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="ri-user-line" />
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Role Name"
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor>Permissions</label>
              <div className="p-3 border border-radius-10 choice bg-white">
                {/* <h6 className="font-24">Create Events</h6>
                <div className="font-18 mt-5">About EventBy</div> */}
                <div className="mt-2">
                  <div className="mb-1">
                    <input
                      id="e1"
                      type="checkbox"
                      className="me-2 form-check-input"
                    />
                    <label htmlFor="e1">Create Events</label>
                  </div>
                  <div className="mb-1">
                    <input
                      id="e2"
                      type="checkbox"
                      className="me-2 form-check-input"
                    />
                    <label htmlFor="e2">Edit Events</label>
                  </div>
                  <div className="mb-1">
                    <input
                      id="e3"
                      type="checkbox"
                      className="me-2 form-check-input"
                    />
                    <label htmlFor="e3">Publish Events</label>
                  </div>

                  <div className="mb-1">
                    <input
                      id="o1"
                      type="checkbox"
                      className="me-2 form-check-input"
                    />
                    <label htmlFor="o1">Add Event Attendee</label>
                  </div>
                  <div className="mb-1">
                    <input
                      id="o2"
                      type="checkbox"
                      className="me-2 form-check-input"
                    />
                    <label htmlFor="o2">Send event invitation</label>
                  </div>
                  <div className="mb-1">
                    <input
                      id="o3"
                      type="checkbox"
                      className="me-2 form-check-input"
                    />
                    <label htmlFor="o3">Manage tickets</label>
                  </div>
                </div>

                <div className="mt-2 pb-4">
                  <div className="mb-1">
                    <input
                      id="n1"
                      type="checkbox"
                      className="me-2 form-check-input"
                    />
                    <label htmlFor="n1">
                      Unsubscribe from EventBy newsletters
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <button type="button" className="btn btn-primary me-2">
          Save Changes
        </button>
        <button
          className="btn light-btn btn-outline-primary"
          onClick={() => setShow(false)}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
