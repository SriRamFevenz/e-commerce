const multer = require("multer");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.code}` });
    }

    if (err.statusCode) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    console.error(err);
    res.status(500).json({ message: "Internal server error" });
};

module.exports = errorHandler;
