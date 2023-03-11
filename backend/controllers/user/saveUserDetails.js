const userServices = require('../../services/user')

const saveUserDetails = async (req, res, next) => {
    const { username, roomId } = req.body

    const userExists = await userServices.findUser({ roomId, users: { $elemMatch: { role: { $ne: '0' } } } })

    console.log(userExists)

    let user
    if (userExists) {
        userExists.users.map(async (ele) => {
            if (ele.username !== username && ele.role !== '0') {
                user = await userServices.updateUser(roomId, {
                    $push: {
                        users: {
                            username: username,
                            role: '1',
                        },
                    },
                })
            }
        })
    } else {
        user = await userServices.createUser({
            active: true,
            roomId: roomId,
            users: { username: username, role: '0' },
        })
        if (!user) {
            return res.status(200).json({ success: false, message: 'Unable to save user details', data: null })
        }

        if (user.err) {
            const { err } = user
            return next(err)
        }
    }

    return res.status(200).json({ success: true, message: 'User details saved successfully', data: user })
}

module.exports = saveUserDetails
