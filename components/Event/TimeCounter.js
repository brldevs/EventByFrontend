import Countdown from "react-countdown";

const Completionist = () => <span>Event Started!</span>;
// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <>
        <span className="digit">{days}</span>
        <span className="text">Days</span>
        <span className="clone">:</span>
        <span className="digit">{hours}</span>
        <span className="text">Hours</span>
        <span className="clone">:</span>
        <span className="digit">{minutes}</span>
        <span className="text">Minutes</span>
        <span className="clone">:</span>
        <span className="digit">{seconds}</span>
        <span className="text">Seconds</span>
      </>
    );
  }
};

function TimeCounter(props) {
  return <Countdown date={Date.now() + props.count} renderer={renderer} />;
}

export default TimeCounter;
