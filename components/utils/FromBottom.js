function FromBottom(props) {
  return (
    <button
      onClick={props.onClick}
      className="btn btn-lg btn-light w-100 mb-2 d-flex justify-content-center align-items-center"
    >
      <object
        height={30}
        data={props.img}
        alt={props.label}
        className="me-2"
        type="image/svg+xml"
      />
      <span>{props.label}</span>
    </button>
  );
}

export default FromBottom;
