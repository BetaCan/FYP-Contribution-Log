import {createContext, useState, useEffect} from 'react'

const UserContext = createContext({
  loggedInUser: null,
  setLoggedInUser: () => {},
})

export const UserProvider = ({children}) => {
  // Check local storage for a saved user session
  const getSavedUser = () => {
    const savedUser = localStorage.getItem('loggedInUser')
    return savedUser ? JSON.parse(savedUser) : null
  }

  // State with user from local storage as initial value
  const [loggedInUser, setLoggedInUserState] = useState(getSavedUser())

  // Custom setter that also updates localStorage
  const setLoggedInUser = (user) => {
    setLoggedInUserState(user)
    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('loggedInUser')
    }
  }

  return (
    <UserContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
