import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, ArrowRight, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState(['Tất cả']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});

  // Fetch categories first, then blogs
  useEffect(() => {
    const fetchCategoriesAndBlogs = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const catRes = await api.get('/BlogCategory');
        let categoryData = [];
        if (catRes.data && Array.isArray(catRes.data)) {
          categoryData = catRes.data;
        } else if (catRes.data && Array.isArray(catRes.data.data)) {
          categoryData = catRes.data.data;
        }
        setAllCategories(categoryData);
        setCategories(['Tất cả', ...categoryData.map(cat => cat.name)]);
        // Build map id -> name
        const catMap = {};
        categoryData.forEach(cat => { catMap[cat.id] = cat.name; });
        setCategoryMap(catMap);

        // Fetch blogs after categories
        const blogRes = await api.get('/Blog');
        const blogs = Array.isArray(blogRes.data) ? blogRes.data : blogRes.data.data || [];
        // Map categoryId to category name and set date as createdAt
        const formattedBlogs = blogs.map(blog => ({
          ...blog,
          category: catMap[blog.categoryId] || 'Không có danh mục',
          date: blog.createdAt ? formatDate(blog.createdAt) : (blog.publishedAt ? formatDate(blog.publishedAt) : ''),
        }));
        // Only show published blogs
        setBlogPosts(formattedBlogs.filter(blog => blog.status === 'published'));
      } catch (err) {
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchCategoriesAndBlogs();
  }, []);

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('vi-VN');
  };

  // Filter posts based on category and search term
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'Tất cả' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Log filter status for debugging
  console.log(`Filtering: ${blogPosts.length} posts → ${filteredPosts.length} filtered posts. Active category: "${activeCategory}"`);
  

  // Get featured post and regular posts
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Thông tin, kiến thức và kinh nghiệm về phòng chống ma túy
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-12">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <div className="mb-3">
              <h3 className="text-gray-600 text-sm mb-2">Lọc theo danh mục:</h3>
              <div className="text-lg font-medium text-emerald-700">{activeCategory}</div>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((cate) => {
                // Tính số lượng bài viết trong mỗi danh mục
                const postCount = cate === 'Tất cả' 
                  ? blogPosts.length 
                  : blogPosts.filter(post => post.category === cate).length;
                  
                return (
                  <button
                    key={cate}
                    onClick={() => setActiveCategory(cate)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      activeCategory === cate
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {cate} <span className="text-sm opacity-80">({postCount})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error message if any */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Featured Article */}
        {featuredPost && (
          <div className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>{featuredPost.category}</span>
                  <span>•</span>
                  <span>Phòng chống ma túy</span>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h2>

                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.author}</span>
                  </div>
                  <Link
                    to={`/blog/${featuredPost.id}`}
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 inline-block"
                  >
                    Đọc thêm
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* Image */}
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {post.image ? (
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x200?text=Blog+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <Image className="h-8 w-8 text-gray-500" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  {/* Bỏ phần user */}
                </div>

                {/* Title */}
                <Link to={`/blog/${post.id}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read More Link */}
                <Link 
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
                >
                  <span>Đọc thêm</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy bài viết nào
            </h3>
            <p className="text-gray-600">
              Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;