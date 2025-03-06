import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const accessAndRefreshToken = async (user) => {
    console.log("user=> ", user);

    const accessToken = jwt.sign({
        userid: user._id,
        username: user.username,
        password: user.password,
    },
        process.env.SECRET_ACCESS_KEY,
        { expiresIn: process.env.SECRET_ACCESS_EXPIRY }
    )


    const refreshToken = jwt.sign({
        userid: user._id,
        username: user.username,
        password: user.password,
    },
        process.env.SECRET_REFRESH_KEY,
        { expiresIn: process.env.SECRET_REFRESH_EXPIRY }
    )


    return { accessToken, refreshToken };

}