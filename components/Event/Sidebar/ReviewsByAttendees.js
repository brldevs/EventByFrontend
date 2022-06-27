function ReviewsByAttendees() {
  return (
    <div className="review mt-4">
      <h5 className="font-16">Reviews By Attendees</h5>
      <div className="d-flex">
        <div className="d-flex bg-secondary rounded-circle text-white font-16 rating justify-content-center align-items-center me-3">
          <span>4.5</span>
        </div>
        <div>
          <div className="stars">
            <i className="ri-star-s-fill" />
            <i className="ri-star-s-fill" />
            <i className="ri-star-s-fill" />
            <i className="ri-star-s-fill" />
            <i className="ri-star-half-fill" />
          </div>
          <span className="text-gray-2 font-14 d-block">
            4.5 Rating Based On 345 Reviews
          </span>
          <a
            href=""
            className="text-primary font-12 text-decoration-underline links"
          >
            See All Reviews
          </a>
        </div>
      </div>
    </div>
  );
}

export default ReviewsByAttendees;
