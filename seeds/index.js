if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
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
  await Campground.deleteMany({});
  for (let i = 0; i < 250; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const image = sample(images);
    // user_id = "63b3f257c5f19c7d90c3d1ef" // laptop
    // user_id = "63b30714bc65da292b7b6389" // Desktop
    // user_id = "6381e5a4147f6271c4b38c14" // Atlas

    const camp = new Campground({
      author: "6381e5a4147f6271c4b38c14",
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [{ url: image.url, filename: image.filename }],
      price: Math.floor(Math.random() * 20 + 10),
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio ducimus soluta ullam assumenda. Porro tempore adipisci eius fuga commodi sint autem deleniti? Rem excepturi vel a modi optio esse accusamus.",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
