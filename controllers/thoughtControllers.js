// const Thought = require("./../models/thoughtModel");

const {Thought, User} = require('../models');

module.exports = {
    getThoughts(req, res) {
        Thought.find()
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err));
    },
    getSingleThought(req, res) {
        Thought.findOne({_id: req.params.thoughtId})
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({message: 'No thought with that ID'})
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    {_id: req.body.userId},
                    {$push: {thoughts: thought._id}},
                    {new: true}
                );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({message: 'Thought created but no user with this id!'});
                }
                res.json({message: 'Successful thinking! '});
            })
            .catch((err) => res.status(500).json(err));
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$set: req.body},
            {new: true}
        )
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({message: 'No user with this id!'});
                }
                res.json(thought);
            })
            .catch((err) => res.status(500).json(err));
    },
    deleteThought(req, res) {
        Thought.findOneAndDelete({_id: req.params.thoughtId})
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({message: 'No thought with this id'});
                }

                return User.findOneAndUpdate(
                    {_id: req.body.userId},
                    {$pull: {thoughts: req.params.thoughtId}},
                    {new: true}
                );
            })
            .then((thought) => {
                if (!thought) {
                    return res.json(({message: 'Thought successfully deleted!'}));
                }
            })
            .catch((err) => res.status(500).json(err));
    },
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$push: {reactions: req.body}},
            {new: true, runValidators: true}
        )
            .then(thoughts => {
                if (!thoughts) {
                    res.status(404).json({message: 'No Thoughts Using This ID Found!'});
                    return;
                }

                res.json(thoughts);

            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$pull: {reactions: {reactionId: req.params.reactionId}}},
            {runValidators: true, new: true}
        )
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({message: 'Bad reaction!'});
                }
                res.json(thought);
            })
            .catch((err) => res.status(500).json(err));
    },
};
