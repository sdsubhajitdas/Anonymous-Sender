import {
  Grid,
  useTheme,
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
} from "@mui/material";
import {
  DeleteForeverRounded as DeleteIcon,
  CheckRounded as CheckIcon,
  CloseRounded as CloseIcon,
} from "@mui/icons-material";
import _ from "lodash";
import { useState } from "react";

export default function MessageItem({ createdAt, sender, message }) {
  const theme = useTheme();
  let [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <Grid item xs={12} sm={12} md={12}>
      <Card variant="outlined" sx={{ boxShadow: theme.shadows[13] }}>
        <CardContent>
          <Typography variant="caption" color="text.secondary">
            {createdAt}
          </Typography>
          <Typography
            variant="h5"
            component="div"
            marginTop={0.5}
            paddingX={0.5}
          >
            {_.isEmpty(sender) ? "Anonymous" : sender}
          </Typography>
          <Typography
            variant="body2"
            marginTop={1}
            paddingX={0.5}
            sx={{ wordBreak: "break-word" }}
          >
            {message}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {confirmDelete ? (
            <>
              <Typography
                variant="overline"
                marginLeft={"auto"}
                color="secondary"
              >
                Confirm delete! 😨
              </Typography>
              <IconButton
                aria-label="Cancel delete"
                marginLeft={2}
                color="secondary"
                onClick={() => setConfirmDelete(false)}
              >
                <CloseIcon />
              </IconButton>
              <IconButton
                aria-label="Confirm delete"
                marginLeft={2}
                color="success"
                onClick={() => setConfirmDelete(false)}
              >
                <CheckIcon />
              </IconButton>
            </>
          ) : (
            <IconButton
              aria-label="Delete message"
              color="warning"
              sx={{ marginLeft: "auto" }}
              onClick={() => setConfirmDelete(true)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
}
