function Title(props) {
  return (
    <h1 className="mb-3 h2 text-center  text-dark">
      {props.children ? props.children : props.title}
    </h1>
  );
}

export default Title;
