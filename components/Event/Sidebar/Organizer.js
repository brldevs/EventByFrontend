function Organizer({ co_organizer }) {
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  return (
    <>
      <div className="event-co-organizer mt-4">
        <h5 className="font-16">Event Co-Organizers</h5>
        {co_organizer &&
          co_organizer.map((data, index) => {
            return (
              <div className="d-flex align-items-center mt-3">
                {/* <img
                  src={`${NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${data.profilePath}/image`}
                  className="rounded-circle me-2"
                /> */}
                <img src="/img/avata.png" className="rounded-circle me-2" />
                <div>
                  <div className="font-16">{data.name}</div>
                  <span className="text-gray-2 font-13">{data.email}</span>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default Organizer;
