import * as Yup from "yup";

export const validateCreateProduct = ({ product = {}, setValidate }) => {
  let isValid = true;

  const updateValidate = (field, isFieldValid, message = "") => {
    setValidate((prev) => ({
      ...prev,
      [field]: {
        isValid: isFieldValid,
        message: isFieldValid ? "" : message,
      },
    }));
    if (!isFieldValid) isValid = false;
  };

  updateValidate(
    "name",
    product.name.trim() !== "",
    "Vui lòng nhập tên sản phẩm !"
  );

  updateValidate(
    "categoryId",
    product.categoryId !== "",
    "Vui lòng chọn danh mục !"
  );

  updateValidate(
    "price",
    product.price !== "" &&
      !isNaN(product.price) &&
      parseFloat(product.price) > 0,
    "Vui lòng nhập giá hợp lệ !"
  );

  updateValidate(
    "mainImage",
    product.mainImage && product.mainImage.url !== "",
    "Vui lòng chọn ảnh !"
  );

  const isVariantsValid = product.variants.every(
    (item) => item.color.trim() !== "" && item.image && item.image.url !== ""
  );
  updateValidate(
    "variants",
    isVariantsValid,
    "Vui lòng nhập đầy đủ thông tin cho tất cả phân loại!"
  );

  const isDescriptionValid =
    product.description !== "" && product.description !== "<p><br></p>";
  updateValidate("description", isDescriptionValid, "Vui lòng nhập mô tả !");

  return isValid;
};

export const validateForm = async ({ input, validateSchema }) => {
  try {
    await validateSchema.validate(input, {
      abortEarly: false,
    });
    return {};
  } catch (validationErrors) {
    const errors = {};
    validationErrors.inner.forEach((error) => {
      errors[error.path] = error.message;
    });
    return errors;
  }
};

export const validateLoginSchema = Yup.object({
  email: Yup.string()
    .required("Vui lòng nhập email")
    .email("Vui lòng nhập đúng email"),
  password: Yup.string().required("Vui lòng nhập mật khẩu"),
});

export const validateLoginAdminSchema = Yup.object({
  username: Yup.string().required("Vui lòng nhập tên đăng nhập"),
  password: Yup.string().required("Vui lòng nhập mật khẩu"),
});

export const validateRegisterSchema = Yup.object({
  name: Yup.string().required("Vui lòng nhập họ tên"),
  email: Yup.string()
    .required("Vui lòng nhập email")
    .email("Vui lòng nhập đúng email"),
  password: Yup.string().required("Vui lòng nhập mật khẩu"),
  rePassword: Yup.string().required("Vui lòng nhập lại mật khẩu"),
});

export const validateSendOtpSchema = Yup.object({
  email: Yup.string()
    .required("Vui lòng nhập email")
    .email("Vui lòng nhập đúng email"),
});

export const validateResetPasswordSchema = Yup.object({
  password: Yup.string().required("Vui lòng nhập mật khẩu"),
  rePassword: Yup.string().required("Vui lòng nhập lại mật khẩu"),
});

export const validateOrderSchema = Yup.object({
  name: Yup.string().required("Vui lòng nhập họ tên người nhận hàng"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
  address: Yup.string().required("Vui lòng nhập địa chỉ cụ thể"),
  paymentMethod: Yup.string().required("Vui lòng chọn phương thức thanh toán"),
  province: Yup.object().shape({
    id: Yup.string().required("Vui lòng chọn tỉnh/thành phố"),
    name: Yup.string().required("Tên tỉnh/thành phố không được để trống"),
  }),
  district: Yup.object().shape({
    id: Yup.string().required("Vui lòng chọn quận/huyện"),
    name: Yup.string().required("Tên quận/huyện không được để trống"),
  }),
  ward: Yup.object().shape({
    id: Yup.string().required("Vui lòng chọn phường/xã"),
    name: Yup.string().required("Tên phường/xã không được để trống"),
  }),
});

export const validateReviewSchema = Yup.object({
  rate: Yup.number()
    .required("Vui lòng chọn mức độ hài lòng của bạn")
    .min(1, "Vui lòng chọn mức độ hài lòng của bạn")
    .max(5, "Mức độ hài lòng không hợp lệ")
    .integer("Mức độ hài lòng phải là số nguyên"),
  comment: Yup.string().required("Vui lòng nhập nội dung đánh giá"),
});
