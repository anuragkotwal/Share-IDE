const userServices = require('../../services/user')

const getUsers = async (req, res, next) => {
    const { roomId, username } = req.query
    const user = await userServices.findUser({ roomId, 'users.username': username })

    if (!user) {
        return res.status(200).json({ success: false, message: 'Unable to get user details', data: null })
    }

    if (user.err) {
        const { err } = user
        return next(err)
    }

    return res.status(200).json({ success: true, message: 'User details fetched successfully', data: user.users })
}

module.exports = getUsers