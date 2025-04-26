import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "Authorization token missing or invalid",
                success: false,
            });
        }

        const token = authHeader.split(' ')[1]; // Extract the token part
        console.log("Token from Authorization header:", token);

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.id = decoded.userId;
            console.log("Decoded token:", decoded);

            next();
        } catch (err) {
            return res.status(401).json({
                message: "Invalid or expired token",
                success: false,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};

export default isAuthenticated;
