import * as React from "react";
import {Container, TextField, Button, Box} from "@mui/material";

function SignInPage() {
  // Properties -------------------------------------------------------------------------------------------------

  // Hooks ------------------------------------------------------------------------------------------------------

  // Context ----------------------------------------------------------------------------------------------------

  // Methods ----------------------------------------------------------------------------------------------------

  // View -------------------------------------------------------------------------------------------------------

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        {/* <Typography variant="h4" component="h1" gutterBottom>
          Sign In
        </Typography> */}
        <TextField label="Email" variant="outlined" margin="normal" fullWidth required />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          required
        />
        <Button variant="contained" color="primary" fullWidth>
          Sign In
        </Button>
      </Box>
    </Container>
  );
}

export default SignInPage;
