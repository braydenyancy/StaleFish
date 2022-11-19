const { client } = require('./');

async function createReview({name, description, rating,  productId}) {
    try {
      const { rows: [review]} = await client.query(`
        INSERT INTO reviews (name, description, rating, "productId")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `, [name, description, rating, productId])
      
      return review;
    }
    catch(error) {
      throw error
    }
  }

  async function getReviewById(id) {
    try {
      const { rows: [review] } = await client.query(`
        SELECT *
        FROM reviews
        WHERE id=$1;  
      `, [id]);
  
      if (!review) {
        throw {
          error: "error",
          name: "Review Not Found",
          message: "The requested review was not found"
        };
        // console.log("Error finding product")
      }
  
      return review
    } catch(error) {
      throw error;
    }
  }

  async function getAllReviews() {
    try {
      const { rows: reviewID } = await client.query(`
        SELECT id
        FROM reviews; 
      `);
      // console.log(reviewID)
      const reviews = await Promise.all(reviewID.map(
        review => getReviewById(review.id)
      ));
      return reviews;
    } catch (error) {
      throw error
    }
  }

  async function destroyReview(id) {
    try {
  
      const { rows } = await client.query(`
      DELETE from reviews
      WHERE reviews.id=$1
      RETURNING *;
    `, [id]);
      
      return rows;
    } catch (error) {
      throw error
    }
  }
  
  
  module.exports = {
    createReview,
    getReviewById,
    getAllReviews,
    destroyReview
  }