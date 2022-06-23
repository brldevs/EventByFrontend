import { Row } from 'react-bootstrap';
function Subtitle(props) {
  return ( <Row>
    <div className="col-lg-10 mx-lg-auto text-gray-2 mb-5 text-center">
    {props.children ? props.children : props.title}
    </div>
  </Row> );
}

export default Subtitle;