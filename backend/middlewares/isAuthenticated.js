import jwt from "jsonwebtoken";
import dotenv  from "dotenv";
dotenv.config();

const isAuthenticated = async(req, res, next) => {
    try {
        console.log(req);
        
        const token = req.cookies.token;
        console.log("Token in request cookies:", token);  // Debugging line

        if (!token) {
            return res.status(401).json({
                message: "Please login first then proceed",
                success: false,
            });
        }

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