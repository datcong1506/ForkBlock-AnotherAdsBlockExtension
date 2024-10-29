const jwt = require('jsonwebtoken');

// Middleware function
function VerifyToken(req, res, next,secretKey) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        // Nếu xác thực thành công, lưu thông tin người dùng vào request
        req.userId = decoded.id;
        next();
    });
}


module.exports={ VerifyToken }