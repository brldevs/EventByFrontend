import TitleSubtitle from "../../utils/Title/TitleSubtitle";
import EventSpeakerList from "./EventSpeakerList";

const SPEAKER = [
  {
    id: "1",
    name: "Mark Adam",
    email: "example@gmail.com",
    img: "organizer_2.png",
  },
  {
    id: "2",
    name: "Mark Adam",
    email: "example@gmail.com",
    img: "organizer_2.png",
  },
  {
    id: "3",
    name: "Mark Adam",
    email: "example@gmail.com",
    img: "organizer_2.png",
  },
  {
    id: "4",
    name: "Mark Adam",
    email: "example@gmail.com",
    img: "organizer_2.png",
  },
  {
    id: "5",
    name: "Mark Adam",
    email: "example@gmail.com",
    img: "organizer_2.png",
  },
];

const EventSpeakers = () => {
  return (
    <>
      <TitleSubtitle
        title="Add Event Speakers"
        subtitle="(Optional)"
        righttext="Skip Now"
      />
      <EventSpeakerList speaker={SPEAKER} />
    </>
  );
};

export default EventSpeakers;
