import axios from "axios";
import getConfig from "next/config";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
// import { toast } from "react-toastify";
// import { AXIOS_BASE_URL } from "../constants/constants";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

api.interceptors.request.use((request) => {
  console.log("Request-> " + JSON.stringify(request));
  return request;
});

api.interceptors.response.use((response) => {
  console.log("Response-> " + JSON.stringify(response));
  if (response.data.success === false) {
    // console.log(typeof response.data.success + " - " + response.data.message);
    //     toast.error(response.data.message);
    return {};
  } else if (response.data.status === 403) {
    localStorage.clear();
    window.location = "/";
  } else {
    //     toast.success(response.data.message);
    return response.data;
  }
});

export default api;
