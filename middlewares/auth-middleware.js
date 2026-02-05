import jwt from "jsonwebtoken";
const authenticateUser=(req,res,next)=>{
    const token=req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Authentication invalid: No token provided" });
    }

    try {
     const decoded = jwt.verify(token, process.env.JWT_SECRET);

     console.log("Token Data:", decoded);

        req.user = { 
        id: decoded.id, 
        email: decoded.email, 
        role: decoded.role,
    name: decoded.name
    };

        next()
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ error: "Authentication invalid: Token expired or corrupt" });
    }
}

 const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Role: ${req.user.role} is not allowed to access this resource`,
            });
        }
        next();
    };
};

export{authenticateUser,authorizeRoles}