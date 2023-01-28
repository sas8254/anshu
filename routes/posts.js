const express = require("express");
const router = express.Router();
const posts = require("../controllers/posts");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validatePost, isAuthor } = require("../middleware");
const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(posts.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validatePost,
    catchAsync(posts.createPost)
  );

router.get("/new", isLoggedIn, posts.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(posts.showPost))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validatePost,
    catchAsync(posts.updatePost)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(posts.deletePost));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(posts.renderEditForm));

module.exports = router;
