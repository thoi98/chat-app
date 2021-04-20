const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        req.isAuth = true;
        return next();
    }
    const token = authHeader.split(" ")[1];
    if (!token || token === "") {
        req.isAuth = true;
        return next();
    }
    let decodedtoken;
    try {
        decodedtoken = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        req.isAuth = true;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedtoken.userId;
    req.email = decodedtoken.email;
    next();
};
