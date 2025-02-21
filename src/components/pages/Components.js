import * as React from "react";
import {Avatar, Typography, Box, Stack, Divider} from "@mui/material";
import SignInPage from "../entities/SignIn/SignInPage";
import MultipleSelectPlaceholder from "../UI-Material/selector";
import BasicTextFields from "../UI-Material/TextFIeld";
import Icons from "../UI-Material/Icons";
import ToolTip from "../UI-Material/ToolTip";
import Alert from "../UI-Material/Alert";
import SimpleBackdrop from "../UI-Material/Backdrop";
import CircularIndeterminate from "../UI-Material/LoadingBar";
import AccordionUsage from "../UI-Material/Accordion";
import OutlinedCard from "../UI-Material/OutlineCard";
import BasicTabs from "../UI-Material/Tabs";
import BasicModal from "../UI-Material/Modal";

function Componenets() {
  // Properties -------------------------------------------------------------------------------------------------

  // Hooks ------------------------------------------------------------------------------------------------------

  // Context ----------------------------------------------------------------------------------------------------

  // Methods ----------------------------------------------------------------------------------------------------

  // View -------------------------------------------------------------------------------------------------------

  return (
    <Box>
      <Stack
        spacing={2}
        divider={<Divider orientation="horizontal" flexItem sx={{borderBottomWidth: 3}} />}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to the components page
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Sign In Section
          </Typography>
          <SignInPage />
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Avatar Section
          </Typography>
          <Avatar
            alt="Public_Avatar"
            src="https://avatar.iran.liara.run/public/35"
            sx={{width: 200, height: 200}}
          />
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Selector
          </Typography>
          <MultipleSelectPlaceholder />
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            TextField
          </Typography>
          <BasicTextFields />
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Icons
          </Typography>
          <Icons />
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            ToolTip
          </Typography>
          <ToolTip />
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Alert
          </Typography>
          <Alert />
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Backdrop
          </Typography>
          <SimpleBackdrop />
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Loading Bar
          </Typography>
          <CircularIndeterminate />
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Accordion
          </Typography>
          <AccordionUsage />
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Outline Card
          </Typography>
          <OutlinedCard />
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Tabs
          </Typography>
          <BasicTabs />
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Modal
          </Typography>
          <BasicModal />
        </Box>
      </Stack>
    </Box>
  );
}

export default Componenets;
