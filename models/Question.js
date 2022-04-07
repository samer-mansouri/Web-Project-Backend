const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const QuestionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    pictures: [
        {pictureUrl:String},
    ],
})

QuestionSchema.set('toJSON', { virtuals: true })

QuestionSchema.virtual("user", {
  ref: "User",
  foreignField: "_id",
  localField: "userId"
});

QuestionSchema.virtual("comments", {
    ref: "Comment",
    foreignField: "questionId",
    localField: "_id"
});

QuestionSchema.virtual('commentsNumber', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'questionId',
    count: true // Set `count: true` on the virtual
});
  

QuestionSchema.plugin(timestamps);
mongoose.model("Question", QuestionSchema)