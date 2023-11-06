
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    postNum:Number,
    image: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    repleNum: {
      type: Number,
      default: 0,
    },
  },{timestamps: true});

const Post = mongoose.model('posts', postSchema);

module.exports = { Post } ;




// const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema({
//     title: String,
//     content: String,
// }, {collation : "posts"});

// const Post = mongoose.model("Post", postSchema);

// module.exports = { Post };