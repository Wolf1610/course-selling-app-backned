
const jwt = require('jsonwebtoken');
const { JWT_ADMIN } = require('../config');
function adminMiddleware(req, res, next){
    const token = req.headers.token;
    if(!token) {
        return res.status(403).json({ message: "Admin doesn't exist" });
    }
    const decoded = jwt.verify(token, JWT_ADMIN);
    if(decoded) {
        req.userId = decoded.id;
        next();
    } else {
        res.status(403).json({
            message: "Not signin, try again..."
        })
    }
  
}

module.exports = {
    adminMiddleware: adminMiddleware
}