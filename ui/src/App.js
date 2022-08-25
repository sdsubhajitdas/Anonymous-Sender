import Login from "./pages/Login/index";
import Register from "./pages/Register/index";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Routes, Route } from "react-router-dom";

export default function App() {
  const theme = createTheme(getDesignTokens("dark"));
  // const theme = createTheme(getDesignTokens("light"));

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          border: 15,
          borderColor: "primary.main",
          width: "100%",
          height: "100%",
          minHeight: "100vh",
          padding: 1,
        }}
      >
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

function getDesignTokens(mode) {
  return {
    palette: {
      mode,
      background: {
        ...(mode === "dark" && {
          paper: "#424242",
          default: "#303030",
        }),
        ...(mode === "light" && {
          paper: "#FFFFFF",
          default: "#FAFAFA",
        }),
      },
      divider:
        mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
      primary: {
        main: "#7B16FF",
        light: "#9544FF",
        dark: "#560FB2",
      },
      secondary: {
        main: "#F50057",
        light: "#F73378",
        dark: "#AB003C",
      },
      error: {
        main: "#F44336",
        light: "#E57373",
        dark: "#D32F2F",
      },
      warning: {
        main: "#FF9800",
        light: "#FFB74D",
        dark: "#F57C00",
      },
      info: {
        main: "#2196F3",
        light: "#64B5F6",
        dark: "#1976D2",
      },
      success: {
        main: "#4CAF50",
        light: "#81C784",
        dark: "#388E3C",
      },
    },
    typography: {
      logoLarge: {
        fontFamily: ["Gochi Hand", "cursive"].join(","),
        fontWeight: 400,
        fontSize: "4.5rem",
        lineHeight: 1.18,
        letterSpacing: "−0.01198em",
      },
    },
  };
}
