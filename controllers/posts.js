const Post = require("../models/post");
const { cloudinary } = require("../cloudinary/index");

module.exports.index = async (req, res) => {
  const posts = await Post.find({});
  res.render("posts/index", { posts });
};

module.exports.renderNewForm = (req, res) => {
  res.render("posts/new");
};

module.exports.createPost = async (req, res) => {
  const post = new Post(req.body.post);
  post.author = req.user._id;
  post.images = req.files.map((f) => {
    return { url: f.path, filename: f.filename };
  });
  await post.save();
  req.flash("success", "Successfully made a post.");
  res.redirect(`/posts/${post._id}`);
};

module.exports.showPost = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate({
      path: "comments",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!post) {
    req.flash("error", "Post not found!");
    return res.redirect("/posts");
  }
  res.render("posts/show", { post });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    req.flash("error", "Post not found!");
    return res.redirect("/posts");
  }
  res.render("posts/edit", { post });
};

module.exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const images = req.files.map((f) => {
    return { url: f.path, filename: f.filename };
  });
  const post = await Post.findByIdAndUpdate(id, {
    ...req.body.post,
  });
  await post.images.push(...images);
  await post.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await post.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  req.flash("success", "Successfully updated Post.");
  res.redirect(`/posts/${post._id}`);
};

module.exports.deletePost = async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted post!");
  res.redirect("/posts");
};
