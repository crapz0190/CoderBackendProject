export const authMiddleware = (roles) => {
  return (req, res, next) => {
    // if (roles.includes("public")) {
    //   return next();
    // }
    if (!req.user || !req.user.role) {
      return res.status(401).json("Not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json("Not authorized");
    }
    next();
  };
};
