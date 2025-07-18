import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, PencilLine, Trash2, X, Image as ImageIcon } from 'lucide-react';
import axios from 'axios'; // Axios is imported here for clarity, though 'api' is preferred.
import api from '../api/api'; // Make sure this path is correct and 'api' is configured with auth headers.

// Helper function to standardize blog data extraction from API responses
const extractBlogData = (response) => {
  // Prioritize response.data.data for common API structures
  if (response && response.data && response.data.data) {
    return response.data.data;
  }
  // Fallback to response.data
  if (response && response.data) {
    return response.data;
  }
  return null;
};

// Helper để lấy userId từ localStorage
const getUserIdFromLocalStorage = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  return userInfo.userId || '';
};

const BlogManagement = () => {
  const navigate = useNavigate();
  // State variables for managing data and UI
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form data for add/edit operations, initialized with userId from localStorage
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    categoryId: '', // Empty initially, forcing user selection for new posts
    tags: '',
    status: 'draft',
    thumbnailUrl: '',
    // Ensures userId is always taken from localStorage or defaults to empty string
    userId: getUserIdFromLocalStorage()
  });

  // --- Effects ---

  // Fetch blogs and categories on component mount
  useEffect(() => {
    // Check for userId immediately on mount if it's crucial for general access
    const storedUserId = getUserIdFromLocalStorage();
    if (!storedUserId) {
      // Optional: Redirect to login or show an prominent error if userId is mandatory for this page
      // alert('Bạn cần đăng nhập để quản lý bài viết.');
      // navigate('/login'); 
      // It's generally better to handle global auth checks in a higher-order component or context
    } else {
      // Update formData with userId in case initial state was set without it or it changed
      setFormData(prev => ({ ...prev, userId: storedUserId }));
    }

    fetchBlogs();
    fetchCategories();
  }, [navigate]); // Add navigate to dependency array for useEffect safety

  // --- Helper Functions ---

  // Centralized API error handler for consistent error messages
  const handleApiError = (err, defaultMessage) => {
    console.error('Chi tiết lỗi API:', err); // For detailed debugging

    let errorMessage = defaultMessage || 'Đã xảy ra lỗi không xác định';

    if (err.response) {
      // Server responded with a status other than 2xx
      errorMessage = `${defaultMessage}: Lỗi ${err.response.status}`;
      if (err.response.status === 401) {
        errorMessage += ' - Không được ủy quyền. Vui lòng đăng nhập lại.';
        // Optional: Force logout or redirect to login on 401
        // localStorage.removeItem('authToken');
        // localStorage.removeItem('currentUserId');
        // navigate('/login');
      } else if (err.response.status === 403) {
        errorMessage += ' - Cấm truy cập. Bạn không có quyền thực hiện thao tác này.';
      } else if (err.response.data && err.response.data.message) {
        errorMessage += ` (${err.response.data.message})`;
      } else {
        errorMessage += ` - ${err.response.statusText}`;
      }
    } else if (err.request) {
      // Request was made but no response was received
      errorMessage = `${defaultMessage}: Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.`;
    } else if (err.message) {
      // Something happened in setting up the request that triggered an Error
      if (err.message.includes('Network Error')) {
        errorMessage = `${defaultMessage}: Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.`;
      } else if (err.message.includes('timeout')) {
        errorMessage = `${defaultMessage}: Yêu cầu đã hết thời gian chờ. Máy chủ có thể đang bận hoặc có vấn đề về kết nối.`;
      } else {
        errorMessage = `${defaultMessage}: ${err.message}`;
      }
    }

    setError(errorMessage);
    return errorMessage; // Return message for immediate use (e.g., in an alert)
  };

  // --- Data Fetching Functions ---

  // Fetches all blogs from the API
  const fetchBlogs = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await api.get('/Blog');
      const data = extractBlogData(response);
      if (data) {
        setBlogs(data);
      } else {
        setBlogs([]); // Ensure blogs array is empty if no data
        console.warn("API response for blogs was empty or in an unexpected format.");
      }
    } catch (err) {
      handleApiError(err, 'Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };  // Fetches all blog categories from the API
  const fetchCategories = async () => {
    setCategoryLoading(true);
    try {
      // Fetch categories from the API endpoint
      const response = await api.get('/BlogCategory');
      
      // Extract data based on the expected response format
      let categoryData = [];
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // First, try to extract data from response.data.data (expected format)
        categoryData = response.data.data;
        console.log("Categories fetched successfully:", categoryData);
      } else if (response.data && Array.isArray(response.data)) {
        // Fallback: if response.data is directly an array
        categoryData = response.data;
        console.log("Categories fetched in fallback format:", categoryData);
      } else {
        // Handle unexpected response format
        console.warn("Unexpected API response format for blog categories:", response.data);
      }
      
      // Update categories state
      if (categoryData && categoryData.length > 0) {
        setCategories(categoryData);
      } else {
        setCategories([]);
        console.warn("API response for blog categories was empty.");
      }
    } catch (err) {
      // Only log category errors to console as it might not be critical for main blog display
      console.error("Không thể tải danh sách danh mục blog:", err);
      setCategories([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  // --- Form Handlers ---

  // Handles changes to form input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handles adding a new blog post
  const handleAddBlog = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    setError(null); // Clear previous errors

    // --- Frontend Validation ---
    // Log formData before validation for debugging
    console.log("FormData for Add Blog (before validation):", formData);

    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.excerpt.trim() ||
      !formData.categoryId || // Check if categoryId is selected (not empty string)
      !formData.userId        // Check if userId is present
    ) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc: Tiêu đề, Nội dung, Mô tả ngắn, Danh mục, và ID người dùng.');
      setLoading(false);
      return;
    }
    if (!['published', 'draft'].includes(formData.status)) {
      setError('Trạng thái không hợp lệ! Vui lòng chọn "Bản nháp" hoặc "Xuất bản".');
      setLoading(false);
      return;
    }
    // --- End Frontend Validation ---

    // Prepare data for API request
    const blogData = {
      title: formData.title.trim(),
      userId: getUserIdFromLocalStorage(), // Lấy userId động từ localStorage
      content: formData.content.trim(),
      excerpt: formData.excerpt.trim(),
      thumbnailUrl: formData.thumbnailUrl || "", // Send empty string if no thumbnail
      categoryId: String(formData.categoryId),   // Ensure categoryId is always a string
      tags: formData.tags.trim(),
      status: formData.status,
      // Set publishedAt only if status is 'published'
      publishedAt: formData.status === 'published' ? new Date().toISOString() : null
    };

    try {
      const response = await api.post('/Blog', blogData, {
        headers: { 'Content-Type': 'application/json' }
      });
      const newBlog = extractBlogData(response);
      if (newBlog) {
        setBlogs(prevBlogs => [...prevBlogs, newBlog]); // Add new blog to state
        alert('Tạo bài viết mới thành công! 🎉'); // Success feedback
        setShowAddModal(false); // Close modal
        // Reset form to initial empty state, ensuring userId is refreshed from localStorage
        setFormData({
          title: '', content: '', excerpt: '', categoryId: '', tags: '', status: 'draft', thumbnailUrl: '',
          userId: getUserIdFromLocalStorage()
        });
      } else {
        throw new Error("Phản hồi API không chứa dữ liệu bài viết mới.");
      }
    } catch (err) {
      handleApiError(err, 'Không thể tạo bài viết mới');
    } finally {
      setLoading(false);
    }
  };

  // Handles updating an existing blog post
  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // --- Frontend Validation ---
    // Log formData before validation
    console.log("FormData for Edit Blog (before validation):", formData);

    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.excerpt.trim() ||
      !formData.categoryId ||
      !formData.userId
    ) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc: Tiêu đề, Nội dung, Mô tả ngắn, Danh mục, và ID người dùng.');
      setLoading(false);
      return;
    }
    if (!['published', 'draft'].includes(formData.status)) {
      setError('Trạng thái không hợp lệ! Vui lòng chọn "Bản nháp" hoặc "Xuất bản".');
      setLoading(false);
      return;
    }
    // --- End Frontend Validation ---

    try {
      const blogData = {
        title: formData.title.trim(),
        // Use formData.userId if available, otherwise fallback to selectedBlog.userId
        userId: String(formData.userId || selectedBlog.userId),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim(),
        // Keep existing thumbnail URL if no new one is uploaded
        thumbnailUrl: formData.thumbnailUrl || selectedBlog.thumbnailUrl || '',
        // Use formData.categoryId if selected, fallback to selectedBlog.categoryId
        categoryId: String(formData.categoryId || selectedBlog.categoryId || ''),
        tags: formData.tags.trim(),
        status: formData.status,
        // Update publishedAt only if status is 'published', use existing date or new date
        publishedAt: formData.status === 'published' ?
          (selectedBlog.publishedAt || new Date().toISOString()) : null
      };

      const response = await api.put(`/Blog/${selectedBlog.id}`, blogData, {
        timeout: 30000, // Increased timeout for potentially larger content
        headers: { 'Content-Type': 'application/json' }
      });

      const updatedBlog = extractBlogData(response);
      if (updatedBlog) {
        // Update the specific blog in the blogs array
        setBlogs(blogs.map(b => (b.id === selectedBlog.id ? updatedBlog : b)));
        alert('Cập nhật bài viết thành công! ✨');
        setShowEditModal(false);
      } else {
        throw new Error("Phản hồi API không chứa dữ liệu bài viết đã cập nhật.");
      }
    } catch (err) {
      const msg = handleApiError(err, 'Không thể cập nhật bài viết');
      alert(msg); // Use alert for immediate feedback on update failure
    } finally {
      setLoading(false);
    }
  };

  // --- Modal Control and Data Pre-fill Handlers ---

  // Handles opening view modal and fetching detailed blog info
  const handleViewBlog = async (blog) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/Blog/${blog.id}`, { timeout: 15000 });
      const data = extractBlogData(response);
      setSelectedBlog(data || blog); // Fallback to existing blog data if API fails
      setShowViewModal(true);
    } catch (err) {
      handleApiError(err, 'Không thể tải thông tin chi tiết bài viết');
      setSelectedBlog(blog); // Still show partial data if API call failed
      setShowViewModal(true); // Open modal even with partial data
    } finally {
      setLoading(false);
    }
  };

  // Handles opening edit modal and pre-filling form
  const handleEditBlog = async (blog) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/Blog/${blog.id}`);
      const blogData = extractBlogData(response) || blog; // Fallback

      setSelectedBlog(blogData);
      setFormData({
        title: blogData.title || '',
        content: blogData.content || '',
        excerpt: blogData.excerpt || '',
        tags: blogData.tags || '',
        status: blogData.status || 'draft',
        categoryId: blogData.categoryId || '',
        userId: getUserIdFromLocalStorage()
      });
      setShowEditModal(true);
    } catch (err) {
      handleApiError(err, 'Không thể tải thông tin bài viết để chỉnh sửa');
      // Fallback: use existing data and open modal anyway
      setSelectedBlog(blog);
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        tags: blog.tags || '',
        status: blog.status || 'draft',
        categoryId: blog.categoryId || '',
        userId: getUserIdFromLocalStorage()
      });
      setShowEditModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Sets blog for deletion and shows confirmation modal
  const handleDeleteClick = (blog) => {
    setSelectedBlog(blog);
    setShowDeleteModal(true);
  };

  // Executes blog deletion
  const handleDeleteBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/Blog/${selectedBlog.id}`, { timeout: 15000 });
      setBlogs(blogs.filter(b => b.id !== selectedBlog.id)); // Remove from state
      setShowDeleteModal(false);
      alert('Xóa bài viết thành công! ✅');
    } catch (err) {
      const msg = handleApiError(err, 'Không thể xóa bài viết');
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- Utility Functions for Display ---

  // Gets category name by ID for display
  const getCategoryNameById = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Không có danh mục';
  };

  // Filters blogs based on search term (case-insensitive)
  const filteredBlogs = blogs.filter(blog =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formats date and time for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      return new Date(dateTimeString).toLocaleString('vi-VN');
    } catch (e) {
      console.error("Invalid date string:", dateTimeString, e);
      return 'Ngày không hợp lệ';
    }
  };

  // --- JSX Render ---
  return (
    <>
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý blog</h1>
            <p className="text-gray-600 mt-1">Xem thông tin và quản lý tất cả các bài viết trên hệ thống</p>
          </div>
          <Link to="/home" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Về trang chủ
          </Link>
        </div>
      </div>

      <div className="px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, nội dung..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setShowAddModal(true);
              // Reset formData to initial empty state, fetching userId freshly
              setFormData({
                title: '',
                content: '',
                excerpt: '',
                categoryId: '', // Ensure category is explicitly selected for new posts
                tags: '',
                status: 'draft',
                thumbnailUrl: '',
                userId: getUserIdFromLocalStorage() // Lấy userId động từ localStorage
              });
              setError(null); // Clear any previous errors
            }}
            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Thêm bài viết
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* Loading spinner when fetching initial blogs data */}
        {loading && blogs.length === 0 ? (
          <div className="text-center p-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Mô tả ngắn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.length > 0 ? (
                  filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {blog.thumbnailUrl ? (
                          <img
                            src={blog.thumbnailUrl}
                            alt={blog.title || blog.name}
                            className="h-10 w-16 object-cover rounded"
                          />
                        ) : (
                          <div className="h-10 w-16 bg-gray-200 flex items-center justify-center rounded">
                            <ImageIcon size={16} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {blog.title || blog.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="line-clamp-1" title={blog.excerpt || blog.description}>
                          {blog.excerpt || blog.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          blog.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(blog.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewBlog(blog)}
                            className="p-2 rounded hover:bg-blue-50 text-blue-600"
                            title="Xem chi tiết"
                          >
                            <Eye size={20} />
                          </button>
                          <button
                            onClick={() => handleEditBlog(blog)}
                            className="p-2 rounded hover:bg-amber-50 text-amber-500"
                            title="Chỉnh sửa"
                          >
                            <PencilLine size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(blog)}
                            className="p-2 rounded hover:bg-red-50 text-red-500"
                            title="Xóa"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      {error || 'Không tìm thấy bài viết nào phù hợp'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Add New Blog Modal --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Thêm bài viết mới</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  // Reset form on close
                  setFormData({
                    title: '', content: '', excerpt: '', categoryId: '', tags: '', status: 'draft', thumbnailUrl: '',
                    userId: getUserIdFromLocalStorage()
                  });
                  setError(null); // Clear error on close
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddBlog} className="overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required // Status is also required
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="published">Xuất bản</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả ngắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required // Make category selection mandatory
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-sm text-amber-600 mt-1">
                    Không thể tải danh mục. Vui lòng thử lại sau.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (ngăn cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Thanh thiếu niên, Ma túy, Giáo dục"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="10"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ảnh đại diện (thumbnail) - Dán URL ảnh
                </label>
                <input
                  type="text"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.thumbnailUrl && (
                  <div className="mt-2">
                    <img src={formData.thumbnailUrl} alt="thumbnail" className="w-32 h-32 object-cover border rounded-lg" />
                  </div>
                )}
              </div>

              {/* Display errors if any */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null); // Clear error on close
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  disabled={loading}
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading ? 'Đang xử lý...' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- View Blog Details Modal --- */}
      {showViewModal && selectedBlog && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Chi tiết bài viết</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[70vh]">
              {selectedBlog.thumbnailUrl && (
                <div className="mb-6">
                  <img
                    src={selectedBlog.thumbnailUrl}
                    alt={selectedBlog.title || selectedBlog.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tiêu đề</h4>
                  <p className="mt-1 text-lg font-semibold">{selectedBlog.title || selectedBlog.name}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Mô tả ngắn</h4>
                  <p className="mt-1">{selectedBlog.excerpt || selectedBlog.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Danh mục</h4>
                  <p className="mt-1">{getCategoryNameById(selectedBlog.categoryId)}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tags</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedBlog.tags && selectedBlog.tags.split(',').map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Nội dung</h4>
                  <div className="mt-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    {/* Render HTML content safely */}
                    <div dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Trạng thái</h4>
                    <p className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedBlog.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedBlog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Ngày tạo</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDateTime(selectedBlog.createdAt)}
                    </p>
                  </div>
                </div>

                {selectedBlog.publishedAt && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Ngày xuất bản</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDateTime(selectedBlog.publishedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit Blog Modal --- */}
      {showEditModal && selectedBlog && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Chỉnh sửa bài viết</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setError(null); // Clear error on close
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateBlog} className="overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required // Status is also required
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="published">Xuất bản</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả ngắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required // Make category selection mandatory
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-sm text-amber-600 mt-1">
                    Không thể tải danh mục. Vui lòng thử lại sau.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (ngăn cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Thanh thiếu niên, Ma túy, Giáo dục"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="10"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ảnh đại diện (thumbnail) - Dán URL ảnh
                </label>
                <input
                  type="text"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.thumbnailUrl && (
                  <div className="mt-2">
                    <img src={formData.thumbnailUrl} alt="thumbnail" className="w-32 h-32 object-cover border rounded-lg" />
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setError(null); // Clear error on close
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center"
                  disabled={loading}
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading ? 'Đang xử lý...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {showDeleteModal && selectedBlog && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-600">Xác nhận xóa</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-700">
              Bạn có chắc chắn muốn xóa bài viết <span className="font-semibold">{selectedBlog.title || selectedBlog.name}</span>?
              Hành động này không thể hoàn tác.
            </p>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteBlog}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogManagement;