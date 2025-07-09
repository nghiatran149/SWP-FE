import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, PencilLine, Trash2, X } from 'lucide-react';

const BlogManagement = () => {
  // Mock data cho danh sách bài viết blog
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      name: 'Dấu hiệu nhận biết sử dụng ma túy',
      description: '5 Dấu hiệu nhận biết sự dụng ma túy ở thanh thiếu niên và cách phòng ngừa hiệu quả',
      createdAt: '6/19/2025, 5:41:05 AM',
      updatedAt: '6/19/2025, 5:41:05 AM',
    },
    {
      id: 2,
      name: 'Kỹ năng từ chối ma túy',
      description: 'Kỹ năng từ chối hiệu quả trong môi trường học đường và áp lực từ bạn bè',
      createdAt: '6/19/2025, 5:40:55 AM',
      updatedAt: '6/19/2025, 5:40:55 AM',
    },
    {
      id: 3,
      name: 'Vai trò của gia đình',
      description: 'Vai trò của gia đình trong phòng chống ma túy và bảo vệ con em',
      createdAt: '6/19/2025, 5:40:45 AM',
      updatedAt: '6/19/2025, 5:40:45 AM',
    },
    {
      id: 4,
      name: 'Tác hại của ma túy đá',
      description: 'Tác hại lâu dài của ma túy đá đối với não bộ và sức khỏe tâm thần',
      createdAt: '6/17/2025, 11:47:56 AM',
      updatedAt: '6/17/2025, 11:47:56 AM',
    }
  ]);

  // State cho chức năng tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // State để kiểm soát modal thêm mới
  const [showAddModal, setShowAddModal] = useState(false);

  // State để kiểm soát modal xem chi tiết
  const [showViewModal, setShowViewModal] = useState(false);

  // State để kiểm soát modal chỉnh sửa
  const [showEditModal, setShowEditModal] = useState(false);

  // State để lưu trữ bài viết đang được chọn để xem/chỉnh sửa
  const [selectedBlog, setSelectedBlog] = useState(null);

  // State cho modal xác nhận xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State cho form thêm mới/chỉnh sửa
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Lọc bài viết blog theo từ khóa tìm kiếm
  const filteredBlogs = blogs.filter(blog =>
    blog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Xử lý mở modal xem chi tiết
  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setShowViewModal(true);
  };

  // Xử lý mở modal chỉnh sửa
  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      name: blog.name,
      description: blog.description
    });
    setShowEditModal(true);
  };

  // Xử lý mở modal xác nhận xóa
  const handleDeleteClick = (blog) => {
    setSelectedBlog(blog);
    setShowDeleteModal(true);
  };

  // Xử lý xóa bài viết
  const handleDeleteBlog = () => {
    setBlogs(blogs.filter(b => b.id !== selectedBlog.id));
    setShowDeleteModal(false);
  };

  // Xử lý thêm bài viết mới
  const handleAddBlog = (e) => {
    e.preventDefault();

    // Tạo timestamp hiện tại
    const now = new Date().toLocaleString();

    // Tạo bài viết mới
    const blog = {
      id: blogs.length + 1,
      name: formData.name,
      description: formData.description,
      createdAt: now,
      updatedAt: now,
    };

    // Thêm vào state
    setBlogs([...blogs, blog]);

    // Đóng modal và reset form
    setShowAddModal(false);
    setFormData({
      name: '',
      description: ''
    });
  };

  // Xử lý cập nhật bài viết
  const handleUpdateBlog = (e) => {
    e.preventDefault();

    // Tạo timestamp hiện tại
    const now = new Date().toLocaleString();

    // Cập nhật bài viết
    const updatedBlogs = blogs.map(b => {
      if (b.id === selectedBlog.id) {
        return {
          ...b,
          name: formData.name,
          description: formData.description,
          updatedAt: now
        };
      }
      return b;
    });

    // Cập nhật state
    setBlogs(updatedBlogs);

    // Đóng modal và reset form
    setShowEditModal(false);
  };

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
              placeholder="Tìm kiếm theo tên, mô tả..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Thêm bài viết
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tên bài viết
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cập nhật lần cuối
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{blog.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="line-clamp-1" title={blog.description}>{blog.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.updatedAt}</td>
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
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy bài viết nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

        {/* Modal thêm mới */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Thêm bài viết mới</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddBlog}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Thêm mới
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal xem chi tiết */}
        {showViewModal && selectedBlog && (
          <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Chi tiết bài viết</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tiêu đề</h4>
                  <p className="mt-1 text-base">{selectedBlog.name}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Mô tả</h4>
                  <p className="mt-1 text-base">{selectedBlog.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Ngày tạo</h4>
                    <p className="mt-1 text-sm text-gray-500">{selectedBlog.createdAt}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Cập nhật lần cuối</h4>
                    <p className="mt-1 text-sm text-gray-500">{selectedBlog.updatedAt}</p>
                  </div>
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

        {/* Modal chỉnh sửa */}
        {showEditModal && selectedBlog && (
          <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Chỉnh sửa bài viết</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateBlog}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal xác nhận xóa */}
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
                Bạn có chắc chắn muốn xóa bài viết <span className="font-semibold">{selectedBlog.name}</span>?
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
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default BlogManagement;