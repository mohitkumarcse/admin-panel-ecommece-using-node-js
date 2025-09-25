// Make the function asynchronous
exports.is_loggedIn = async (req, res, next) => {
  try {
    if (req.cookies.token) {
      // Use await if verifyToken is asynchronous (highly likely)
      const tokenData = await verifyToken(req.cookies.token);

      // Check if tokenData is valid (i.e., not null/undefined)
      if (!tokenData || !tokenData.username || !tokenData.role) {
        throw new Error('Invalid token data');
      }

      req.username = tokenData.username;
      req.role = tokenData.role;

      // ✅ Must call next() when the check is successful
      next();
    } else {
      // Redirect if no token is found
      return res.redirect('/admin/login');
    }
  } catch (err) {
    // Catch any verification error (e.g., expired token, invalid format)
    console.error("Authentication Error:", err.message);

    // Redirect the user to the login page on failure
    return res.redirect('/admin/login');
  }
};