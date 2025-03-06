const jwtVerification = (req,res,next) => {
    const token = req?.cookies?.accessToken || req.headers?.authorization?.split(' ')[1];
    if (!token) {
        return res.status(402).json({
            message:"unauthorized request"
        })
    }
    
}