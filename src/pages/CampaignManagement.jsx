import React, { useState } from 'react';
import { Plus, Search, Eye, PencilLine, Trash2, X } from 'lucide-react';

const CampaignManagement = () => {
  // Mock data cho danh sách chương trình
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Ngày hội phòng chống ma túy',
      description: 'Chương trình tuyên truyền phòng chống ma túy cho học sinh các trường THPT trên địa bàn thành phố',
      createdAt: '6/19/2025, 5:41:05 AM',
      updatedAt: '6/19/2025, 5:41:05 AM',
    },
    {
      id: 2,
      name: 'Tập huấn kỹ năng từ chối',
      description: 'Tập huấn kỹ năng từ chối ma túy cho thanh thiếu niên tại các khu vực có nguy cơ cao',
      createdAt: '6/19/2025, 5:40:55 AM',
      updatedAt: '6/19/2025, 5:40:55 AM',
    },
    {
      id: 3,
      name: 'Hội thảo vai trò gia đình',
      description: 'Hội thảo về vai trò của gia đình trong việc phòng ngừa con em sử dụng ma túy',
      createdAt: '6/19/2025, 5:40:45 AM',
      updatedAt: '6/19/2025, 5:40:45 AM',
    },
    {
      id: 4,
      name: 'Chiến dịch truyền thông',
      description: 'Chiến dịch truyền thông nâng cao nhận thức về tác hại của ma túy trên các nền tảng mạng xã hội',
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
  
  // State để lưu trữ chương trình đang được chọn để xem/chỉnh sửa
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  
  // State cho modal xác nhận xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // State cho form thêm mới/chỉnh sửa (đã loại bỏ location và date)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Lọc chương trình theo từ khóa tìm kiếm
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
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
  const handleViewCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowViewModal(true);
  };
  
  // Xử lý mở modal chỉnh sửa
  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description
    });
    setShowEditModal(true);
  };
  
  // Xử lý mở modal xác nhận xóa
  const handleDeleteClick = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDeleteModal(true);
  };
  
  // Xử lý xóa chương trình
  const handleDeleteCampaign = () => {
    setCampaigns(campaigns.filter(c => c.id !== selectedCampaign.id));
    setShowDeleteModal(false);
  };
  
  // Xử lý thêm chương trình mới
  const handleAddCampaign = (e) => {
    e.preventDefault();
    
    // Tạo timestamp hiện tại
    const now = new Date().toLocaleString();
    
    // Tạo chương trình mới (đã loại bỏ location và date)
    const campaign = {
      id: campaigns.length + 1,
      name: formData.name,
      description: formData.description,
      createdAt: now,
      updatedAt: now,
    };
    
    // Thêm vào state
    setCampaigns([...campaigns, campaign]);
    
    // Đóng modal và reset form
    setShowAddModal(false);
    setFormData({
      name: '',
      description: ''
    });
  };
  
  // Xử lý cập nhật chương trình
  const handleUpdateCampaign = (e) => {
    e.preventDefault();
    
    // Tạo timestamp hiện tại
    const now = new Date().toLocaleString();
    
    // Cập nhật chương trình (đã loại bỏ location và date)
    const updatedCampaigns = campaigns.map(c => {
      if (c.id === selectedCampaign.id) {
        return {
          ...c,
          name: formData.name,
          description: formData.description,
          updatedAt: now
        };
      }
      return c;
    });
    
    // Cập nhật state
    setCampaigns(updatedCampaigns);
    
    // Đóng modal và reset form
    setShowEditModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý chương trình</h1>
          <p className="text-gray-600">Xem thông tin và quản lý tất cả các chương trình trên hệ thống</p>
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
        <button 
          onClick={() => setShowAddModal(true)}
          className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Thêm chương trình
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
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{campaign.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-1">{campaign.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{campaign.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{campaign.updatedAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleViewCampaign(campaign)} 
                        className="text-blue-600 hover:text-blue-900" 
                        title="Xem chi tiết"
                      >
                        <Eye size={20} />
                      </button>
                      <button 
                        onClick={() => handleEditCampaign(campaign)} 
                        className="text-amber-600 hover:text-amber-900" 
                        title="Chỉnh sửa"
                      >
                        <PencilLine size={20} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(campaign)} 
                        className="text-red-600 hover:text-red-900" 
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
                  Không tìm thấy chương trình nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal thêm mới */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Thêm chương trình mới</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddCampaign}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên chương trình
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Thêm mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal xem chi tiết */}
      {showViewModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Chi tiết chương trình</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Tên chương trình</h4>
                <p className="mt-1 text-base">{selectedCampaign.name}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Mô tả</h4>
                <p className="mt-1 text-base">{selectedCampaign.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Ngày tạo</h4>
                  <p className="mt-1 text-sm text-gray-500">{selectedCampaign.createdAt}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Cập nhật lần cuối</h4>
                  <p className="mt-1 text-sm text-gray-500">{selectedCampaign.updatedAt}</p>
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
      {showEditModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Chỉnh sửa chương trình</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateCampaign}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên chương trình
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
      {showDeleteModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              Bạn có chắc chắn muốn xóa chương trình <span className="font-semibold">{selectedCampaign.name}</span>? 
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
                onClick={handleDeleteCampaign}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignManagement;