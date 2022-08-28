import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Logo from "../../components/Logo/index";
import _ from "lodash";
import axios from "axios";
import { Send as SendIcon } from "@mui/icons-material";
import { messageValidation } from "../../utils/validation";
import { useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT_URL;

export default function Send() {
  const theme = useTheme();
  const { userId } = useParams();
  const logoStyle = {
    fill: theme.palette.text.primary,
    height: parseInt(theme.spacing()) * 13,
    padding: parseInt(theme.spacing()),
    width: parseInt(theme.spacing()) * 13,
  };

  async function sendMessage(event) {
    event.preventDefault();
    let validationError = messageValidation(formValues);
    if (!_.isEmpty(validationError)) {
      setFormValidationError(validationError);
      return;
    }
    setFormValidationError({
      message: "",
    });
    setSubmitted(true);
    try {
      await axios.post("/messages", {
        userId: userDetails._id,
        sender: formValues.sender,
        message: formValues.message,
      });
      setMessageSent(true);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitted(false);
    }
  }

  async function checkUserDetails(userId) {
    try {
      let { data } = await axios.get(`/users/${userId}`);
      setUserDetails(data);
    } catch (error) {
      let { status } = error.response;
      setUserNotFound(status === 404);
    }
  }

  let [submitted, setSubmitted] = useState(false);
  let [messageSent, setMessageSent] = useState(false);
  let [userNotFound, setUserNotFound] = useState(false);
  let [userDetails, setUserDetails] = useState();
  let [formValues, setFormValues] = useState({
    sender: "",
    message: "",
    characters: 0,
  });
  let [formValidationError, setFormValidationError] = useState({
    message: "",
  });

  useEffect(() => {
    checkUserDetails(userId);
  }, []);

  // If user id is invalid then redirect to not found page
  if (userNotFound) {
    return <Navigate to="/not-found" />;
  }

  // Display loading screen while user id details are loaded
  if (!userDetails) {
    return (
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
    );
  }

  return (
    <>
      <Link href="/" underline="none" color={theme.palette.text.primary}>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Logo style={logoStyle} />
          <Typography
            variant="logoLarge"
            align="center"
            component={"h2"}
            sx={{
              ml: {
                xs: 0,
                sm: 2.5,
                md: 5,
              },
            }}
          >
            Anonymous Sender
          </Typography>
        </Box>
      </Link>

      {messageSent && (
        <Box
          sx={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginTop: 20,
          }}
        >
          <Typography variant="h4" align="center">
            Your message was sent to {userDetails.name.split(" ")[0]}
          </Typography>
        </Box>
      )}

      {!messageSent && (
        <form>
          <Stack
            spacing={2}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 3,
              boxShadow: theme.shadows[15],
              margin: "auto",
              marginY: 5,
              maxWidth: 750,
              p: 3,
            }}
          >
            <Typography variant="h4" marginBottom={2}>
              Leave a message for {userDetails.name.split(" ")[0]}
            </Typography>
            <TextField
              label="Name (Optional)"
              variant="outlined"
              color="secondary"
              disabled={submitted}
              value={formValues.sender}
              onChange={(e) =>
                setFormValues({ ...formValues, sender: e.target.value })
              }
            />
            <TextField
              label="Message"
              variant="outlined"
              color="secondary"
              disabled={submitted}
              error={formValidationError.message ? true : false}
              helperText={
                formValidationError.message
                  ? formValidationError.message
                  : `${formValues.characters} Characters`
              }
              value={formValues.message}
              onChange={(e) => {
                setFormValidationError({ message: "" });
                setFormValues({
                  ...formValues,
                  message: e.target.value,
                  characters: e.target.value.length,
                });
              }}
              multiline
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={sendMessage}
              type="submit"
              disabled={submitted}
              endIcon={<SendIcon sx={{ marginLeft: 1 }} />}
            >
              Send message
            </Button>
            {submitted && <LinearProgress color="warning" />}
          </Stack>
        </form>
      )}
    </>
  );
}
