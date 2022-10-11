import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT_URL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT_URL,
  withCredentials: true,
});
