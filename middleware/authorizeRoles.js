// const roles = require('../config/roles.json');
// const { createToken, verifyToken, } = require('../services/authentication');
// const authorizeRoles = (...allowedRoles) => {
//   return (req, res, next) => {

//     const rawToken = req.cookies?.role?.token || req.cookies?.token;

//     if (!rawToken || typeof rawToken !== 'string') {
//       return res.status(401).render('403', { title: 'Unauthroized', layout: false });
//     }

//     const token = verifyToken(rawToken)

//     req.user = token;

//     const setRole = roles.roles.find(role => role.id);

//     if (!req.user || !allowedRoles.includes(setRole.name)) {
//       return res.status(403).render('403', { title: 'Unauthroized', layout: false });
//     }
//     next();
//   };
// };

// module.exports = authorizeRoles;