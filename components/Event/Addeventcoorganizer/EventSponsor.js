import TitleSubtitle from "../../../components/utils/Title/TitleSubtitle";
import EventSponsorList from "./EventSponsorList";
const SPONSOR = [
  { id: "1", img: "sponsor_4.png" },
  { id: "2", img: "sponsor_4.png" },
  { id: "3", img: "sponsor_4.png" },
  { id: "4", img: "sponsor_4.png" },
];

function EventSponsor() {
  return (
    <>
      <TitleSubtitle
        title="Add Event Sponsor"
        subtitle="(Optional)"
        righttext="Skip Now"
      />
      <EventSponsorList sponsor={SPONSOR} />
    </>
  );
}

export default EventSponsor;
