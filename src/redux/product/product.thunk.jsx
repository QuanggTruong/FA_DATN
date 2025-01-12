import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios/axios";
import { message } from "antd";

export const getProductAdmin = createAsyncThunk(
  "product/getProductAdmin",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/admin/products?page=${payload.page}&pageSize=${
          payload.pageSize
        }&name=${payload.name || ""}&category=${payload.category || ""}&tag=${
          payload.tag || ""
        }&sort=${payload.sort || "asc"}`
      );
      return res;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.post("/admin/products", payload);
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo sản phẩm");
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.put(`/admin/products/${payload._id}`, payload);
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật sản phẩm");
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.delete(`/admin/products/${payload}`);
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa sản phẩm");
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDetailProduct = createAsyncThunk(
  "product/getDetailProduct",
  async (slug) => {
    try {
      return await axios.get(`/product-detail/${slug}`);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProductHome = createAsyncThunk(
  "product/getProductHome",
  async (slugs) => {
    try {
      return await axios.get(`/products-home?categories=${slugs}`);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProductSearch = createAsyncThunk(
  "product/getProductSearch",
  async (search) => {
    try {
      return await axios.get(`/products-search?search=${search}`);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProductByCategory = createAsyncThunk(
  "product/getProductByCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/products-by-category/${payload.slug}`,
        {
          params: {
            page: payload.page,
            pageSize: payload.pageSize,
            categories: payload.categories?.length
              ? JSON.stringify(payload.categories)
              : undefined,
            price: payload.price ? JSON.stringify(payload.price) : undefined,
            tags: payload.tags?.length ? payload.tags : undefined,
            sort: payload.sort,
          },
        }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProductByBrand = createAsyncThunk(
  "product/getProductByBrand",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/products-by-brand/${payload.slug}`, {
        params: {
          page: payload.page,
          pageSize: payload.pageSize,
          brands: payload.brands?.length
            ? JSON.stringify(payload.brands)
            : undefined,
          price: payload.price ? JSON.stringify(payload.price) : undefined,
          tags: payload.tags?.length ? payload.tags : undefined,
          sort: payload.sort,
        },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProductNew = createAsyncThunk(
  "product/getProductNew",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.get(
        `/products-new?page=${payload.page}&pageSize=${payload.pageSize}`
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProductHot = createAsyncThunk(
  "product/getProductHot",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.get(
        `/products-hot?page=${payload.page}&pageSize=${payload.pageSize}`
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProductSale = createAsyncThunk(
  "product/getProductSale",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.get(
        `/products-sale?page=${payload.page}&pageSize=${payload.pageSize}`
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProductSelling = createAsyncThunk(
  "product/getProductSelling",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.get(
        `/products-selling?page=${payload.page}&pageSize=${payload.pageSize}`
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProductOther = createAsyncThunk(
  "product/getProductOther",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.get(
        `/products-other?page=${payload.page}&pageSize=${payload.pageSize}`
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
