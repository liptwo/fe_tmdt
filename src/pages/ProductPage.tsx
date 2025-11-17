import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, MessageCircle, Store } from "lucide-react"; // 
import { useNavigate, useSearchParams } from "react-router-dom";
import { ApiError, cartApi, productsApi } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
}

interface DetailedReview extends Review {
  date: string;
  usage: string;
  moisturizingEffect: string;
  absorption: string;
  likes: number;
  hasMedia: boolean;
}

interface Recommended {
  id: number;
  name: string;
  image: string;
  price: string;
}

const placeholderImage = (size: number, label?: string) =>
  `https://placehold.co/${size}x${size}${label ? `?text=${encodeURIComponent(label)}` : ""}`;

const defaultProduct = {
  name: "Kem Dưỡng Ẩm Cấp Nước XYZ",
  price: "$499",
  image: placeholderImage(400, "Product"),
  description: `Kem dưỡng ẩm cao cấp với công thức tiên tiến:
- Cấp nước tức thì
- Làm dịu da nhạy cảm
- Thẩm thấu nhanh, không gây bết dính
- Dùng được cho mọi loại da`,
  reviews: [
    {
      id: 1,
      user: "hta282",
      rating: 5,
      comment:
        "Packaging đẹp, nhìn sang, vỏ bằng nhựa. Chất kem nhẹ cơ mà đặc hơn mình nghĩ, lấy 1 lượng nhỏ là đủ dùng cho cả mặt rồi.",
      date: "2022-04-27 10:20",
      usage: "Dưỡng ẩm, làm dịu da",
      moisturizingEffect: "Cấp nước cho da tức thì",
      absorption: "Nhanh",
      likes: 38,
      hasMedia: true,
    },
    {
      id: 2,
      user: "Minh Thu",
      rating: 5,
      comment:
        "Dùng thích lắm, da mềm hẳn sau khi dùng. Kem không có mùi, rất ổn cho da nhạy cảm.",
      date: "2023-11-05 15:00",
      usage: "Dưỡng ẩm hàng ngày",
      moisturizingEffect: "Tốt",
      absorption: "Khá nhanh",
      likes: 12,
      hasMedia: false,
    },
    {
        id: 3,
        user: "Quang A",
        rating: 4,
        comment: "Kem dùng ổn, nhưng giá hơi cao. Thẩm thấu nhanh.",
        date: "2023-10-01 12:00",
        usage: "Dưỡng ẩm",
        moisturizingEffect: "Tốt",
        absorption: "Nhanh",
        likes: 5,
        hasMedia: false,
    },
    {
        id: 4,
        user: "Thị B",
        rating: 5,
        comment: "Tuyệt vời! Sẽ mua lại.",
        date: "2023-09-20 09:00",
        usage: "Dưỡng ẩm",
        moisturizingEffect: "Rất tốt",
        absorption: "Rất nhanh",
        likes: 8,
        hasMedia: false,
    },
    {
        id: 5,
        user: "Văn C",
        rating: 3,
        comment: "Hơi dính một chút, không hợp da mình lắm.",
        date: "2023-08-15 14:30",
        usage: "Dưỡng ẩm",
        moisturizingEffect: "Trung bình",
        absorption: "Chậm",
        likes: 2,
        hasMedia: false,
    },
    {
        id: 6,
        user: "Kim D (Review thứ 6)",
        rating: 5,
        comment: "Sản phẩm tốt, đáng tiền.",
        date: "2023-07-10 17:00",
        usage: "Dưỡng ẩm",
        moisturizingEffect: "Tốt",
        absorption: "Nhanh",
        likes: 15,
        hasMedia: false,
    },
    {
        id: 7,
        user: "Ngọc E (Review thứ 7)",
        rating: 4,
        comment: "Đóng gói cẩn thận. Giao hàng nhanh.",
        date: "2023-06-01 11:00",
        usage: "Dưỡng ẩm",
        moisturizingEffect: "Khá tốt",
        absorption: "Nhanh",
        likes: 7,
        hasMedia: false,
    },
  ] as DetailedReview[],
  recommended: [
    {
      id: 1,
      name: "Sữa Rửa Mặt A",
      image: placeholderImage(150, "SP 1"),
      price: "$399",
    },
    {
      id: 2,
      name: "Toner B",
      image: placeholderImage(150, "SP 2"),
      price: "$599",
    },
    {
      id: 3,
      name: "Serum C",
      image: placeholderImage(150, "SP 3"),
      price: "$699",
    },
    {
      id: 4,
      name: "Mặt Nạ D",
      image: placeholderImage(150, "SP 4"),
      price: "$799",
    },
    {
      id: 5,
      name: "Kem Chống Nắng E",
      image: placeholderImage(150, "SP 5"),
      price: "$899",
    },
    {
      id: 6,
      name: "Toner F",
      image: placeholderImage(150, "SP 6"),
      price: "$499",
    },
    // Thêm các sản phẩm ảo để đảm bảo có > 18 sản phẩm cho tính năng Xem thêm
    ...Array(15).fill(0).map((_, index) => ({
      id: index + 7,
      name: `Sản phẩm Gợi ý ${index + 7}`,
      image: placeholderImage(150, `SP ${index + 7}`),
      price: `$${(Math.random() * 500 + 100).toFixed(0)}`,
    })),
    { // Tổng cộng 6 + 15 + 1 = 22 sản phẩm
      id: 22,
      name: "Sản phẩm Gợi ý Z (ngoài 18)",
      image: placeholderImage(150, "SP Z"),
      price: "$199",
    }
  ] as Recommended[],
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value));

const computeReviewSummary = (reviews: DetailedReview[]) => {
  const ratingsCount: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalComments = 0;
  let totalMedia = 0;

  reviews.forEach((review) => {
    ratingsCount[review.rating] = (ratingsCount[review.rating] || 0) + 1;
    if (review.comment && review.comment.trim() !== "") totalComments += 1;
    if (review.hasMedia) totalMedia += 1;
  });

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

  return { ratingsCount, totalComments, totalMedia, averageRating };
};

const ReviewItem = ({ review }: { review: DetailedReview }) => {
  const renderStars = (rating: number) => (
    <div className="flex text-orange-500 text-lg">
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </div>
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm flex flex-col space-y-2 border border-black-200">
      <div className="flex items-start space-x-3">
        <img
          src={placeholderImage(40, review.user.slice(0, 2))}
          alt={review.user}
          className="w-10 h-10 rounded-full object-cover border border-orange-300"
        />
        <div>
          <p className="font-semibold text-sm text-black">{review.user}</p>
          {renderStars(review.rating)}
        </div>
      </div>
      <p className="text-xs text-gray-500 pl-12">{review.date}</p>
      <div className="text-sm space-y-1 mt-2 text-black">
        <p>
          <strong>Công dụng:</strong> <span>{review.usage}</span>
        </p>
        <p>
          <strong>Hiệu quả dưỡng ẩm:</strong>{" "}
          <span className="text-orange-500 font-semibold">
            {review.moisturizingEffect}
          </span>
        </p>
        <p>
          <strong>Khả năng thẩm thấu:</strong> <span>{review.absorption}</span>
        </p>
      </div>
      <p className="mt-2 text-black">{review.comment}</p>
      {review.hasMedia && (
        <div className="flex space-x-2 mt-2">
          <div className="relative w-24 h-24 border border-orange-300 rounded overflow-hidden">
            <img
              src={placeholderImage(100, "Video")}
              alt="review video"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded flex items-center">
              ▶ 0:13
            </div>
          </div>
          <div className="relative w-24 h-24 border border-orange-300 rounded overflow-hidden">
            <img
              src={placeholderImage(100, "Image")}
              alt="review media 2"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      <div className="mt-2 flex items-center text-sm text-gray-600">
        ❤️ {review.likes}
      </div>
    </div>
  );
};

const ReviewSummary = ({ reviews }: { reviews: DetailedReview[] }) => {
  const [selectedTab, setSelectedTab] = useState<
    "all" | number | "comments" | "media"
  >("all");
  
  // LOGIC ĐÃ THÊM CHO PHẦN ĐÁNH GIÁ
  const [showAllReviews, setShowAllReviews] = useState(false);
  const maxReviewsToShow = 5;

  const filteredReviews = reviews
    .filter((review) => {
      if (selectedTab === "all") return true;
      if (selectedTab === "comments") return review.comment.length > 0;
      if (selectedTab === "media") return review.hasMedia;
      if (typeof selectedTab === "number")
        return review.rating === selectedTab;
      return true;
    });
  
  const reviewSummary = useMemo(() => computeReviewSummary(reviews), [reviews]);

  // Áp dụng giới hạn 5 review đầu tiên
  const reviewsToDisplay = showAllReviews 
    ? filteredReviews 
    : filteredReviews.slice(0, maxReviewsToShow);
    
  const shouldShowReviewToggleButton = filteredReviews.length > maxReviewsToShow;

  const handleToggleShowReviews = () => {
    setShowAllReviews(!showAllReviews);
  };
  // KẾT THÚC LOGIC ĐÃ THÊM

  const formatCount = (count: number) =>
    count >= 1000
      ? `${(count / 1000).toFixed(1).replace(".0", "")}k`
      : count.toString();

  const tabClass = (isActive: boolean) =>
    `px-4 py-2 border rounded-full text-sm transition-all duration-300 cursor-pointer whitespace-nowrap ${
      isActive
        ? "bg-orange-500 text-white border-orange-500 font-semibold scale-105 shadow-md"
        : "bg-white text-black border-orange-300 hover:bg-orange-50"
    }`;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500">
      <h2 className="text-xl font-bold mb-4 text-black">ĐÁNH GIÁ SẢN PHẨM</h2>

      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 border-b border-black-200 pb-4 mb-4">
        <div className="flex flex-col items-start min-w-[150px]">
          <span className="text-5xl font-bold text-orange-500">
            {reviewSummary.averageRating.toFixed(1)}{" "}
            <span className="text-2xl text-black">/5</span>
          </span>
          <div className="text-orange-500 text-3xl">{"★".repeat(5)}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={tabClass(selectedTab === "all")}
            onClick={() => {
              setSelectedTab("all");
              setShowAllReviews(false); // Reset trạng thái xem thêm khi đổi tab
            }}
          >
            Tất Cả
          </button>
          {Object.entries(reviewSummary.ratingsCount as Record<string, number>)
            .reverse()
            .map(([star, count]) => (
              <button
                key={star}
                className={tabClass(selectedTab === Number(star))}
                onClick={() => {
                  setSelectedTab(Number(star));
                  setShowAllReviews(false); // Reset trạng thái xem thêm khi đổi tab
                }}
              >
                {star} Sao ({formatCount(Number(count))})
              </button>
            ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={tabClass(selectedTab === "comments")}
          onClick={() => {
            setSelectedTab("comments");
            setShowAllReviews(false); // Reset trạng thái xem thêm khi đổi tab
          }}
        >
          Có Bình Luận ({formatCount(reviewSummary.totalComments)})
        </button>
        <button
          className={tabClass(selectedTab === "media")}
          onClick={() => {
            setSelectedTab("media");
            setShowAllReviews(false); // Reset trạng thái xem thêm khi đổi tab
          }}
        >
          Có Hình Ảnh / Video ({formatCount(reviewSummary.totalMedia)})
        </button>
      </div>

      <div className="space-y-4">
        {/* SỬ DỤNG reviewsToDisplay ĐÃ ĐƯỢC GIỚI HẠN */}
        {reviewsToDisplay.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
      
      {/* NÚT XEM THÊM / ẨN BỚT ĐÁNH GIÁ */}
      {shouldShowReviewToggleButton && (
        <div className="text-center mt-6">
          <button
            onClick={handleToggleShowReviews}
            className="bg-gray-100 text-gray-700 py-2 px-6 rounded-full font-medium shadow-md hover:bg-gray-200 transition-colors duration-300 border border-gray-300"
          >
            {showAllReviews 
              ? 'Ẩn bớt ▲' 
              : `Xem thêm ${filteredReviews.length - maxReviewsToShow} đánh giá khác ▼`
            }
          </button>
        </div>
      )}
    </div>
  );
};

// ---------------------- MAIN ------------------------
const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const rawProductId = searchParams.get("id");
  const productId = rawProductId?.trim() || null;
  const isBackendProductId =
    !!productId &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      productId
    );
  const [productOverride, setProductOverride] = useState<Partial<typeof defaultProduct>>({});
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const product = useMemo(() => ({ ...defaultProduct, ...productOverride }), [productOverride]);

  const [selectedProduct, setSelectedProduct] = useState<Recommended | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [cartStatus, setCartStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    let isMounted = true;
    if (!isBackendProductId) {
      setProductError(
        productId
          ? "Sản phẩm demo đang được hiển thị tạm thời."
          : null
      );
      setIsLoadingProduct(false);
      return () => {
        isMounted = false;
      };
    }

    const fetchProduct = async () => {
      setIsLoadingProduct(true);
      setProductError(null);
      try {
        const data = await productsApi.getById(productId!);
        if (!isMounted) return;
        setProductOverride({
          name: data.name,
          price: formatCurrency(Number(data.price)),
          image: data.images?.[0] ?? defaultProduct.image,
          description: data.description ?? defaultProduct.description,
        });
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof ApiError ? err.message : "Không thể tải thông tin sản phẩm.";
        setProductError(message);
      } finally {
        if (isMounted) {
          setIsLoadingProduct(false);
        }
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [productId, isBackendProductId]);
  
  // LOGIC CHO PHẦN GỢI Ý SẢN PHẨM (GIỮ NGUYÊN)
  const [showAllRecommended, setShowAllRecommended] = useState(false);
  const maxProductsToShow = 18;
  const recommendedProductsToShow = showAllRecommended
    ? product.recommended
    : product.recommended.slice(0, maxProductsToShow);
  
  const handleToggleShowRecommended = () => {
    setShowAllRecommended(!showAllRecommended);
  };
  const shouldShowToggleButton = product.recommended.length > maxProductsToShow;
  // KẾT THÚC LOGIC CHO PHẦN GỢI Ý SẢN PHẨM

  const increase = () => setQuantity(quantity + 1);
  const decrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleAddToCart = async () => {
    if (!isBackendProductId || !productId) {
      setCartMessage("Sản phẩm demo này chưa hỗ trợ thêm vào giỏ.");
      setCartStatus("error");
      return;
    }

    if (!token) {
      setCartMessage("Vui lòng đăng nhập để thêm sản phẩm vào giỏ.");
      setCartStatus("error");
      navigate("/login");
      return;
    }

    // Decode JWT to check expiration
    let tokenInfo: { exp?: number; email?: string; role?: string } = {};
    try {
      const payload = token.split('.')[1];
      if (payload) {
        tokenInfo = JSON.parse(atob(payload));
        const now = Math.floor(Date.now() / 1000);
        if (tokenInfo.exp && tokenInfo.exp < now) {
          console.warn('[cart] token expired', { exp: tokenInfo.exp, now });
          setCartMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          setCartStatus("error");
          navigate("/login");
          return;
        }
      }
    } catch (e) {
      console.warn('[cart] failed to decode token', e);
    }

    setCartStatus("loading");
    setCartMessage(null);
    try {
      console.log("[cart] adding item", {
        productId,
        quantity,
        tokenPreview: `${token.slice(0, 20)}…`,
        tokenExp: tokenInfo.exp ? new Date(tokenInfo.exp * 1000).toISOString() : 'unknown',
        tokenEmail: tokenInfo.email,
      });
      await cartApi.addItem(token, {
        productId,
        quantity,
      });
      console.log("[cart] add success");
      setCartStatus("success");
      setCartMessage("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("[cart] add failed", {
        productId,
        quantity,
        error,
      });
      setCartStatus("error");
      if (error instanceof ApiError) {
        // If 401, token might be invalid - suggest re-login
        if (error.status === 401) {
          setCartMessage("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setCartMessage(error.message);
        }
      } else {
        setCartMessage("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="bg-white-50 min-h-screen text-black p-8">
      {productError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {productError}
        </div>
      )}
      {isLoadingProduct && (
        <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-600">
          Đang tải thông tin sản phẩm...
        </div>
      )}
      {/* Sản phẩm chính */}
      <div className="flex flex-col md:flex-row gap-8 bg-white p-8 rounded-2xl shadow-lg border-t-4 border-green-500 hover:shadow-xl transition-all duration-300">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 h-64 md:h-96 object-cover rounded-lg border border-black-200"
        />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4 text-black">
              {product.name}
            </h1>
            <p className="text-orange-500 text-2xl font-semibold mb-4">
              {product.price}
            </p>

            {/* mô tả ngắn */}
            <p className="text-gray-700 mb-6">
              {product.description.split("\n")[0]}
            </p>
          </div>

          {/* ✅ Đưa cụm chọn số lượng + nút xuống dưới cùng */}
          <div className="mt-auto pt-6 border-t border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-orange-300 rounded-lg">
                <button
                  onClick={decrease}
                  className="px-3 py-1 text-lg hover:bg-orange-50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 text-center border-x border-orange-200 focus:outline-none"
                />
                <button
                  onClick={increase}
                  className="px-3 py-1 text-lg hover:bg-orange-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={cartStatus === "loading"}
                  className="border border-orange-500 text-orange-600 px-6 py-2 rounded-md hover:bg-orange-50 transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {cartStatus === "loading" ? "Đang thêm..." : "Thêm vào giỏ"}
                </button>
                <button className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-all">
                  Mua ngay
                </button>
              </div>
              {cartMessage && (
                <p
                  className={`text-sm ${
                    cartStatus === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {cartMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin shop */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-2xl shadow-md border-t-4 border-green-500 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-4">
          <img
            src={placeholderImage(80, "Shop")}
            alt="Shop avatar"
            className="w-16 h-16 rounded-full border border-orange-300"
          />
          <div>
            <h2 className="text-lg font-semibold">Citycase</h2>
            <p className="text-gray-500 text-sm">Online 3 phút trước</p>
            <button className="bg-orange-500 text-white px-3 py-1 rounded-md mt-2 hover:bg-orange-600">
              Yêu Thích
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm mt-4 md:mt-0">
          <div>
            <p className="text-gray-500">Đánh Giá</p>
            <p className="text-orange-500 font-semibold">46,4k</p>
          </div>
          <div>
            <p className="text-gray-500">Tỉ Lệ Phản Hồi</p>
            <p className="text-orange-500 font-semibold">91%</p>
          </div>
          <div>
            <p className="text-gray-500">Sản Phẩm</p>
            <p className="text-orange-500 font-semibold">270</p>
          </div>
          <div>
            <p className="text-gray-500">Thời Gian Phản Hồi</p>
            <p className="text-orange-500 font-semibold">Trong vài giờ</p>
          </div>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 flex items-center gap-2">
            <Store className="w-4 h-4" /> Xem Shop
          </button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> Chat Ngay
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500">
        <h2 className="text-xl font-bold mb-4 text-black">Mô tả Sản phẩm</h2>
        <p className="whitespace-pre-line text-black">{product.description}</p>
      </div>

      {/* ĐÁNH GIÁ SẢN PHẨM - ĐÃ SỬA ĐỔI */}
      <div className="mt-8">
        <ReviewSummary reviews={product.reviews} />
      </div>
      {/* KẾT THÚC ĐÁNH GIÁ SẢN PHẨM ĐÃ SỬA ĐỔI */}

      {/* SẢN PHẨM GỢI Ý - GIỮ NGUYÊN PHẦN ĐÃ SỬA ĐỔI TRƯỚC */}
      <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500">
        <h2 className="text-2xl font-bold mb-6 text-black">Sản phẩm Gợi ý</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {recommendedProductsToShow.map((item) => (
            <div
              key={item.id}
              className="border border-black-200 rounded-2xl p-4 bg-white shadow-md flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg mb-2 border border-black-200"
              />
              <h3 className="font-semibold text-sm line-clamp-2 min-h-[40px] text-black">
                {item.name}
              </h3>
              <p className="text-orange-500 font-bold mt-1 mb-2">
                {item.price}
              </p>
              <button
                onClick={() => setSelectedProduct(item)}
                className="mt-auto w-full bg-orange-500 text-white py-2 px-4 rounded-full text-sm font-medium shadow-md hover:bg-orange-600 hover:scale-105 transition-all duration-300"
              >
                Xem Chi Tiết
              </button>
            </div>
          ))}
        </div>

        {shouldShowToggleButton && (
          <div className="text-center mt-6">
            <button
              onClick={handleToggleShowRecommended}
              className="bg-gray-100 text-gray-700 py-2 px-6 rounded-full font-medium shadow-md hover:bg-gray-200 transition-colors duration-300 border border-gray-300"
            >
              {showAllRecommended 
                ? 'Ẩn bớt ▲' 
                : `Xem thêm ${product.recommended.length - maxProductsToShow} sản phẩm khác ▼`
              }
            </button>
          </div>
        )}
      </div>
      {/* KẾT THÚC PHẦN SẢN PHẨM GỢI Ý ĐÃ SỬA ĐỔI */}
      
      {/* Hiển thị sản phẩm được chọn nếu cần */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Chi tiết sản phẩm</h3>
            <p>{selectedProduct.name}</p>
            <p className="text-orange-500 font-bold">{selectedProduct.price}</p>
            <button onClick={() => setSelectedProduct(null)} className="mt-4 bg-gray-300 px-4 py-2 rounded">Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;