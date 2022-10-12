import useAuthentication from "./useAuthentication";
import useRefreshToken from "./useRefreshToken";
import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import * as _ from "lodash";

export default function useAxiosPrivate() {
  const refresh = useRefreshToken();
  const { authentication } = useAuthentication();

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${_.get(
            authentication,
            "user.accessToken",
            ""
          )}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const previousRequest = error?.config;
        if (error?.response?.status === 403 && !previousRequest?.sent) {
          previousRequest.sent = true;
          const newAccessToken = await refresh();
          previousRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(previousRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [authentication, refresh]);

  return axiosPrivate;
}
