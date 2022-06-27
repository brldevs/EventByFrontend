import { ReactNotifications, Store } from "react-notifications-component";

export const Notification = (message, type) => {
  return (
    <div className="mt-5 ms-5">
      <div
        class={`d-flex bd-highlight ${
          type ? "bg-secondary" : "bg-danger"
        } w-100 rounded font-18 mt-5`}
      >
        <div class="p-2 flex-shrink-1 bd-highlight  text-white ">
          {/* <Image src="/img/checkbox-circle-fill.png" height={30} width={30} /> */}
          {type ? (
            <i class="ri-checkbox-circle-fill"></i>
          ) : (
            <i class="ri-close-circle-fill"></i>
          )}
        </div>
        <div class="p-2 w-100 text-white">{message}</div>
      </div>
    </div>
  );
};

export const customNotification = (message, type) => {
  Store.addNotification({
    content: Notification(message, type),
    type: "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 50000,
    },
  });
};
