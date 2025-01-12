import { createSlice } from "@reduxjs/toolkit";
import { get, set } from "../../storage/storage";

const initialState = {
  cart: get("cart") || {
    products: [],
    totalAmount: 0,
  },
};

const calculateTotalAmount = (products) => {
  return products.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = state.cart.products.findIndex(
        (item) => item.productId === newItem.productId
      );

      if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        state.cart.products[existingItemIndex].quantity +=
          newItem.quantity || 1;
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        state.cart.products.push({
          productId: newItem.productId,
          name: newItem.name,
          image: newItem.image,
          price: newItem.price,
          quantity: newItem.quantity || 1,
        });
      }

      // Tính lại tổng tiền
      state.cart.totalAmount = calculateTotalAmount(state.cart.products);
      set("cart", state.cart);
    },

    incrementQuantity: (state, action) => {
      const { productId } = action.payload;
      const item = state.cart.products.find(
        (item) => item.productId === productId
      );
      if (item) {
        item.quantity += 1;
        state.cart.totalAmount = calculateTotalAmount(state.cart.products);
        set("cart", state.cart);
      }
    },

    decrementQuantity: (state, action) => {
      const { productId } = action.payload;
      const itemIndex = state.cart.products.findIndex(
        (item) => item.productId === productId
      );
      if (itemIndex !== -1) {
        if (state.cart.products[itemIndex].quantity > 1) {
          state.cart.products[itemIndex].quantity -= 1;
        } else {
          state.cart.products.splice(itemIndex, 1);
        }
        state.cart.totalAmount = calculateTotalAmount(state.cart.products);
        set("cart", state.cart);
      }
    },

    removeFromCart: (state, action) => {
      const { productId } = action.payload;
      state.cart.products = state.cart.products.filter(
        (item) => item.productId !== productId
      );
      state.cart.totalAmount = calculateTotalAmount(state.cart.products);
      set("cart", state.cart);
    },

    clearCart: (state) => {
      state.cart.products = [];
      state.cart.totalAmount = 0;
      set("cart", state.cart);
    },
  },
});

export const {
  addToCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
