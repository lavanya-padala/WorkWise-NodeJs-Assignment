const pool = require('../../services/database/postgresql');

// Service to delete a product by its ID
const deleteProduct = async (productId) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE products
      SET deleted_at = NOW()
      WHERE id = $1
      AND deleted_at IS NULL -- Ensure product hasn't already been deleted
      RETURNING id, deleted_at;
    `;
    pool.query(query, [productId], (error, results) => {
      if (error || results.rowCount === 0) {
        return reject(new Error('Product not found or already deleted'));
      }
      resolve(results.rows[0]);
    });
  });
};


const addProduct = async (seller_id, name, category, description, price, discount) => {
  return new Promise((resolve, reject) => {
    const query = 
      `INSERT INTO products (seller_id, name, category, description, price, discount, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, name, category, description, price, discount`;
    ;
    pool.query(query, [seller_id, name, category, description, price, discount], (error, results) => {
      if (error) {
        console.log(error);
        return reject('Failed to add product');
      }
      resolve(results.rows[0]);
    });
  });
};

// Service to get a product by its ID
const getProductById = async (productId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM products
      WHERE id = $1;
    `;
    pool.query(query, [productId], (error, results) => {
      if (error) {
        console.log(error);
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

const editProduct = async (seller_id, productId, name, category, description, price, discount) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE products
      SET name = $1, category = $2, description = $3, price = $4, discount = $5, updated_at = NOW()
      WHERE id = $6 AND seller_id = $7 AND deleted_at IS NULL
      RETURNING id, name, category, description, price, discount, updated_at;
    `;

    pool.query(query, [name, category, description, price, discount, productId, seller_id], (error, results) => {
      if (error) {
        return reject('Failed to update product');
      }

      if (results.rowCount === 0) {
        return resolve("Product Not Found");
      }

      resolve(results.rows[0]);
    });
  });
};



module.exports = {
  deleteProduct,
  getProductById,
  getUserRoleByUserId,
  addProduct,
  editProduct,
};
