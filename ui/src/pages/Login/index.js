import {
  Alert,
  AlertTitle,
  Button,
  Collapse,
  LinearProgress,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  useAuthentication,
  useAuthenticationUpdate,
} from "../../context/AuthenticationContext";
import Logo from "../../components/Logo";
import _ from "lodash";
import axios from "axios";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { loginValidation } from "../../utils/validation";
import { useState } from "react";

axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT_URL;

function Login() {
  const theme = useTheme();
  let authentication = useAuthentication();
  let updateAuthentication = useAuthenticationUpdate();
  const loginStyle = {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 3,
    boxShadow: theme.shadows[15],
    margin: "auto",
    marginY: 9,
    maxWidth: 400,
    p: 3,
  };

  async function login(event) {
    event.preventDefault();
    let validationError = loginValidation(formValues);
    if (!_.isEmpty(validationError)) {
      setFormValidationError(validationError);
      return;
    }
    setFormValidationError({
      email: "",
      password: "",
    });
    setSubmitted(true);
    let response = null;
    try {
      response = await axios.post("/users/login", {
        email: formValues.email,
        password: formValues.password,
      });
      setError(null);
      setErrorAlertOpen(false);
    } catch (error) {
      setError(error.response.data);
      setErrorAlertOpen(true);
    } finally {
      setSubmitted(false);
      updateAuthentication(_.isEmpty(response) ? null : response.data);
    }
  }

  let [formValues, setFormValues] = useState({ email: "", password: "" });
  let [formValidationError, setFormValidationError] = useState({
    email: "",
    password: "",
  });
  let [errorAlertOpen, setErrorAlertOpen] = useState(false);
  let [error, setError] = useState(null);
  let [submitted, setSubmitted] = useState(false);

  if (authentication.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Logo />

      {error && (
        <Collapse in={errorAlertOpen} sx={{ mt: 3, mx: [2, 15, 30, 45, 60] }}>
          <Alert
            severity="error"
            variant="filled"
            onClose={() => {
              setErrorAlertOpen(false);
            }}
          >
            <AlertTitle>Login Error</AlertTitle>
            {error}
          </Alert>
        </Collapse>
      )}

      <form>
        <Stack spacing={2} sx={loginStyle}>
          <Typography variant="h3" align="center">
            Login
          </Typography>
          <TextField
            label="Email"
            color="secondary"
            type={"email"}
            value={formValues.email}
            onChange={(e) =>
              setFormValues({ ...formValues, email: e.target.value })
            }
            disabled={submitted}
            error={formValidationError.email ? true : false}
            helperText={formValidationError.email}
          />
          <TextField
            label="Password"
            color="secondary"
            type={"password"}
            value={formValues.password}
            onChange={(e) =>
              setFormValues({ ...formValues, password: e.target.value })
            }
            disabled={submitted}
            error={formValidationError.password ? true : false}
            helperText={formValidationError.password}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={login}
            type="submit"
            disabled={submitted}
          >
            Login
          </Button>
          <Link
            to="/register"
            component={RouterLink}
            align="center"
            color={"secondary"}
          >
            Register as a new user ?
          </Link>
          {submitted && <LinearProgress color="warning" />}
        </Stack>
      </form>
    </>
  );
}

export default Login;
