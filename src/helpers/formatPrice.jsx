export const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    currency: "VND",
  }).format(price);
};
