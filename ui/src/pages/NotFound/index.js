import { Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export default function NotFound() {
  let divideFactor = 0.8;

  let [screenWidth, setScreenWidth] = useState(
    window.innerWidth * divideFactor
  );

  let playerWidth = Math.floor(screenWidth / 16) * 16;
  let playerHeight = (playerWidth * 9) / 16;

  console.log(screenWidth + ": " + playerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setScreenWidth(window.innerWidth * divideFactor);
    });

    return window.removeEventListener("resize", () => {
      setScreenWidth(window.innerWidth * divideFactor);
    });
  }, []);

  return (
    <Stack
      gap={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 1,
        marginTop: 5,
        height: "90vh",
        maxHeight: "100%",
      }}
    >
      <Typography variant="h2" marginBottom={1}>
        Sorry! 🥲 Page not found
      </Typography>
      <iframe
        width={playerWidth}
        height={playerHeight}
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </Stack>
  );
}
