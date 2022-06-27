function FromAppendPrepend(props) {
  if (!props.prepend) {
    return (
      <div className="input-group-append">
        <span className="input-group-text">
          <i className={props.icon} onClick={props.onClick} />
        </span>
      </div>
    );
  } else {
    return (
      <div className="input-group-prepend">
        <span className="input-group-text">
          <i className={props.icon} onClick={props.onClick} />
        </span>
      </div>
    );
  }
}

export default FromAppendPrepend;
