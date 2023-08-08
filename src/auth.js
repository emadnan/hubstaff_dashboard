// Example authentication logic
export const isAuthenticated = () => {
  // Check if the user is authenticated
  // Replace this with your own authentication check
  const user = JSON.parse(localStorage.getItem('user-info'))
  return localStorage.getItem(user.token) !== null
}

// Example user Permision retrieval
export const getUserNavPermision = () => {
  const user = JSON.parse(localStorage.getItem('user-info'))
  if (user) {
    // Extract the permission names from the permissions array
    const permissions = user.permissions.map((permission) => permission.name)
    return permissions
  }
  return null
}
