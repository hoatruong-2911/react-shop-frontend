import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/Client/ProductCard';
import Pagination from '../../components/Client/Pagination';
import { ChevronDown } from 'lucide-react';
import ClientProductService from '../../services/Client/productService';
import ClientCategoryService from '../../services/Client/categoryService';

// ====== ADD: chuẩn hoá URL ảnh ======
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api";
const ORIGIN   = API_BASE.replace(/\/api\/?$/, "");

function normFileUrl(val) {
  if (!val) return "";
  let v = String(val).trim().replace(/\\/g, "/");

  // 1) ĐÃ là full URL
  if (/^https?:\/\//i.test(v)) {
    try {
      const u = new URL(v);
      // Nếu là http://host:port/files/... (THIẾU /api) -> thêm /api
      if (u.origin === ORIGIN && u.pathname.startsWith("/files/")) {
        return `${ORIGIN}/api${u.pathname}`;
      }
      return v; // còn lại giữ nguyên
    } catch {
      // nếu parse URL lỗi, fallback xử lý như đường dẫn tương đối bên dưới
    }
  }

  // 2) Dạng đã đúng prefix /api/files/ -> ghép ORIGIN
  if (v.startsWith("/api/files/")) return `${ORIGIN}${v}`;

  // 3) Dạng /files/... hoặc files/... -> ghép API_BASE (có /api sẵn)
  if (v.startsWith("/files/")) return `${API_BASE}${v}`;
  if (v.startsWith("files/"))  return `${API_BASE}/${v}`;

  // 4) Chỉ là tên file -> ghép /api/files/<name>
  if (!v.includes("/")) return `${API_BASE}/files/${v}`;

  // 5) Fallback: đường dẫn tương đối khác -> gắn vào API_BASE
  return `${API_BASE}/${v.replace(/^\/+/, "")}`;
}

// ====================================

const ProductListPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const [searchParams] = useSearchParams();
  const categoryQuery = searchParams.get('category');

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryQuery || '');
  const [sortOrder, setSortOrder]               = useState('');
  const [currentPage, setCurrentPage]           = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [productRes, categoryRes] = await Promise.all([
          ClientProductService.getAllProducts(),
          ClientCategoryService.getAllCategories()
        ]);

        const cats = categoryRes.data;

        // Map & chuẩn hoá URL ảnh
        const mappedProducts = productRes.data.map(p => {
          const category = cats.find(c => c.id === p.categoryId);
          return {
            ...p,
            img: normFileUrl(p.imageUrl),                     // <—
            imageUrl: normFileUrl(p.imageUrl),                // để dùng chỗ khác nếu cần
            categoryName: category ? category.name : 'N/A'
          };
        });

        setAllProducts(mappedProducts);
        setCategories(cats);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu từ server.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    let result = [...allProducts];

    if (selectedCategory) {
      result = result.filter(p => p.categoryId === parseInt(selectedCategory, 10));
    }

    switch (sortOrder) {
      case 'price-asc':  result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'name-asc':   result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc':  result.sort((a, b) => b.name.localeCompare(a.name)); break;
      default:           result.sort((a, b) => b.id - a.id); // mới nhất
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [selectedCategory, sortOrder, allProducts]);

  const indexOfLastProduct  = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts     = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages          = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="text-2xl font-semibold text-gray-700">Đang tải dữ liệu...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="text-2xl font-semibold text-red-600">{error}</div>
    </div>
  );

  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border">
          <h1 className="text-xl font-semibold text-gray-800">Danh sách sản phẩm</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none rounded border border-gray-300 py-2 px-4 pr-10 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none rounded border border-gray-300 py-2 px-4 pr-10 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option value="">Sắp xếp (Mới nhất)</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="name-asc">Tên: A-Z</option>
                <option value="name-desc">Tên: Z-A</option>
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-500 text-xl py-10">
              Không tìm thấy sản phẩm nào.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
