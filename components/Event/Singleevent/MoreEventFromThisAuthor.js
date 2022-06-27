import { format } from "date-fns";
import Image from "next/image";
function MoreEventFromThisAuthor({
  moreEventsFromOrganizerList,
  organizerName,
  organizerProfileImg,
}) {
  return (
    <>
      <div className="more_event mt-80">
        <h2 className="mb-4">More Event From This Author</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 gy-5">
          {/*Item*/}
          {moreEventsFromOrganizerList
            .slice(
              moreEventsFromOrganizerList > 3 ? 3 : 0,
              moreEventsFromOrganizerList > 3 ? 6 : 3
            )
            .map((data, index) => {
              // const { data } = item;
              return (
                <div className="col">
                  <div>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${data.event_banner}/image`}
                      alt="me"
                      width={500}
                      height={300}
                      className="border-radius-10 w-100"
                    />
                    <div className="name d-flex align-items-center">
                      <span className="letter me-2 font-18 text-white text-center rounded">
                        <img
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${organizerProfileImg}/image`}
                          className="border-radius-10 w-100"
                          height="30"
                          width="40"
                        />
                      </span>
                      <div className="font-16">
                        <span className="text-gray-2 font-weight-500">By </span>
                        <span>{organizerName}</span>
                      </div>
                    </div>
                    <h4>{data.name}</h4>
                    <div>
                      <i className="ri-calendar-check-line text-gray-2 me-2" />{" "}
                      <span className="text-gray-1">
                        {" "}
                        {format(new Date(data.start_date), "MMMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default MoreEventFromThisAuthor;
