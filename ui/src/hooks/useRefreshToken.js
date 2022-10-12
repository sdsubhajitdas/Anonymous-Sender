import axios from "../api/axios";
import useAuthentication from "./useAuthentication";

export default function useRefreshToken() {
  const { authentication, setAuthentication } = useAuthentication();

  const refresh = async () => {
    const response = await axios.get("/users/refresh");
    console.log("Refresh Function Called: " + response.data.accessToken);
    console.log("Authentication State: " + JSON.stringify(authentication));
    setAuthentication((previous) => ({
      ...previous,
      isAuthenticated: true,
      user: { ...previous.user, accessToken: response.data.accessToken },
    }));

    return response.data.accessToken;
  };

  return refresh;
}
