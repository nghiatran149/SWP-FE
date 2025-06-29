import React, { useState } from 'react';
import { Plus, Search, Eye, PencilLine, Trash2 } from 'lucide-react';

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

  // Lọc bài viết blog theo từ khóa tìm kiếm
  const filteredBlogs = blogs.filter(blog => 
    blog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý blog</h1>
          <p className="text-gray-600">Xem thông tin và quản lý tất cả các bài blog trên hệ thống</p>
        </div>
        <a href="/home" className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          Về trang chủ
        </a>
      </div>

      <div className="flex justify-between items-center mt-6 mb-4">
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
        <button className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
          <Plus size={20} className="mr-2" />
          Thêm bài viết
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NAME
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DESCRIPTION
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CREATED AT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                UPDATED AT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{blog.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-1">{blog.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{blog.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{blog.updatedAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      <button className="text-blue-600 hover:text-blue-900" title="Xem chi tiết">
                        <Eye size={20} />
                      </button>
                      <button className="text-amber-600 hover:text-amber-900" title="Chỉnh sửa">
                        <PencilLine size={20} />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Xóa">
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
  );
};

export default BlogManagement;