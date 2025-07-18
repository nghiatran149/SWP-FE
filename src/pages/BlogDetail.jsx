import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, FileText, ChevronLeft, ChevronRight, Clock, BookOpen } from 'lucide-react';
import api from '../api/api';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Helper function for standardizing API response extraction
  const extractData = (response) => {
    if (response && response.data && response.data.data) {
      return response.data.data;
    }
    if (response && response.data) {
      return response.data;
    }
    return null;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (e) {
      console.error("Invalid date string:", dateString, e);
      return 'Ngày không hợp lệ';
    }
  };

  // Calculate read time based on content length
  const calculateReadTime = (content) => {
    if (!content) return "2 phút đọc";
    // Average adult reading speed is about 200-250 words per minute
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} phút đọc`;
  };

  // Get category name by ID
  const getCategoryNameById = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Không có danh mục';
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch categories trước
        const catRes = await api.get('/BlogCategory');
        const categoriesData = extractData(catRes);
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
        // Fetch blog sau khi đã có categories
        const response = await api.get(`/Blog/${id}`);
        const blogData = extractData(response);
        if (blogData) {
          if (blogData.status !== 'published') {
            setError('Bài viết này chưa được xuất bản');
            setLoading(false);
            return;
          }
          // Map categoryId sang tên danh mục
          const categoryName = (Array.isArray(categoriesData) && categoriesData.find(c => c.id === blogData.categoryId)?.name) || 'Không có danh mục';
          const formattedBlog = {
            id: blogData.id,
            title: blogData.title || 'Không có tiêu đề',
            excerpt: blogData.excerpt || blogData.description || 'Không có mô tả',
            content: blogData.content || '<p>Không có nội dung</p>',
            date: formatDate(blogData.publishedAt || blogData.createdAt),
            author: blogData.username || 'Ẩn danh', // Sửa lấy đúng trường tác giả
            categoryId: blogData.categoryId,
            category: categoryName,
            image: blogData.thumbnailUrl,
            tags: blogData.tags ? blogData.tags.split(',').map(tag => tag.trim()) : [],
            readTime: calculateReadTime(blogData.content)
          };
          setBlog(formattedBlog);
          // Fetch related blogs
          fetchRelatedBlogs(blogData.categoryId, blogData.id, categoriesData);
        } else {
          setError('Không thể tải dữ liệu bài viết');
        }
      } catch (err) {
        setError('Không thể tải bài viết');
      } finally {
        setLoading(false);
      }
    };
    // Sửa fetchRelatedBlogs để nhận categoriesData
    const fetchRelatedBlogs = async (categoryId, currentBlogId, categoriesData) => {
      if (!categoryId) return;
      try {
        const response = await api.get('/Blog');
        const blogsData = extractData(response);
        if (Array.isArray(blogsData)) {
          const related = blogsData
            .filter(blog => blog.categoryId === categoryId && blog.id !== currentBlogId && blog.status === 'published')
            .slice(0, 3)
            .map(blog => ({
              id: blog.id,
              title: blog.title || 'Không có tiêu đề',
              excerpt: blog.excerpt || blog.description || 'Không có mô tả',
              date: formatDate(blog.publishedAt || blog.createdAt),
              category: (Array.isArray(categoriesData) && categoriesData.find(c => c.id === blog.categoryId)?.name) || 'Không có danh mục',
              image: blog.thumbnailUrl
            }));
          setRelatedPosts(related);
        }
      } catch (err) {
        // ignore
      }
    };
    if (id) {
      fetchAll();
    }
  }, [id]);
  
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
  
  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="bg-amber-50 text-amber-800 p-4 rounded-lg mb-4">
            <h2 className="text-2xl font-bold mb-2">{error ? 'Lỗi' : 'Không tìm thấy bài viết'}</h2>
            <p className="text-gray-600">
              {error || 'Bài viết này không tồn tại hoặc chưa được xuất bản.'}
            </p>
          </div>
          <Link to="/blog" className="text-emerald-600 hover:underline flex items-center justify-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách bài viết
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header và hero section */}
      <div className="w-full bg-gradient-to-r from-emerald-900 to-emerald-700 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center text-emerald-100 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Quay lại Blog</span>
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-emerald-600 rounded-full text-xs font-medium">
              {blog.category}
            </span>
            <span className="text-emerald-100">•</span>
            <div className="flex items-center gap-1 text-sm text-emerald-100">
              <Calendar className="h-4 w-4" />
              <span>{blog.date}</span>
            </div>
            <span className="text-emerald-100">•</span>
            <div className="flex items-center gap-1 text-sm text-emerald-100">
              <Clock className="h-4 w-4" />
              <span>{blog.readTime}</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm opacity-75">Tác giả</p>
              <p className="font-medium">{blog.author}</p>
            </div>
          </div>
        </div>
      </div>
      
        
      <div className="max-w-5xl mx-auto px-4 pt-8">
        {blog.image && (
          <div className="mb-8">
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-72 sm:h-96 object-cover" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/800x400?text=Blog+Image";
                }}
              />
            </div>
          </div>
        )}
        
        {/* Main content layout */}
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm p-6 mb-10">
          {/* Sidebar */}
          <div className="md:w-1/6 mb-8 md:mb-0 md:pr-6 md:border-r md:border-gray-100">
            <div className="sticky top-8">
              <h3 className="text-sm text-gray-500 uppercase mb-3 font-medium">Chia sẻ</h3>
              <div className="flex md:flex-col gap-2">
                <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Facebook className="h-5 w-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </button>
              </div>
              
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm text-gray-500 uppercase mb-3 font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <Link 
                        key={index} 
                        to={`/blog?tag=${tag}`}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-emerald-50 hover:text-emerald-700 transition-colors block mb-2"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Article content */}
          <div className="md:w-5/6 md:pl-8">
            {/* Excerpt */}
            <div className="mb-8">
              <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-emerald-500 pl-4 italic">
                {blog.excerpt}
              </p>
            </div>
            
            {/* Article Content */}
            <article className="prose prose-emerald lg:prose-lg max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </article>
            
            {/* Author info */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-10">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tác giả</p>
                  <h3 className="font-bold text-xl">{blog.author}</h3>
                  <p className="text-gray-600">Chuyên gia về phòng chống ma túy và sức khỏe tâm thần thanh thiếu niên</p>
                </div>
              </div>
            </div>
            
            {/* Related Articles Section */}
            {relatedPosts.length > 0 && (
              <div className="border-t border-gray-200 pt-10 mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <BookOpen className="h-6 w-6 mr-2 text-emerald-600" />
                  Bài viết liên quan
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map(post => (
                    <Link key={post.id} to={`/blog/${post.id}`} className="group">
                      <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
                        <div className="aspect-video bg-gray-100">
                          {post.image && (
                            <img 
                              src={post.image} 
                              alt={post.title} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/300x200?text=Blog+Image";
                              }}
                            />
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>{post.category}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                          </div>
                          <h4 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-gray-600 line-clamp-2 mb-3">{post.excerpt}</p>
                          <span className="text-emerald-600 font-medium flex items-center group-hover:text-emerald-700">
                            Đọc thêm
                            <ChevronRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <Link 
                    to="/blog" 
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Xem tất cả bài viết
                  </Link>
                </div>
              </div>
            )}
            
            {/* Pagination */}
            <div className="flex justify-between items-center border-t border-gray-200 pt-8">
              <button
                onClick={() => navigate(`/blog/${parseInt(id) - 1}`)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  parseInt(id) <= 1 
                    ? 'text-gray-400 pointer-events-none' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                disabled={parseInt(id) <= 1}
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Bài trước</span>
              </button>
              
              <button
                onClick={() => navigate(`/blog/${parseInt(id) + 1}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <span>Bài tiếp theo</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;