const pool = require('../../services/database/postgresql');

const searchProducts = async (name, category) => {
    return new Promise((resolve, reject) => {
        //search product using name and (or) category
      let query = `SELECT * FROM products WHERE deleted_at IS NULL`;
      let queryParams = [];
      
      if (name) {
        query += ` AND name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${name}%`);
      }
      
      if (category) {
        query += ` AND category ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${category}%`);
      }
      
      pool.query(query, queryParams, (error, results) => {
        if (error) {
          console.log(error);
          return reject(new Error('Failed to search products'));
        }
        
        resolve(results.rows);
      });
    });
  };

  // Service to get the role of a user by their ID
const getUserRoleByUserId = async (id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT role
        FROM user_registration_details 
        WHERE id = $1;
      `;
  
      pool.query(query, [id], (error, results) => {
        if (error) {
          return reject(error);
        }
  
        if (results.rows.length === 0) {
          return resolve(null); // No user found
        }
  
        resolve(results.rows[0]);
      });
    });
  };

//Service to add product to cart
  const addToCart = async (userId, productId, quantity) => {
    return new Promise((resolve, reject) => {
      // First, check if the product exists
      const productCheckQuery = `
        SELECT id
        FROM products
        WHERE id = $1
      `;
  
      pool.query(productCheckQuery, [productId], (error, results) => {
        if (error || results.rowCount === 0) {
          return reject('Product not found');
        }
  
        // If the product is valid, proceed to add to cart
        const cartQuery = `
          INSERT INTO carts (user_id, product_id, quantity, created_at, updated_at)
          VALUES ($1, $2, $3, NOW(), NOW())
          ON CONFLICT (user_id, product_id)
          DO UPDATE SET 
            quantity = carts.quantity + EXCLUDED.quantity,
            updated_at = NOW()
          RETURNING id, user_id, product_id, quantity;
        `;
  
        pool.query(cartQuery, [userId, productId, quantity], (cartError, cartResults) => {
          if (cartError) {
            console.log(cartError);
            return reject('Failed to add product to cart');
          }
          resolve(cartResults.rows[0]);
        });
      });
    });
  };
  
//Service to remove product from cart
  const removeFromCart = async (userId, productId) => {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM carts
        WHERE user_id = $1 AND product_id = $2
        RETURNING id;
      `;
      pool.query(query, [userId, productId], (error, results) => {
        if (error) {
          console.log(error);
          return reject('Failed to remove product from cart');
        }
        resolve(results.rowCount > 0);
      });
    });
  };
  
  //get cart details service using productId
  const getCartByProductId = async (productId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM carts
        WHERE product_id = $1;
      `;
      pool.query(query, [productId], (error, results) => {
        if (error) {
          return reject(error);
        }
        //console.log(results);
        if (results.rows.length === 0) {
          return reject("No product found"); // Return null if no product is found
        }
        //console.log(results.rows[0]);
        resolve(results.rows[0]);
      });
    });
  };
  

  module.exports={
    searchProducts,
    getUserRoleByUserId,
    addToCart,
    removeFromCart,
    getCartByProductId
  }