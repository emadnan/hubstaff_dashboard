// Example authentication logic
export const isAuthenticated = () => {
  // Check if the user is authenticated
  // Replace this with your own authentication check
  const user = JSON.parse(localStorage.getItem('user-info'))
  return localStorage.getItem(user.token) !== null
}

// Example user role retrieval
export const getUserRole = () => {
  // Get the user's role from your user object or token
  // Replace this with your own logic to retrieve the user's role
  const user = JSON.parse(localStorage.getItem('user-info'))
  return user ? user.Users.role : null
}
