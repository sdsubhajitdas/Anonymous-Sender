import { Box, Typography, useTheme } from "@mui/material";
import LogoImage from "../LogoImage";

export default function Logo() {
  const theme = useTheme();
  const logoStyle = {
    fill: theme.palette.text.primary,
    height: parseInt(theme.spacing()) * 13,
    padding: parseInt(theme.spacing()),
    width: parseInt(theme.spacing()) * 13,
  };

  return (
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
      <LogoImage style={logoStyle} />
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
  );
}
