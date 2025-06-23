import React, { useState } from 'react';
import { Search, Calendar, User, ArrowRight, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'Tất cả',
    'Thanh thiếu niên',
    'Gia đình',
    'Giáo dục',
    'Sức khỏe',
    'Kỹ năng sống'
  ];
// mock dữ liệu
  const blogPosts = [
    {
      id: 1,
      title: '5 Dấu hiệu nhận biết sự dụng ma túy ở thanh thiếu niên',
      excerpt: 'Làm thế nào để nhận biết sớm các dấu hiệu sử dụng ma túy ở con em mình? Bài viết này sẽ giúp phụ huynh và giáo viên nhận biết các dấu hiệu cảnh báo sớm.',
      date: '10/5/2023',
      author: 'TS. Nguyễn Văn A',
      category: 'Thanh thiếu niên',
      featured: true,
      image: true
    },
    {
      id: 2,
      title: 'Kỹ năng từ chối hiệu quả trong môi trường học đường',
      excerpt: 'Các kỹ năng giúp học sinh tự tin từ chối khi bị mời sử dụng chất cấm...',
      date: '22/04/2023',
      author: 'ThS. Trần Thị B',
      category: 'Kỹ năng sống',
      image: true
    },
    {
      id: 3,
      title: 'Vai trò của gia đình trong phòng chống ma túy',
      excerpt: 'Gia đình là yếu tố quan trọng nhất trong việc phòng ngừa sử dụng ma túy...',
      date: '15/04/2023',
      author: 'PGS.TS. Lê Văn C',
      category: 'Gia đình',
      image: true
    },
    {
      id: 4,
      title: 'Làm thế nào để trò chuyện với con về ma túy',
      excerpt: 'Hướng dẫn cho phụ huynh cách bắt đầu cuộc trò chuyện khó khăn này...',
      date: '30/03/2023',
      author: 'ThS. Phạm Thị D',
      category: 'Gia đình',
      image: true
    },
    {
      id: 5,
      title: 'Tác động của ma túy đối với não bộ đang phát triển',
      excerpt: 'Nghiên cứu mới về tác động của ma túy đối với não bộ đang phát triển ở thanh thiếu niên...',
      date: '15/03/2023',
      author: 'PGS.TS. Hoàng Văn E',
      category: 'Sức khỏe',
      image: true
    },
    {
      id: 6,
      title: 'Các loại ma túy phổ biến và tác hại của chúng',
      excerpt: 'Tổng quan về các loại ma túy phổ biến hiện nay và tác hại của chúng đối với sức khỏe...',
      date: '28/02/2023',
      author: 'TS. Lê Thị F',
      category: 'Sức khỏe',
      image: false
    }
  ];
  //Lọc bài viết

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'Tất cả' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Phân loại bài viết
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  // Phần giao diện
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
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {featuredPost && (
          <div className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>Thanh thiếu niên</span>
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
              {/* Image Placeholder */}
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {post.image ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
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
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
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

        {/* Load More Button */}
        {filteredPosts.length > 6 && (
          <div className="text-center mt-12">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200">
              Xem thêm bài viết
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (
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