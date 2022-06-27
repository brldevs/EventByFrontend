import React, { useState } from "react";

import { Col } from "react-bootstrap";
function CategoryItem(props) {
  const { id, name, icon, status, click } = props;

  return (
    <Col>
      <div className="checkbox">
        <input type="checkbox" hidden id={id} />
        <label
          htmlFor={id}
          className={`d-flex align-items-center ${
            status ? "bg-primary text-white " : ""
          }`}
          onClick={() => click(id)}
        >
          <i className={icon} />
          <span className="font-15">{name} </span>
          <span className={`tik-icon ${status ? "selectd" : "d-none"}`}>
            <i className="ri-check-line" />
          </span>
        </label>
      </div>
    </Col>
  );
}

export default CategoryItem;
