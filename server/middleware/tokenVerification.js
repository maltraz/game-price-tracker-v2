const jwt = require("jsonwebtoken");

function tokenVerification(req, res, next) {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decodedUser) => {
        if (err) {
            console.log("Unauthorized!");
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.user = decodedUser;
        console.log("Token poprawny, użytkownik: " + decodedUser._id);
        next();
    });
}

module.exports = tokenVerification;
