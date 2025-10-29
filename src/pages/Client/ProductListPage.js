import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom'; // Import useSearchParams
import ProductCard from '../../components/Client/ProductCard';
import Pagination from '../../components/Client/Pagination';
import { ChevronDown } from 'lucide-react';
// 1. Import service
import ClientProductService from '../../services/Client/productService';
import ClientCategoryService from '../../services/Client/categoryService';

// 2. Xóa hết dữ liệu tĩnh và hàm formatPrice

const ProductListPage = () => {
    // 3. Thêm State
    const [allProducts, setAllProducts] = useState([]); // Chứa tất cả SP từ API
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 4. Lấy query param từ URL (vd: /products?category=1)
    const [searchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category');

    // State cho filter và phân trang
    const [filteredProducts, setFilteredProducts] = useState([]);
    // Set default filter dựa trên query param
    const [selectedCategory, setSelectedCategory] = useState(categoryQuery || ''); 
    const [sortOrder, setSortOrder] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    // 5. useEffect để lấy dữ liệu từ API
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [productRes, categoryRes] = await Promise.all([
                    ClientProductService.getAllProducts(),
                    ClientCategoryService.getAllCategories()
                ]);

                // Map dữ liệu API (image_url -> img)
                // Và gán categoryName cho mỗi sản phẩm
                const cats = categoryRes.data;
                const mappedProducts = productRes.data.map(p => {
                    const category = cats.find(c => c.id === p.categoryId);
                    return {
                        ...p,
                        img: p.imageUrl, // Map 'imageUrl' từ DB sang 'img'
                        categoryName: category ? category.name : 'N/A' // Thêm tên danh mục
                    }
                });

                setAllProducts(mappedProducts);
                setCategories(cats);
                setError(null);
            } catch (err) {
                setError("Không thể tải dữ liệu từ server.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []); // Chạy 1 lần khi mount

    // 6. useEffect để LỌC (filter) và SẮP XẾP (sort)
    useEffect(() => {
        let result = [...allProducts];

        // Lọc theo danh mục (từ state)
        if (selectedCategory) {
            result = result.filter(p => p.categoryId === parseInt(selectedCategory));
        }

        // Sắp xếp
        switch (sortOrder) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                // Sắp xếp theo ID giảm dần (mới nhất)
                result.sort((a, b) => b.id - a.id);
                break;
        }

        setFilteredProducts(result);
        setCurrentPage(1); // Reset về trang 1 khi filter
    }, [selectedCategory, sortOrder, allProducts]);


    // 7. Logic phân trang (dùng 'filteredProducts')
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    // 8. Thêm UI cho Loading và Error
    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="text-2xl font-semibold text-gray-700">Đang tải dữ liệu...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="text-2xl font-semibold text-red-600">{error}</div>
            </div>
        );
    }

    // 9. Giao diện render
    return (
        <div className="bg-gray-50/50">
            <div className="container mx-auto px-6 py-12">
                
                {/* Thanh Filter (như trong ảnh) */}
                <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border">
                    <h1 className="text-xl font-semibold text-gray-800">Danh sách sản phẩm</h1>
                    
                    <div className="flex items-center gap-4">
                        {/* Filter Danh mục */}
                        <div className="relative">
                            <select 
                                value={selectedCategory} // State kiểm soát giá trị
                                onChange={(e) => setSelectedCategory(e.target.value)} // Cập nhật state khi thay đổi
                                className="appearance-none rounded border border-gray-300 py-2 px-4 pr-10 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
                            >
                                <option value="">Tất cả danh mục</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>

                        {/* Filter Sắp xếp */}
                        <div className="relative">
                            <select 
                                value={sortOrder} // State kiểm soát giá trị
                                onChange={(e) => setSortOrder(e.target.value)} // Cập nhật state khi thay đổi
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

                {/* Lưới sản phẩm */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                            // Truyền thẳng object product
                            <ProductCard 
                                key={product.id}
                                {...product}
                            />
                        ))
                    ) : (
                        <div className="col-span-4 text-center text-gray-500 text-xl py-10">
                            Không tìm thấy sản phẩm nào.
                        </div>
                    )}
                </div>

                {/* Phân trang */}
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
