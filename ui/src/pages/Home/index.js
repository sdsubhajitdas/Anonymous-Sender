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
import { useEffect, useState } from "react";
import Logout from "../../components/Logout";
import MessageItem from "../../components/MessageItem/index";
import moment from "moment";
import useAuthentication from "../../hooks/useAuthentication";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export default function App() {
  let theme = useTheme();
  let { authentication } = useAuthentication();
  const axiosPrivate = useAxiosPrivate();

  async function retrieveMessages() {
    setMessagesLoading(true);
    try {
      const response = await axiosPrivate.get("/messages");

      if (response.data.length <= 0) {
        setNoMessages(true);
        setMessagesLoading(false);
        return;
      }

      const generateSingleMessageItem = (itemData) => {
        return (
          <MessageItem
            key={itemData._id}
            messageId={itemData._id}
            createdAt={moment(itemData.createdAt).format(
              "h:mm A, Do MMMM YYYY"
            )}
            sender={itemData.sender}
            message={itemData.message}
            retrieveMessages={retrieveMessages}
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
    } catch (error) {
      console.error(error);
    } finally {
      setMessagesLoading(false);
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
  let [noMessages, setNoMessages] = useState(false);

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
        <Logout screenWidth={screenWidth} />
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

      {noMessages && !messagesLoading ? (
        <Typography variant="h3" textAlign={"center"} marginTop={13}>
          Sorry 😔, no messages yet !
        </Typography>
      ) : (
        <Box
          sx={{
            marginX: [1, 8, 12, 18, 30],
            marginY: 5,
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
      )}

      <Snackbar
        open={copyState.show}
        autoHideDuration={2500}
        onClose={() => setCopyState({ show: false, message: "" })}
        message={copyState.message}
      />
    </>
  );
}
