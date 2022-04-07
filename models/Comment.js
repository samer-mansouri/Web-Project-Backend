const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User',
        required: true,
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Question',
        required: true,
    },
    comment: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
})

CommentSchema.set('toJSON', { virtuals: true })

CommentSchema.virtual("user", {
  ref: "User",
  foreignField: "_id",
  localField: "userId"
});


CommentSchema.plugin(timestamps);
mongoose.model("Comment", CommentSchema)