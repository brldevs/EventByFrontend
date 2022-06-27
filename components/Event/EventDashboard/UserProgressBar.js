function UserProgressBar({ totalTicket, soldTicket }) {
  return (
    <div className>
      <span
        className="font-weight-500"
        style={{ color: "#656F89", fontSize: "12px" }}
      >
        Ticket Sold
      </span>
      <div className="d-flex mb-2 my-progress align-items-center">
        <span className="font-12 text-gray-2 me-2">
          {soldTicket} / {totalTicket}
        </span>
        <div
          className="rounded-pill"
          style={{
            backgroundColor: "#D6DAE5",
            height: "5px",
            width: "100px",
            overflow: "hidden",
          }}
        >
          <div
            className="bg-secondary"
            style={{
              width: `${(soldTicket / totalTicket) * 100}%`,
              height: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default UserProgressBar;
