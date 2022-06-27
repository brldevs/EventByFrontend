import $ from "jquery";
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import Popup from "../../../components/utils/Modal";
import TitleSubtitle from "../../../components/utils/Title/TitleSubtitle";
import UserRoleManagement from "../../../components/RoleManagement/UserRoleManagement";

function Teammembers() {
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
  const [isActivefilter, setActivefilter] = useState(false);
  const HandlerselectTime = () => {
    setActivefilter(!isActivefilter);
    //alert(showResults);
  };

  const [show, setShow] = useState(false);

  const showPopUpForm = () => {
    setShow(true);
  };

  function PopSubmitHandler(event) {
    event.preventDefault();
  }
  const [inputFields, setInputFields] = useState();

  const handleAddFields = (data) => {};
  return (
    <>
      <Popup
        title="Add Event Co-Organizer"
        show={show}
        handleClose={() => setShow(false)}
        submitAction={PopSubmitHandler}
        data={
          <UserRoleManagement
            setShow={setShow}
            handleAddFields={handleAddFields}
            inputFields={inputFields}
          />
        }
      />
      <div className="content_area flex-1 p-30">
        <div className="bg-white py-5  border-radius-10">
          <div className="text-end px-50 py-50 pb-0">
            <button className="btn btn-secondary text-white">
              Save Changes
            </button>
          </div>
          <div className="dashboard_event_container organizer-details">
            <h2 className="text-center">Team & Role Management</h2>
            <p className="text-gray-2 text-center mb-5">
              Add your team members and assign roles to manage your event better
            </p>

            <div className="border rounded p-5">
              <div class="flex-grow-1 bd-highlight">
                <span className="font-18 d-block font-weight-500">
                  Add Team Member
                </span>
                {/* <div className="font-14 mb-2 d-flex justify-content-between">
                  <span className="text-gray-2 ">
                    Create your own custom roles and assign them to team members
                  </span>
                </div> */}
              </div>
              <div className="row mt-4 row-cols-1 row-cols-md-2">
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor>Email*</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ri-mail-line" />
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Email ID"
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor>Role*</label>

                    <div
                      className="input-group me-0 me-sm-2"
                      style={{ overflow: "visible" }}
                    >
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ri-shield-user-line" />
                        </span>
                      </div>
                      <div
                        id="dd"
                        onClick={() => HandlerselectTime()}
                        className={`wrapper-dropdown-4 ${
                          isActivefilter ? "active" : ""
                        } form-select form-control form-control-sm`}
                      >
                        <span
                          className="text-gray4"
                          style={{ lineHeight: "60px", color: "#9BA4BB" }}
                        >
                          Select Role
                        </span>
                        <ul
                          className="dropdown ps-0 rounded-bottom"
                          style={{ width: "auto", marginLeft: "-45px" }}
                        >
                          <li>
                            <input
                              type="radio"
                              id="el-1"
                              name="repeatrvery"
                              defaultValue="donut"
                              className="form-check-input"
                            />
                            <label htmlFor="el-1">On Sale</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              id="el-2"
                              name="repeatrvery"
                              defaultValue="neighbour"
                              className="form-check-input"
                            />
                            <label htmlFor="el-2">Drafted</label>
                          </li>
                          <li className="rounded-bottom">
                            <input
                              type="radio"
                              id="el-3"
                              name="repeatrvery"
                              defaultValue="T-rex"
                              className="form-check-input"
                            />
                            <label htmlFor="el-3">Sale From</label>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3 p-1">
                <label htmlFor>Message</label>
                <Form.Control
                  as="textarea"
                  className="form-control"
                  placeholder="Add a little detail and tell your guests what the event is about"
                  // defaultValue={data.addASummary}
                />
              </div>
              <div className="mb-3 p-1">
                <button className="btn btn-md btn-primary">
                  Send Invitation
                </button>
              </div>
            </div>
            <div className="border p-5 rounded my-3">
              <div class="d-flex bd-highlight align-items-center">
                <div class="p-3 flex-grow-1 bd-highlight">
                  <span className="font-18 d-block">Add Event Speakers</span>
                  <div className="font-14 mb-2 d-flex justify-content-between">
                    <span className="text-gray-2 ">
                      Create your own custom roles and assign them to team
                      members
                    </span>
                  </div>
                </div>
                <div class="p-2 bd-highlight">
                  <button
                    className="btn -btn-md btn-outline-primary px-5 py-3"
                    onClick={showPopUpForm}
                  >
                    Create A New Role
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Teammembers.layout = "AccountSetting";
export default Teammembers;
