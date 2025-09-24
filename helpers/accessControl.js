// module.exports = {
//   hasRole: (user, allowedRoles = []) => {
//     if (!user) return false;

//     // normalize roles to array
//     const userRoles = Array.isArray(user.roles)
//       ? user.roles
//       : typeof user.roles === 'string'
//         ? [user.roles]
//         : [];

//     return allowedRoles.some(role => userRoles.includes(role));
//   },

//   hasPermission: (user, requiredPermissions = []) => {

//     console.log('user, requiredPermissions', user, requiredPermissions)
//     if (!user) return false;

//     // fix naming: your object uses `permission`, not `permissions`
//     console.log('user.permission', user.permission)
//     const userPermissions = Array.isArray(user.permission)
//       ? user.permission
//       : [];

//     return requiredPermissions.every(perm =>
//       userPermissions.includes('*') || userPermissions.includes(perm)
//     );
//   }
// };
