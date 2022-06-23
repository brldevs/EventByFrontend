function OnsaleFalg(props) {
  return (
    <div className="date text-gray-2 font-12">
      <span className="me-3">
        <i className="ri-checkbox-blank-circle-fill text-secondary me-1" />
        {props.title ? props.title : "On Sale"}
      </span>
      <span>
        <i className="ri-calendar-check-line me-1" />
        {props.date}
      </span>
    </div>
  );
}

export default OnsaleFalg;
