if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Post = require("../models/post");
const { places, descriptors, images } = require("./seedHelpers");
mongoose.set("strictQuery", false);

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelpcamp_v1";
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("mongo connection open");
  })
  .catch((e) => {
    console.log("mongo error", e);
  });

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Post.deleteMany({});
  for (let i = 0; i < 25; i++) {
    const image = sample(images);
    // user_id = "63b3f257c5f19c7d90c3d1ef" // laptop
    // user_id = "63b30714bc65da292b7b6389" // Desktop
    // user_id = "6381e5a4147f6271c4b38c14" // Atlas

    const post = new Post({
      author: "6381e5a4147f6271c4b38c14",
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dwkrtdkxt/image/upload/v1674799885/YelpCamp/hczudlhpxcwwiu0mthgr.jpg",
          filename: "hczudlhpxcwwiu0mthgr.jpg",
        },
      ],
      postText:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio ducimus soluta ullam assumenda. Porro tempore adipisci eius fuga commodi sint autem deleniti? Rem excepturi vel a modi optio esse accusamus.",
    });
    await post.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
