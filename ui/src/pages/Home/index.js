import MessageItem from "../../components/MessageItem/index";
import axios from "axios";
import moment from "moment";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { useAuthentication } from "../../context/AuthenticationContext";
import { useEffect, useState } from "react";

axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT_URL;

export default function App() {
  let theme = useTheme();
  let authentication = useAuthentication();
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${authentication.user.accessToken}`;

  async function retrieveMessages() {
    try {
      const response = await axios.get("/messages");

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
      // let perms = await navigator.permissions.query({ name: "clipboard-read" });
      await navigator.clipboard.writeText(text);
      setCopyState({
        show: true,
        message: "Link copied",
      });
      // console.log(perms);
      // alert(Object.keys(perms).join(","))?
      // console.log(`Text: \"${text}\" copied to clipboard`);
    } catch (error) {
      setCopyState({ show: true, message: "Some error occurred" });
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
      <Typography
        sx={{
          paddingX: 3,
          marginTop: 3,
          typography: ["h2", "h2", "h1", "h1", "h1"],
        }}
      >
        Hello {authentication.user.name}
      </Typography>

      <Box sx={{ marginX: [1, 8, 12, 18, 30], marginTop: 3, paddingX: 5 }}>
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
        autoHideDuration={500}
        onClose={() =>
          setCopyState({ show: false, message: copyState.message })
        }
        message={copyState.message}
      />
      <Typography>{}</Typography>
    </>
  );
}
