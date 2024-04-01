const express = require("express");

const {
  getOneReview,
  createReview,
  deleteReview,
  updateReview,
  grabUserAndReview,
} = require("../queries/reviews.js");
const { getOneTeapot } = require("../queries/teapots.js");

const reviews = express.Router({ mergeParams: true });

const { checkContentRating } = require("../validations/validateReview.js");

//Index Route (api/teapots/2/reviews)
reviews.get("/", async (req, res) => {
  const { teapot_id } = req.params;

  const allReviews = await grabUserAndReview(teapot_id);

  const teapot = await getOneTeapot(teapot_id);

  if (teapot.id) {
    res.status(200).json({ ...teapot, allReviews });
  } else {
    res.status(500).json({ error: "server error" });
  }
});

//Show Route (api/teapots/1/reviews/2)
reviews.get("/:review_id", async (req, res) => {
  const { teapot_id, review_id } = req.params;

  const review = await getOneReview(review_id);

  const teapot = await getOneTeapot(teapot_id);

  if (review.teapot_id === teapot.id && review) {
    res.status(200).json({ ...teapot, review });
  } else {
    res.status(500).json({ error: "Review not found" });
  }
});

//Create Route (api/teapots/2/reviews)
reviews.post("/", checkContentRating, async (req, res) => {
  const { teapot_id } = req.params;
  // console.log(req.body, teapot_id)
  const newReview = await createReview({ ...req.body, teapot_id });

  if (newReview.id) {
    res.status(200).json(newReview);
  } else {
    res.status(500).json({ error: "Failed to create review." });
  }
});

//Delete Route (api/teapots/1/reviews/2)
reviews.delete("/:review_id", async (req, res) => {
  const { review_id } = req.params;

  const deletedReview = await deleteReview(review_id);

  if (deletedReview.id) {
    res.status(200).json(deletedReview);
  } else {
    res.status(404).json({ error: "Review not found" });
  }
});

//Update Route (api/teapots/1/reviews/2)
reviews.put("/:review_id", checkContentRating, async (req, res) => {
  const { teapot_id, review_id } = req.params;
  const updatedReview = await updateReview({
    review_id,
    ...req.body,
    teapot_id,
  });
  if (updatedReview.id) {
    res.status(200).json(updatedReview);
  } else {
    res.status(404).json({ error: "Review not found" });
  }
});

module.exports = reviews;
