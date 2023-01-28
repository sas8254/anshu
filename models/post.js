const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./comment");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const PostSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    postText: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  opts
);

PostSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Comment.deleteMany({ _id: { $in: doc.Comments } });
  }
});

module.exports = mongoose.model("Post", PostSchema);
