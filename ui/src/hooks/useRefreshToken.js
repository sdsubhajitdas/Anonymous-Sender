import axios from "../api/axios";
import useAuthentication from "./useAuthentication";

export default function useRefreshToken() {
  const { setAuthentication } = useAuthentication();

  const refresh = async () => {
    const response = await axios.get("/users/refresh");
    setAuthentication((previous) => ({
      ...previous,
      isAuthenticated: true,
      user: { ...previous.user, accessToken: response.data.accessToken },
    }));

    return response.data.accessToken;
  };

  return refresh;
}
