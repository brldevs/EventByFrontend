function Sideimage(props) {
    return ( 
            <div className="col-md-6 text-end d-none d-lg-block">
            <object data={props.src} alt={props.alt} type="image/svg+xml" className="w-75" />
            </div>
          );
}

export default Sideimage;