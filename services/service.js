import axios from "axios";
import FormData from "form-data";
import API from "./index";

const signUpOrganizer = async (data) => {
  delete data.agree;
  data.role = "organizer";
  const res = await API.post("user/register", data);
  return res;
};

const signUpAttendee = async (data) => {
  delete data.agree;
  data.role = "attendee";
  const res = await API.post("user/register", data);
  return res;
};

const verifyEmailByToken = async (token) => {
  const res = await API.post(`/user/activeAccount/${token}`);
  return res;
};

const signInOrganizer = async (data) => {
  data.role = "organizer";
  const res = await API.post("/user/login", data);
  return res;
};

const signInAttendee = async (data) => {
  data.role = "attendee";
  const res = await API.post("/user/login", data);
  return res;
};

const forgotPassword = async (data) => {
  const res = await API.post("/user/forgot-password", data);
  return res;
};

const resetPassword = async (data, id) => {
  const res = await API.post(`/user/reset-password/${id}`, data);
  return res;
};

const changePassword = async (data, token) => {
  const res = await API.post(`/user/change-password`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const saveUserProfileImg = async (data, token) => {
  let formData = new FormData();
  formData.set("myImage", data.file);
  const res = await API.post("/user/profileImageUpload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const saveUserData = async (data, token) => {
  const res = await API.post("/user/updateUserData", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const eventCreate = async (data, token) => {
  const res = await API.post("/event/create", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

// ------------------------------------------------------
const createRecurrentEvent = async (data, token, eventId) => {
  const res = await API.post(`/event/create-revent/${eventId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const sendRSVPInviteeEmail = async (data, token) => {
  const res = await API.post("/event/inviteInviteeSingle", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const eventBannerUpload = async (data, token, eventId) => {
  let formData = new FormData();
  formData.set("myImage", data.fileBanner[0]);
  formData.set("description", data.editorData);
  const res = await API.post(`/event/uploadEventBanner/${eventId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const eventAddInviteeByEventId = async (data, token) => {
  let formData = new FormData();
  formData.set("eventId", data.eventId);
  formData.set("name", data.name);
  formData.set("email", data.email);
  // formData.set("profilePhoto", data.profilePhoto);
  formData.set("isRSVP", data.isRSVP);
  const res = await API.post(`/event/addInvitee`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const eventGetParticipantByEventId = async (
  eventId,
  token,
  currentPage,
  limit
) => {
  const res = await API.post(
    `/event/getEventAttendees/${eventId}?pageNo=${currentPage}&limit=${limit}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

const eventGetInviteeByEventId = async (eventId, token, currentPage, limit) => {
  const res = await API.post(
    `/event/getEventInvitee/${eventId}?pageNo=${currentPage}&limit=${limit}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

const getAllEventsTemporary = async () => {
  const res = await API.get(`/event/getAllEvents?pageNo=0&limit=5`);
  return res;
};

const eventMediaFilesUpload = async (data, token, eventId) => {
  let formData = new FormData();

  if (data.length > 0) {
    data.map(async (d) => {
      formData.append("eventAsset", d);
    });

    await API.post(
      `/event/updateEventMediaAssetsMultiple/${eventId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
};

const eventTicketCreate = async (data, token, eventId) => {
  const res = await API.post(`/event/ticket/${eventId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const addEventParticipant = async (data) => {
  const res = await API.post("/event/addEventParticipant", data);
  return res;
};

const checkoutFreeEvent = async (data) => {
  const res = await API.post("/event/updateParticipantPaymentFree", data);
  return res;
};

const checkoutPaidEvent = async (data) => {
  const res = await API.post("/event/updateParticipantPaymentPaid", data);
  return res;
};

const joinEvent = async (data) => {
  const res = await API.post("/event/joinEvent", data);
  return res;
};

const getAssetWithPath = async (token, imagePath) => {
  const res = await API.get(`/getAssetWithPath/${imagePath}/image`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const getAssetWithPath2 = async (token, imagePath) => {
  const res = await API.get(`/getAssetWithPath/${imagePath}/image`, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const getUpComingEventsData = async (organizerId) => {
  const res = await API.get(`/event/getLatestEventsByOrganizer/${organizerId}`);
  return res;
};

const getEventPreviewDataOPVById = async (id) => {
  const res = await API.get(`/event/details/${id}`);
  return res;
};

const getAllEventsByOrganizerWithoutTokenByOrganizerId = async (
  organizerId
) => {
  const res = await API.get(
    `event/getAllEventsByOrganizerWithoutToken?id=${organizerId}&pageNo=0&limit=10`
  );
  return res;
};

const getEventCoOrgSponsorSpeakerById = async (id) => {
  const res = await API.get(`/event/eventBasicInfo/${id}`);
  return res;
};

const getEventBannerByEventId = async (eventId) => {
  const res = await API.get(`/event/getEventBannerById/${eventId}`, {
    responseType: "blob",
  });
  return res;
};

const getAllUsers = async (token) => {
  const res = await API.get("/user/getAllUsers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const eventAddCoOrg = async (data, token, eventId) => {
  data.map(async (d, i) => {
    let formData = new FormData();
    formData.set("name", d.coOrgName);
    formData.set("email", d.coOrgEmail);
    // formData.set("profilePhoto", dummyHiddenFile);
    await API.post(`/event/addCoOrganizerNew/${eventId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  });
};

const eventAddSpeaker = async (data, token, eventId) => {
  data.map(async (d, i) => {
    let formData = new FormData();
    formData.set("name", d.speakerName);
    formData.set("email", d.speakerEmail);
    // formData.set("profilePhoto", dummyHiddenFile);
    await API.post(`/event/addSpeakerNew/${eventId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  });
};

const eventAddSponsor = async (data, token, eventId) => {
  data.map(async (d, i) => {
    let formData = new FormData();
    formData.set("name", d.companyName);
    formData.set("website", d.companyWebsiteLink);
    formData.set("profilePhoto", d.fileSponsorPic);
    await API.post(`/event/addSponsorNew/${eventId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  });
};

const eventDraftScheduleStatusUpdate = async (data, token, eventId) => {
  const res = await API.post(`/event/updateEventProperties/${eventId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const eventSpeakerAddByEventIdAndSpeakerId = async (
  token,
  eventId,
  speakerId
) => {
  const res = await API.post(
    `/event/addSpeakerId/${eventId}/${speakerId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

const eventCoOrganizerAddByEventIdAndCoOrganizerId = async (
  token,
  eventId,
  coOrganizerId
) => {
  const res = await API.post(
    `/event/addCoOrganizerId/${eventId}/${coOrganizerId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

const eventSponsorAddByEventIdAndSponsorId = async (
  token,
  eventId,
  sponsorId
) => {
  const res = await API.post(
    `/event/addSponsorId/${eventId}/${sponsorId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

const logOut = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("result");
  localStorage.removeItem("temp_email");
  localStorage.removeItem("profileImage");
  localStorage.removeItem("location_address");
  localStorage.clear();
};

const getAllCoOrganizer = async (token) => {
  const res = await API.post(
    `/event/getAllCoOrganizer?pageNo=0&limit=2`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

const getAllSpeaker = async (token) => {
  const res = await API.post(`/event/getAllSpeaker?pageNo=0&limit=2`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const getAllSponsor = async (token) => {
  const res = await API.post(`/event/getAllSponsor?pageNo=0&limit=2`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const stripeCheckoutSession = async (stripe_session_id, secret_id = null) => {
  const res = await axios.get(
    `https://api.stripe.com/v1/checkout/sessions/${stripe_session_id}`,
    {
      headers: {
        Authorization: `Bearer ${secret_id}`,
      },
    }
  );
  return res;
};

const signInWithGoogle = async (data) => {
  const res = await API.post("/user/googleSignIn", data);
  return res;
};

const signUpWithGoogle = async (data) => {
  const res = await API.post("/user/googleSignUp", data);
  return res;
};

const getAllCategories = async () => {
  const res = await API.post("/event/getAllCategories?pageNo=0&limit=100");
  return res;
};

const getSelectedCategories = async (token) => {
  const res = await API.get("/user/selectedCategory", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const eventGetAllComments = async (eventId) => {
  const res = await API.get(
    `/event/getAllComments?event_id=${eventId}&pageNo=0&limit=100`
  );
  return res;
};

const eventGetAllCommentsChild = async (eventId, parentId) => {
  const res = await API.get(
    `/event/getAllCommentsChild?event_id=${eventId}&parent_id=${parentId}&pageNo=0&limit=100`
  );
  return res;
};

const eventPostNewComment = async (data, token, mediaFiles) => {
  let formData = new FormData();
  formData.set("event_id", data.event_id);
  formData.set("type", "main");
  formData.set("parent_id", "NA");
  // formData.set("commentor_name", data.commentor_name);
  // formData.set("commentor_id", data.commentor_id);
  formData.set("detais", data.detais);

  mediaFiles.map((file) => {
    formData.append("comment_assets", file);
  });

  const res = await API.post(`/event/postNewComment`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const eventPostChildComment = async (data, token, mediaFiles) => {
  let formData = new FormData();
  formData.set("event_id", data.event_id);
  formData.set("type", "child");
  formData.set("parent_id", data.parentId);
  formData.set("commentor_name", data.commentor_name);
  formData.set("commentor_id", data.commentor_id);
  formData.set("detais", data.detais);

  mediaFiles.map((file) => {
    formData.append("comment_assets", file);
  });

  const res = await API.post(`/event/postNewComment`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const eventReactToComment = async (token, commentId) => {
  const res = await API.post(
    `/event/reactToComment?comment_id=${commentId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

const getAllEventsByOrganizer = async (token, currentPage, limit) => {
  const res = await API.get(
    `/event/getAllEventsByOrganizer?pageNo=${currentPage}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

const getAllEventsFinancialInfoByOrganizer = async (
  token,
  currentPage,
  limit,
  searchEventByName = null,
  searchEventByStartDate = null
) => {
  // SEARCH BY EVENT NAME
  if (searchEventByName && !searchEventByStartDate) {
    const res = await API.get(
      `/event/getAllEventsFinancialInfoByOrganizer?pageNo=${currentPage}&limit=${limit}&name=${searchEventByName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  }
  // SEARCH BY EVENT START DATE
  else if (!searchEventByName && searchEventByStartDate) {
    const res = await API.get(
      `/event/getAllEventsFinancialInfoByOrganizer?pageNo=${currentPage}&limit=${limit}&start_date=${searchEventByStartDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  }
  // SEARCH BY EVENT NAME AND EVENT START DATE
  else if (searchEventByName && searchEventByStartDate) {
    const res = await API.get(
      `/event/getAllEventsFinancialInfoByOrganizer?pageNo=${currentPage}&limit=${limit}&name=${searchEventByName}&start_date=${searchEventByStartDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } else {
    const res = await API.get(
      `/event/getAllEventsFinancialInfoByOrganizer?pageNo=${currentPage}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  }
};

const getAllPendingComments = async (token, eventId, currentPage, limit) => {
  const res = await API.get(
    `/event/getAllPendingComments?event_id=${eventId}&pageNo=${currentPage}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

const approveComment = async (token, commentId) => {
  const res = await API.get(`/event/approveComment?comment_id=${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const deleteComment = async (token, commentId) => {
  const res = await API.get(`/event/deleteComment?comment_id=${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const updateEventBasicInfo = async (data, token) => {
  const res = await API.post(`/event/updateEventBasicInfo`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const updateEventBasicDetails = async (data, token) => {
  const res = await API.post(`/event/updateEventBasicDetails`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const updateEventBanner = async (data, token, eventId) => {
  let formData = new FormData();
  if (data.isFileSelected) {
    formData.set("myImage", data.fileBanner[0]);
    formData.set("description", data.editorData);
    formData.set("isFileSelected", data.isFileSelected);
  } else {
    formData.set("description", data.editorData);
    formData.set("isFileSelected", data.isFileSelected);
  }

  const res = await API.post(`/event/updateEventBanner/${eventId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const getAttendeeEvents = async (token) => {
  const res = await API.get("/event/getAttendeeEvents", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const userPersonalDetails = async (token) => {
  const res = await API.get("/user/userPersonalDetails", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const updateUserProfile = async (data, token) => {
  const res = await API.post("/user/updateUserProfile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const deleteCoOrganizer = async (data, token) => {
  const res = await API.post(`/event/deleteCoOrganizer`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const deleteSpeaker = async (data, token) => {
  const res = await API.post(`/event/deleteSpeaker`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const deleteSponsor = async (data, token) => {
  const res = await API.post(`/event/deleteSponsor`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const deleteEventAssetByPath = async (data, token) => {
  const res = await API.post(`/event/deleteEventAssetByPath`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

/******************************START FROM HERE ************************************************/

const eventAddTicket = async (data, token, eventId) => {
  const res = await API.post(`/event/${eventId}/ticket`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const getEventsCounter = async (token) => {
  const res = await API.get("/event/getEventsCounter", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};
const getEventsFinancialCounter = async (token) => {
  const res = await API.get("/event/getEventsFinancialCounter", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const getEventsForCalender = async (data, token) => {
  const res = await API.post(`/event/getEventsForCalender`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const getUserCheckoutMethods = async (token) => {
  const res = await API.get("/event/getUserCheckoutMethods", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const saveCheckoutMethod = async (data, token) => {
  const res = await API.post(`/event/saveCheckoutMethod`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const updateCheckoutMethod = async (data, token) => {
  const res = await API.post(`/event/updateCheckoutMethod`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const setDefaultCheckoutMethod = async (data, token) => {
  const res = await API.post(`/event/setDefaultCheckoutMethod`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const getDefaultCheckoutMethod = async (token) => {
  const res = await API.get("/event/getDefaultCheckoutMethod", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const getDefaultCheckoutMethodByEvent = async (data) => {
  const res = await API.post(`/event/getDefaultCheckoutMethodByEvent`, data);
  return res;
};

const getAllPackage = async () => {
  const res = await API.get("/event/getAllPackage");
  return res;
};

const checkUserSubscription = async (token) => {
  const res = await API.get("/user/checkUserSubscription", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const subscribeUser = async (data, token) => {
  const res = await API.post(`/user/subscribeUser`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const changeSubscription = async (data, token) => {
  const res = await API.post(`/user/changeSubscription`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const checkEventCreationFacility = async (token) => {
  const res = await API.get("/user/checkEventCreationFacility", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("RES: ");
  console.log(res);
  return res;
};

const checkUserProfileSetupStatus = async (token) => {
  const res = await API.get("/user/checkUserProfileSetupStatus", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const getEventSummary = async (data, token) => {
  const res = await API.post(`/event/getEventSummary`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

const generateTicket = async (data) => {
  const res = await API.post("/event/generateTicket", data);
  return res;
};

module.exports = {
  signUpOrganizer,
  signUpAttendee,
  verifyEmailByToken,
  signInOrganizer,
  signInAttendee,
  forgotPassword,
  resetPassword,
  saveUserProfileImg,
  saveUserData,
  eventCreate,
  eventBannerUpload,
  eventAddSpeaker,
  eventAddSponsor,
  eventAddTicket,
  getUpComingEventsData,
  getAssetWithPath,
  getEventPreviewDataOPVById,
  getEventBannerByEventId,
  getAllUsers,
  eventTicketCreate,
  eventAddCoOrg,
  eventMediaFilesUpload,
  getEventCoOrgSponsorSpeakerById,
  eventAddInviteeByEventId,
  eventGetInviteeByEventId,
  sendRSVPInviteeEmail,
  getAllEventsTemporary,
  eventDraftScheduleStatusUpdate,
  changePassword,
  logOut,
  getAllCoOrganizer,
  getAllSpeaker,
  getAllSponsor,
  eventSpeakerAddByEventIdAndSpeakerId,
  eventCoOrganizerAddByEventIdAndCoOrganizerId,
  eventSponsorAddByEventIdAndSponsorId,
  addEventParticipant,
  checkoutFreeEvent,
  checkoutPaidEvent,
  joinEvent,
  stripeCheckoutSession,
  signInWithGoogle,
  signUpWithGoogle,
  getAllCategories,
  getSelectedCategories,
  eventGetAllComments,
  eventPostNewComment,
  eventGetAllCommentsChild,
  eventPostChildComment,
  eventReactToComment,
  getAllEventsByOrganizer,
  getAllPendingComments,
  approveComment,
  deleteComment,
  createRecurrentEvent,
  getAllEventsByOrganizerWithoutTokenByOrganizerId,
  getAllEventsFinancialInfoByOrganizer,
  updateEventBasicInfo,
  updateEventBasicDetails,
  updateEventBanner,
  getAttendeeEvents,
  userPersonalDetails,
  updateUserProfile,
  deleteCoOrganizer,
  deleteSpeaker,
  deleteSponsor,
  getEventsCounter,
  getEventsFinancialCounter,
  getAssetWithPath2,
  deleteEventAssetByPath,
  getEventsForCalender,
  eventGetParticipantByEventId,
  getUserCheckoutMethods,
  saveCheckoutMethod,
  updateCheckoutMethod,
  setDefaultCheckoutMethod,
  getDefaultCheckoutMethod,
  getDefaultCheckoutMethodByEvent,
  getAllPackage,
  checkUserSubscription,
  subscribeUser,
  changeSubscription,
  checkEventCreationFacility,
  checkUserProfileSetupStatus,
  getEventSummary,
  generateTicket,
};
