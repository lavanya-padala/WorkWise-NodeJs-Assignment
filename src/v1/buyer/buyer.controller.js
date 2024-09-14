const {searchProducts,getUserRoleByUserId,addToCart,getCartByProductId,removeFromCart}=require("./buyer.services")
const messages = require("../../config/messages.json");

exports.searchProducts = async (req, res) => {
    try {
      // Fetch user role by seller ID
      const userId=req.user_id;
      const row = await getUserRoleByUserId(userId);
        
      //If user is not buyer return authorization error
      if (!row || row.role !== "buyer" || !userId) {
        return res.status(401).json({success:false,message:messages.authorization_error}); 
      }
  
      const { name, category } = req.query;
  
      // Validate that at least one query parameter is provided
      if (!name && !category) {
        return res.status(400).json({ success: false, message: messages.missingSearchParameters });
      }
  
      // Perform search
      const products = await searchProducts(name, category);
  
      if (products.length === 0) {
        return res.status(404).json({ success: false, message: messages.noProductsFound });
      }
  
      return res.status(200).json({ success: true, products });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: messages.internalError });
    }
  };

  exports.addToCart = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user_id; // user_id is set in session_authentication middleware
  
      // Add product to cart service
      const cartItem = await addToCart(userId, productId, quantity);
  
      return res.status(200).json({
        success: true,
        message: messages.productAddedToCart
      });
    } catch (error) {
        //returning error
      if (error === 'Product not found' || error === 'Product no longer exists') {
        return res.status(404).json({ success: false, message: messages.productNoLongerExists });
      }
      console.log(error);
      return res.status(500).json({ success: false, message: messages.internalError });
    }
  };


exports.removeFromCart = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user_id; // Assuming `user_id` is set in middleware
     
      const cart=await getCartByProductId(productId);

      if (!cart) {
        return res.status(404).json({ success: false, message: messages.productNotFoundInCart });
      }
  
      if (cart.user_id !== req.user_id) {
        return res.status(404).json({ success: false, message: messages.authorization_error });
      }
      // Remove product from cart
      const result = await removeFromCart(userId, productId);
  
      if (result) {
        res.status(200).json({ success: true, message: messages.productRemovedFromCart });
      } else {
        res.status(404).json({ success: false, message: messages.productNotFoundInCart });
      }
    } catch (error) {
        if(error=="No product found"){
            return res.status(500).json({ success: false, message: messages.productNotFoundInCart });
        }
      console.log(error);
      res.status(500).json({ success: false, message: messages.internalError });
    }
  };
  