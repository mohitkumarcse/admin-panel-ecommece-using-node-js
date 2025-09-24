// const rolesConfig = require('../config/roles.json');

// function populateUserRoles(req, res, next) {
//   if (!req.user || req.user.role == null) {
//     return next();
//   }

//   const roleObj = rolesConfig.roles.find(r => r.id === req.user.role);

//   if (roleObj) {
//     req.user.roles = [roleObj.name]; // → ['admin'] or ['user']
//     req.user.permissions = roleObj.permissions; // → ['create', 'edit', ...]
//   } else {
//     req.user.roles = [];
//     req.user.permissions = [];
//   }

//   next();
// }

// module.exports = populateUserRoles;