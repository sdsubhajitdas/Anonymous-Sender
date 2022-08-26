import {
  Grid,
  useTheme,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import _ from "lodash";

export default function MessageItem({ createdAt, sender, message }) {
  const theme = useTheme();

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
          <Typography variant="body2" marginTop={1} paddingX={0.5}>
            {message}
          </Typography>
        </CardContent>
        {/* <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions> */}
      </Card>
    </Grid>
  );
}
