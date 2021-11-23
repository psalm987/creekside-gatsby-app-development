import React from "react";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Slide,
  Typography,
  useScrollTrigger,
  Toolbar,
} from "@mui/material";
import PrivateRoute from "../../component/global/PrivateRoute";
import BackIcon from "@mui/icons-material/ArrowBack";
import themeContext from "../../state/theme/themeContext";
import { Link } from "gatsby";

const PageTemplate = ({ location, title, children, more }) => {
  const { lightMode } = React.useContext(themeContext);
  const background = lightMode ? "myBackground.main" : "background.default";

  const trigger = useScrollTrigger({ threshold: 10 });

  return (
    <PrivateRoute location={location}>
      <Box
        bgcolor={background}
        minHeight="100vh"
        display="flex"
        flexDirection="column"
      >
        <Slide in={!trigger} direction="down">
          <AppBar
            elevation={0}
            position="fixed"
            sx={{
              bgcolor: "background.default",
              borderBottom: 1,
              borderBottomColor: "divider",
            }}
          >
            <Container>
              <Toolbar>
                <IconButton sx={{ mr: 2 }} component={Link} to="/">
                  <BackIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  color="text.primary"
                  noWrap
                  flexGrow={1}
                >
                  {title}
                </Typography>
                {more}
              </Toolbar>
            </Container>
          </AppBar>
        </Slide>
        {children}
      </Box>
    </PrivateRoute>
  );
};

export default PageTemplate;
