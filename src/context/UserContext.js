import { createContext, useState } from "react";

const UserContext = createContext({
  loggedInUser: null,
  setLoggedInUser: () => {},
});

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState({ id: "27", name: "User 27" });

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
