import LogoutRoundedIcon from "@mui/icons-material/Logout";
import useAuthentication from "../../hooks/useAuthentication";
import { Button, useTheme } from "@mui/material";
import { axiosPrivate } from "../../api/axios";

export default function Logout({ screenWidth }) {
  let theme = useTheme();
  let { setAuthentication } = useAuthentication();

  async function logout() {
    try {
      axiosPrivate.get("/users/logout");
      setAuthentication((previous) => ({
        ...previous,
        isAuthenticated: false,
        user: null,
      }));
    } catch (error) {
      console.error(error);
    }
  }

  if (screenWidth < theme.breakpoints.values["md"]) {
    return (
      <Button
        variant="contained"
        color="secondary"
        sx={{ marginLeft: "auto", marginRight: 1 }}
        onClick={logout}
      >
        Logout
      </Button>
    );
  } else {
    return (
      <Button
        variant="contained"
        color="secondary"
        startIcon={<LogoutRoundedIcon />}
        sx={{ marginLeft: "auto", marginRight: 3 }}
        onClick={logout}
      >
        Logout
      </Button>
    );
  }
}
