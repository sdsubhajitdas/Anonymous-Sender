import {
  Box,
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
import {
  useAuthentication,
  useAuthenticationUpdate,
} from "../../context/AuthenticationContext";
import Logo from "../../components/Logo/index";
import _ from "lodash";
import axios from "axios";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { registerValidation } from "../../utils/validation";
import { useState } from "react";

axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT_URL;

function Register() {
  const theme = useTheme();
  let authentication = useAuthentication();
  let updateAuthentication = useAuthenticationUpdate();
  const logoStyle = {
    fill: theme.palette.text.primary,
    height: parseInt(theme.spacing()) * 13,
    padding: parseInt(theme.spacing()),
    width: parseInt(theme.spacing()) * 13,
  };
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
      console.log(response.data);
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

  let [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  let [formValidationError, setFormValidationError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  let [errorAlertOpen, setErrorAlertOpen] = useState(false);
  let [error, setError] = useState(null);
  let [submitted, setSubmitted] = useState(false);

  if (authentication.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
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
              setFormValues({ ...formValues, name: e.target.value })
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
          <TextField
            label="Confirm Password"
            color="secondary"
            type={"password"}
            value={formValues.confirmPassword}
            onChange={(e) =>
              setFormValues({ ...formValues, confirmPassword: e.target.value })
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
