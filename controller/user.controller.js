import { accessAndRefreshToken } from "../accessAndRefreshToken.js";
import { comparePwd, hashedPwd } from "../hashpwd.js";
import User from "../model/user.model.js";

const userRegistration = async (req, res) => {
    const { name, email, username, password } = req.body.formData
    console.log("name", name);
    console.log("email", email);
    console.log("username", username);
    console.log("password", password);


    try {
        // check all fields come or not
        if (!name || !email || !username || !password) {
            console.log("all fields are required");
            return res.status(400).json({
                message: "all fields are reuired"
            })
        }
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            console.log("user already exist");
            return res.status(401).json({
                message: 'user already exist'
            })
        }

        const hashedPass = await hashedPwd(password)
        console.log("hashed password", hashedPass);

        const newUser = await new User({
            name,
            username,
            email,
            hashpassword: hashedPass,
            password: password
        })

        const user = await newUser.save()
        if (!user) {
            return res.status(402).json({
                message: "registration failed",
                status: false
            })
        }
        if (user) {
            return res.status(200).json({
                message: "registraion success",
                status: true
            })
        }

        console.log("user", user);
    } catch (error) {
        console.log("error", error);
    }
}
const userLogin = async (req, res) => {
    const { userNameOrEmail, password } = req.body.loginDetail
    console.log("userNameOrEmail", userNameOrEmail);
    console.log("password", password);

    if (!userNameOrEmail || !password) {
        return res.status(400).json({
            message: "insert all crediantial"
        })
    }
    try {
        const user = await User.findOne({
            $or: [{ username: userNameOrEmail }, { email: userNameOrEmail }]
        });

        console.log("user", user);
        if (!user) {
            return res.status(401).json({
                message: "user not found"
            })
        }
        // check password
        const chkpwd = await comparePwd(password, user.hashpassword)
        if (!chkpwd) {
            return res.status(401).json({
                message: "password is incorrect",
                success: false
            })
        }
        console.log("chkpwd", chkpwd);

        const { accessToken, refreshToken } = await accessAndRefreshToken(user)
        console.log("accesstoken", accessToken);
        console.log("refreshToken", refreshToken);

        //send refresh token in database
        user.refreshToken = refreshToken
        await user.save()

        return res.status(200)
            .json({
                message: "user logged in succesfully",
                success: true,
                userData: user,
                accessToken: accessToken
            })
    } catch (error) {
        console.log("error line no 109", error);
        return res.status(500).json({
            message: "server error",
            success: false
        })

    }
}

export { userRegistration, userLogin } 