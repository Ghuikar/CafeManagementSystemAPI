require("dotenv").config();

const checkRole = (req, res, next) => {
    
        console.log("res.locals.role",res.locals.role)
    const user = process.env.USER;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (res.locals.role == user) {
      return res.sendStatus(401);
    }

    next();
  
};

module.exports = checkRole;
