import bcrypt, { hash } from 'bcrypt'
export const hashedPwd = async (pwd) => {

    try {
        const hashRound = 10
        const hashedPwd = await hash(pwd, hashRound)
        return hashedPwd
    } catch (error) {
        console.log("error", error);
    }
}

export const comparePwd = async (pwd, hashedPwd) => {
    try {
        const isMatch = bcrypt.compare(pwd, hashedPwd)
        console.log("ismatch", isMatch);

        return isMatch

    } catch (error) {
        console.log("error", error);

        return resizeBy.status(500).json({
            message: "server error"
        })
    }
}