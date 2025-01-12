import { createSlice } from "@reduxjs/toolkit";
import {
  createProduct,
  updateProduct,
  getProductAdmin,
  getDetailProduct,
  getProductHome,
  getProductSearch,
  getProductByCategory,
} from "./product.thunk";

const initialState = {
  products: [],
  productHome: {},
  productDetail: {},
  isLoading: false,
  error: {},
  pagination: {
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalItems: 0,
  },
  data: {},
  productSearchs: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct(state, payload) {
      state.products = payload;
    },
    setPaginationHot(state, payload) {
      state.paginationCustomer.hot = action.payload;
    },
    setPaginationNew(state, payload) {
      state.paginationCustomer.new = action.payload;
    },
    setPaginationSale(state, payload) {
      state.paginationCustomer.sale = action.payload;
    },
    setPaginationSelling(state, payload) {
      state.paginationCustomer.selling = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //Get Product Search
      .addCase(getProductSearch.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProductSearch.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.productSearchs = action.payload.data;
        }
      })
      .addCase(getProductSearch.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Get Product By Category
      .addCase(getProductByCategory.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProductByCategory.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.products = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getProductByCategory.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Get Product Home
      .addCase(getProductHome.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProductHome.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.productHome = action.payload.data;
        }
      })
      .addCase(getProductHome.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Get Product Detail
      .addCase(getDetailProduct.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getDetailProduct.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.productDetail = action.payload.data;
        }
      })
      .addCase(getDetailProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Get Product Admin
      .addCase(getProductAdmin.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProductAdmin.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.products = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getProductAdmin.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      // Create Product
      .addCase(createProduct.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.data = action.payload;
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      // Update Product
      .addCase(updateProduct.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.data = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { setProduct } = productSlice.actions;
export default productSlice.reducer;
