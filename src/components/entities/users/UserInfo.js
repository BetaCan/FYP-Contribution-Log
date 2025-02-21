import React from "react";
import {useState, useEffect, useContext, useCallback} from "react";
import API from "../../api/API.js";
import {Box, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import UserContext from "../../../context/UserContext";

const Item = styled(Paper)(({theme}) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const UserInfo = () => {
  // Initialisation -------------------------------------------------------------------------------------------------
  const {loggedInUser} = useContext(UserContext); // Get logged in user from context
  const loggedInUserID = loggedInUser?.UserID; // Assuming the user object has an id property

  // State ------------------------------------------------------------------------------------------------------
  const [users, setUsers] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("Loading records...");

  const loadUsers = useCallback(async () => {
    if (loggedInUserID) {
      const getUsersEndpoint = `/users/${loggedInUserID}`;
      const response = await API.get(getUsersEndpoint);
      if (response.isSuccess) {
        setUsers(response.result);
      } else {
        setLoadingMessage(response.message);
      }
    }
  }, [loggedInUserID]);

  useEffect(() => {
    loadUsers();
  }, [loggedInUserID, loadUsers]);

  useEffect(() => {
    users &&
      users.map((user) => {
        return user;
      });
  }, [users]);

  //View ------------------------------------------------------------------------------------------------------
  return (
    <Item>
      <Box>
        {users ? (
          users.map((user) => (
            <Box key={user.UserID} mb={1}>
              <Typography variant="h5" component="h2" gutterBottom>
                {user.UserFirstName} {user.UserLastName}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {user.UserEmail}
              </Typography>
              <Typography variant="body2">
                <strong>UserEmail:</strong> {user.UserEmail}
              </Typography>
              <Typography variant="body2">
                <strong>Role:</strong> {user.Role}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2">{loadingMessage}</Typography>
        )}
      </Box>
    </Item>
  );
};

export default UserInfo;
