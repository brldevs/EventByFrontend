import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const Popup = (props) => {
  const { show, handleClose, submitAction } = props;
  // const [show, setShow] = useState(false);
  // const handleClose = () => setShow(false);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {/* <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header> */}
        <Modal.Body className="p-5 rounded">{props.data}</Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          <button
            className="btn light-btn btn-outline-primary"
            onClick={handleClose}
          >
            Cancel
          </button>

          <Button variant="primary" onClick={submitAction}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default Popup;
