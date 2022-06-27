import Editor from "/components/editor/Editor";
import React, { useState, useEffect } from "react";
import $ from "jquery";
function Organization() {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [
    data,
    setData,
  ] = useState(`For Example: This event is going to be a friendly session with a mission to inform people of the current situation of clean water shortage in rural
  areas. We will discuss methods and fundraising possibilities we can use to help, and volunteer to make a positive impact on this world`);
  useEffect(async () => {
    setEditorLoaded(true);
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

  const [image, setImage] = useState(null);
  const handleImage = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };
  return (
    <>
      <div className="content_area flex-1 p-30">
        <div className="bg-white mt-4  border-radius-10">
          <div className="text-end px-50 py-50 pb-0">
            <button className="btn btn-secondary text-white">
              Save Changes
            </button>
          </div>
          <div className="dashboard_event_container organizer-details pb-5">
            <h2 className="text-center">Organizer Details</h2>
            <p className="text-gray-2 text-center mb-5">
              Add details about your organization that will apply to your events
            </p>
            <div className="d-flex align-items-center">
              <img
                src={image ? image : "/img/sponsor_2.png"}
                height={100}
                width={100}
                className="rounded-circle"
              />

              <input type="file" id="photo" onChange={handleImage} hidden />
              <label
                htmlFor="photo"
                className="btn btn-outline-primary font-weight-500 px-3 ms-2"
              >
                <i className="ri-image-add-fill" />
                Change Logo
              </label>
            </div>
            <div className="row mt-4 row-cols-1 row-cols-md-2">
              <div className="col">
                <div className="mb-3">
                  <label htmlFor>Organization Name*</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="ri-briefcase-line" />
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      // placeholder="Organization Name"
                      // defaultValue="Book Mark"
                    />
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="mb-3">
                  <label htmlFor>Organization Country*</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="ri-earth-line" />
                      </span>
                    </div>
                    <select className="from-control form-select">
                      <option>United State</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor>Organization Website*</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="ri-global-line" />
                  </span>
                </div>
                <input
                  type="url"
                  className="form-control"
                  // placeholder="www.eventby.com"
                  // defaultValue="www.eventby.com"
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor>Organization Bio</label>
              <Editor
                name="description"
                placeholder="s"
                onChange={(data) => {
                  setData(data);
                }}
                editorLoaded={editorLoaded}
              />
              {/* {JSON.stringify(data)} */}

              {/* <textarea className="editor" placeholder="" defaultValue={""} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
Organization.layout = "AccountSetting";
export default Organization;
