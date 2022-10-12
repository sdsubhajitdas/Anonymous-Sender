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
import useAuthentication from "../../hooks/useAuthentication";
import Logo from "../../components/Logo";
import _ from "lodash";
import axios from "../../api/axios";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { loginValidation } from "../../utils/validation";
import { useState } from "react";

function Login() {
  const theme = useTheme();
  let { authentication, setAuthentication } = useAuthentication();
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

    // Form Validation section
    let validationError = loginValidation(formValues);
    if (!_.isEmpty(validationError)) {
      setFormValidationError(validationError);
      return;
    }
    setFormValidationError({
      email: "",
      password: "",
    });

    // After form validation is performed we toggle submitted to true
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
      // Update authentication state only if login is successful
      if (!_.isEmpty(response))
        setAuthentication((previous) => ({
          ...previous,
          isAuthenticated: true,
          user: response.data,
        }));
    }
  }

  // All the form values
  let [formValues, setFormValues] = useState({ email: "", password: "" });
  // All the validation errors for each form value
  let [formValidationError, setFormValidationError] = useState({
    email: "",
    password: "",
  });
  // Decides whether to show error alert box or not.
  let [errorAlertOpen, setErrorAlertOpen] = useState(false);
  // Error message from the API
  let [error, setError] = useState(null);
  // Flag which indicates if the form was submitted or not
  let [submitted, setSubmitted] = useState(false);

  // If user is authenticated redirect to home page.
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
              setFormValues((previous) => ({
                ...previous,
                email: e.target.value,
              }))
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
              setFormValues((previous) => ({
                ...previous,
                password: e.target.value,
              }))
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
