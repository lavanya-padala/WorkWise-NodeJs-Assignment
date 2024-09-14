const { addProduct, getUserRoleByUserId,getProductById,deleteProduct,editProduct,searchProducts} = require("../seller/seller.services");
const messages = require("../../config/messages.json");

exports.addProduct = async (req, res) => {
  try {
    const { name, category, description, price, discount } = req.body;
    const sellerid = req.user_id;

    // Fetch user role by seller ID
    const row = await getUserRoleByUserId(sellerid);
    if (!row || row.role !== "seller" || !sellerid) {
      return res.status(401).json({success:false,message:messages.authorization_error}); // Use a more appropriate error status
    }

    // Add product for seller
    const product = await addProduct(sellerid, name, category, description, price, discount);
    return res.status(201).json(messages.productAdded);
  } catch (error) {
    console.log(error);
    return res.status(500).json(messages.internalError);
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(productId)
    const sellerId = req.user_id; // Assuming seller ID is stored in `req.user_id`

    // Check if the product exists and is associated with the seller
    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: messages.productNotFound });
    }

    // Ensure the seller is authorized to delete this product
    if (product.seller_id !== sellerId) {
      return res.status(403).json({ success: false, message: messages.unauthorized });
    }

    // Perform the delete operation
    await deleteProduct(productId);
    return res.status(200).json({ success: true, message: messages.productDeleted });
  } catch (error) {
    // console.log(error);
    return res.status(500).json(messages.internalError);
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const seller_id = req.user_id; // Assuming `user_id` is being set in middleware
    const { name, category, description, price, discount } = req.body;

    // Fetch the product by productId to ensure existence and get the seller_id
    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: messages.productNotFound });
    }

    if (product.deleted_at) {
      return res.status(404).json({ success: false, message: messages.productNoLongerExists });
    }

    // Check if the product's seller_id matches the request's user_id
    if (product.seller_id !== seller_id) {
      return res.status(403).json({ success: false, message: messages.unauthorized });
    }

    // Update product details
    const updatedProduct = await editProduct(seller_id, productId, name, category, description, price, discount);

    return res.status(200).json({ success: true, message: messages.productUpdated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalError });
  }
};

