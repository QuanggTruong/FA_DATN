import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getProductOther } from "../redux/product/product.thunk";
import ProductList from "./ProductList";

const ProductOther = () => {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 8,
    totalPage: 0,
    totalItems: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(
        getProductOther({
          page: paginate.page,
          pageSize: paginate.pageSize,
        })
      ).unwrap();

      if (response.success) {
        setProducts(response.data.products);
        setPaginate((prev) => ({
          ...prev,
          ...response.data.pagination,
        }));
      }
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [paginate.page, paginate.pageSize]);

  return (
    <>
      {products.length > 0 && (
        <ProductList
          title="Sản phẩm khác"
          products={products}
          pagination={paginate}
          setPagination={setPaginate}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default ProductOther;
