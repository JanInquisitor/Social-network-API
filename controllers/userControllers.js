const User = require("./../models/thoughtModel");
const catchAsync = require("./../utils/catchAsync");


exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find()

    res.status(200).json({
        status: "Success",
        "results": users.length,
        data: {
            users
        }
    })
})

exports.getUser = catchAsync(async (req, res) => {
    console.log(req.params)
    const user = await User.findById(req.params.id)

    res.status(200).json({
        status: "Success",
        data: {
            user
        }
    })
})

exports.createUser = catchAsync(async (req, res) => {
    const newUser = await User.create(req.body)

    res.status(201).json({
        status: "success",
        data: {
            newUser
        }
    })
})

exports.deleteUser = catchAsync(async (req, res) => {
    console.log(req.params)
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
        return res.status(404).json({message: 'No document was found with that ID'});
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
})

exports.updateUser = catchAsync(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return res.status(404).json({message: 'This user does not exist'});
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
})

exports.addFriend = catchAsync(async (req, res) => {
    User.findOneAndUpdate(
        {_id: req.params.userId},
        {$addToSet: {friends: req.params.friendId}},
        {runValidators: true, new: true}
    )
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({message: 'No user with this id!'});
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(500).json(err));

});


exports.removeFriend = catchAsync(async (req, res) => {
    User.findOneAndUpdate(
        {_id: req.params.userId},
        {$pull: {friends: req.params.friendId}},
        {runValidators: true, new: true}
    )
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({message: 'No user with this id!'});
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(500).json(err));
})