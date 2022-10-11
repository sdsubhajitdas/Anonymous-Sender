import {
  TextField,
  Typography,
  useTheme,
  Stack,
  Button,
  Alert,
  AlertTitle,
  Collapse,
  LinearProgress,
  Link,
} from "@mui/material";
import useAuthentication from "../../hooks/useAuthentication";
import Logo from "../../components/Logo/index";
import _ from "lodash";
import axios from "../../api/axios";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { registerValidation } from "../../utils/validation";
import { useState } from "react";

axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT_URL;

function Register() {
  const theme = useTheme();
  let { authentication, setAuthentication } = useAuthentication();
  // let updateAuthentication = useAuthenticationUpdate();
  const registerStyle = {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 3,
    boxShadow: theme.shadows[15],
    margin: "auto",
    marginY: 9,
    maxWidth: 400,
    p: 3,
  };

  async function register(event) {
    event.preventDefault();

    // Form Validation section
    let validationError = registerValidation(formValues);
    if (!_.isEmpty(validationError)) {
      setFormValidationError(validationError);
      return;
    }
    setFormValidationError({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // After form validation is performed we toggle submitted to true
    setSubmitted(true);
    let response = null;
    try {
      response = await axios.post("/users/register", {
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
      });
      response = await axios.post("/users/login", {
        email: formValues.email,
        password: formValues.password,
      });
      setError(null);
      setErrorAlertOpen(false);
    } catch (error) {
      console.log(error);
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
  let [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // All the validation errors for each form value
  let [formValidationError, setFormValidationError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
            <AlertTitle>Registration Error</AlertTitle>
            {error}
          </Alert>
        </Collapse>
      )}

      <form>
        <Stack spacing={2} sx={registerStyle}>
          <Typography variant="h3" align="center">
            Register
          </Typography>
          <TextField
            label="Name"
            color="secondary"
            type={"text"}
            value={formValues.name}
            onChange={(e) =>
              setFormValues((previous) => ({
                ...previous,
                name: e.target.value,
              }))
            }
            disabled={submitted}
            error={formValidationError.name ? true : false}
            helperText={formValidationError.name}
          />
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
          <TextField
            label="Confirm Password"
            color="secondary"
            type={"password"}
            value={formValues.confirmPassword}
            onChange={(e) =>
              setFormValues((previous) => ({
                ...previous,
                confirmPassword: e.target.value,
              }))
            }
            disabled={submitted}
            error={formValidationError.confirmPassword ? true : false}
            helperText={formValidationError.confirmPassword}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={register}
            type="submit"
            disabled={submitted}
          >
            Register
          </Button>
          <Link
            to="/login"
            component={RouterLink}
            align="center"
            color={"secondary"}
          >
            Already have an account ?
          </Link>
          {submitted && <LinearProgress color="warning" />}
        </Stack>
      </form>
    </>
  );
}

export default Register;
