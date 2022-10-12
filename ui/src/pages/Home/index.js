import MessageItem from "../../components/MessageItem/index";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import moment from "moment";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/Logout";
import { ContentCopy } from "@mui/icons-material";
import useAuthentication from "../../hooks/useAuthentication";
import { useEffect, useState } from "react";

export default function App() {
  let theme = useTheme();
  let { authentication, setAuthentication } = useAuthentication();
  const axiosPrivate = useAxiosPrivate();

  async function retrieveMessages() {
    try {
      const response = await axiosPrivate.get("/messages");

      const generateSingleMessageItem = (itemData) => {
        return (
          <MessageItem
            key={itemData._id}
            createdAt={moment(itemData.createdAt).format(
              "h:mm A, Do MMMM YYYY"
            )}
            sender={itemData.sender}
            message={itemData.message}
          />
        );
      };

      let updatedMessageItemsForSingleColumn = response.data.map((item) =>
        generateSingleMessageItem(item)
      );

      let updatedMessageItemsForTwoColumns = { left: [], right: [] };
      for (let index = 0; index < response.data.length; index += 2) {
        let item = response.data[index];
        updatedMessageItemsForTwoColumns.left.push(
          generateSingleMessageItem(item)
        );

        if (index + 1 < response.data.length) {
          item = response.data[index + 1];
          updatedMessageItemsForTwoColumns.right.push(
            generateSingleMessageItem(item)
          );
        }
      }

      setMessageItemsForSingleColumn(updatedMessageItemsForSingleColumn);
      setMessageItemsForTwoColumns(updatedMessageItemsForTwoColumns);
      setMessagesLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function copyToClipBoard(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState({
        show: true,
        message: "Link copied! 😋",
      });
    } catch (error) {
      setCopyState({ show: true, message: "Some error occurred! 😭" });
      console.error(error);
    }
  }

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

  let [messageItemsForSingleColumn, setMessageItemsForSingleColumn] = useState(
    []
  );
  let [messageItemsForTwoColumns, setMessageItemsForTwoColumns] = useState({
    left: [],
    right: [],
  });
  let [screenWidth, setScreenWidth] = useState(window.innerWidth);
  let [copyState, setCopyState] = useState({ show: false, message: "" });
  let [messagesLoading, setMessagesLoading] = useState(true);

  useEffect(() => {
    retrieveMessages();
    window.addEventListener("resize", () => {
      setScreenWidth(window.innerWidth);
    });

    return window.removeEventListener("resize", () => {
      setScreenWidth(window.innerWidth);
    });
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Typography
          sx={{
            paddingX: 3,
            marginTop: 3,
            typography: ["h2", "h2", "h1", "h1", "h1"],
          }}
        >
          Hello {authentication.user.name}
        </Typography>
        {screenWidth < theme.breakpoints.values["md"] ? (
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginLeft: "auto", marginRight: 1 }}
            onClick={logout}
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<LogoutRoundedIcon />}
            sx={{ marginLeft: "auto", marginRight: 3 }}
            onClick={logout}
          >
            Logout
          </Button>
        )}
      </Box>

      <Box sx={{ marginX: [1, 8, 12, 18, 30], marginTop: 3 }}>
        <TextField
          color="secondary"
          label="SHARE WITH OTHERS TO RECEIVE MESSAGES"
          variant="outlined"
          focused
          fullWidth
          readOnly
          value={`${window.location.href.split("/")[2]}/send/${
            authentication.user._id
          }`}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={(e) =>
                    copyToClipBoard(
                      `${window.location.href}send/${authentication.user._id}`
                    )
                  }
                >
                  <ContentCopy />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {messagesLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            marginTop: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <Box
        sx={{
          marginX: [1, 8, 12, 18, 30],
          marginY: 5,
          display: messagesLoading ? "none" : "",
        }}
      >
        {screenWidth < theme.breakpoints.values["md"] ? (
          <Grid container spacing={2.5}>
            {messageItemsForSingleColumn}
          </Grid>
        ) : (
          <Grid
            container
            spacing={2.5}
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid container item spacing={2.5} sm={12} md={6}>
              {messageItemsForTwoColumns.left}
            </Grid>
            <Grid container item spacing={2.5} sm={12} md={6}>
              {messageItemsForTwoColumns.right}
            </Grid>
          </Grid>
        )}
      </Box>

      <Snackbar
        open={copyState.show}
        autoHideDuration={2500}
        onClose={() => setCopyState({ show: false, message: "" })}
        message={copyState.message}
      />
      <Typography>{}</Typography>
    </>
  );
}
