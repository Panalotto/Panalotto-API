import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Kunin ang token mula sa header

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // I-save ang decoded user data sa request
        next(); // Tuloy sa susunod na middleware o route handler
    } catch (error) {
        return res.status(403).json({ message: "Invalid token. Please log in again." });
    }
};

export default authMiddleware;
