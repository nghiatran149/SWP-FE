import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, PencilLine, Trash2, X } from 'lucide-react';
import api from '../api/api';

const CampaignManagement = () => {
  // State cho danh sách chương trình từ API
  const [campaigns, setCampaigns] = useState([]);
  // State lưu object gốc từ API để xem chi tiết
  const [rawCampaigns, setRawCampaigns] = useState([]);

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
  
  // State cho form thêm mới/chỉnh sửa
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAudience: '',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: '',
  });

  // Đặt ngoài useEffect, trong body của component
  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/CommunityProgram');
      const data = response.data;
      if (data && data.data) {
        console.log('API data:', data.data); // Log dữ liệu gốc từ API
        setRawCampaigns(data.data); // Lưu object gốc
        const mapped = data.data.map((item) => ({
          id: item.programId,
          name: item.title,
          createdAt: formatDateTime24h(item.createdAt),
          updatedAt: formatDateTime24h(item.updatedAt),
          maxParticipants: item.maxParticipants,
          currentParticipantsCount: item.currentParticipantsCount,
        }));
        console.log('Mapped campaigns:', mapped); // Log dữ liệu đã map cho bảng
        const sortedCampaigns = [...mapped].sort((a, b) => {
          const aDate = new Date(a.updatedAt && a.updatedAt !== '-' ? a.updatedAt : a.createdAt).getTime();
          const bDate = new Date(b.updatedAt && b.updatedAt !== '-' ? b.updatedAt : b.createdAt).getTime();
          return bDate - aDate;
        });
        setCampaigns(sortedCampaigns);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch campaigns:', error);
    }
  };

  // Trong useEffect chỉ gọi lại hàm này
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Sắp xếp campaigns mới tạo/cập nhật lên đầu (giống UserManagement)
  const sortedCampaigns = [...campaigns].sort((a, b) => {
    const aDate = new Date(a.updatedAt && a.updatedAt !== '-' ? a.updatedAt : a.createdAt).getTime();
    const bDate = new Date(b.updatedAt && b.updatedAt !== '-' ? b.updatedAt : b.createdAt).getTime();
    return bDate - aDate;
  });

  // Lọc chương trình theo từ khóa tìm kiếm (chỉ theo name)
  const filteredCampaigns = sortedCampaigns.filter(campaign => 
    campaign.name && campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    // Tìm object gốc theo id
    const original = rawCampaigns.find(item => item.programId === campaign.id);
    setSelectedCampaign(original || campaign);
    setShowViewModal(true);
  };
  
  // Xử lý mở modal chỉnh sửa
  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name || campaign.title,
      description: campaign.description || '',
      targetAudience: campaign.targetAudience || '',
      startDate: campaign.startDate ? toInputDateTime(campaign.startDate) : '',
      endDate: campaign.endDate ? toInputDateTime(campaign.endDate) : '',
      location: campaign.location || '',
      maxParticipants: campaign.maxParticipants !== undefined ? campaign.maxParticipants : '',
    });
    setShowEditModal(true);
  };
  
  // Xử lý xóa chương trình
  const handleDeleteCampaign = async (campaign) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chương trình này?')) return;
    try {
      await api.delete(`/CommunityProgram/${campaign.id || campaign.programId}`);
      alert('Xóa chương trình thành công!');
      fetchCampaigns();
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      if (error.response) {
        alert('Xóa chương trình thất bại! ' + (error.response.data?.message || JSON.stringify(error.response.data) || ''));
      } else {
        alert('Xóa chương trình thất bại! ' + error.message);
      }
    }
  };
  
  // Hàm chuyển datetime-local sang ISO 8601
  function toISODateTime(str) {
    if (!str) return null;
    // str: '2025-07-09T18:18' => '2025-07-09T18:18:00'
    return str.length === 16 ? str + ':00' : str;
  }
  
  // Hàm chuyển ISO về input datetime-local
  function toInputDateTime(str) {
    if (!str) return '';
    const d = new Date(str);
    if (isNaN(d)) return '';
    // yyyy-MM-ddTHH:mm
    return d.toISOString().slice(0, 16);
  }
  
  // Hàm mở modal add và reset formData
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      description: '',
      targetAudience: '',
      startDate: '',
      endDate: '',
      location: '',
      maxParticipants: '',
    });
    setShowAddModal(true);
  };
  
  // Hàm đóng modal update và reset formData
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setFormData({
      name: '',
      description: '',
      targetAudience: '',
      startDate: '',
      endDate: '',
      location: '',
      maxParticipants: '',
    });
  };
  
  // Xử lý thêm chương trình mới
  const handleAddCampaign = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.name,
        description: formData.description,
        targetAudience: formData.targetAudience,
        startDate: toISODateTime(formData.startDate),
        endDate: toISODateTime(formData.endDate),
        location: formData.location,
        maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : 0,
        surveyId: null,
      };
      await api.post('/CommunityProgram', payload);
      setShowAddModal(false);
      setFormData({
        name: '',
        description: '',
        targetAudience: '',
        startDate: '',
        endDate: '',
        location: '',
        maxParticipants: '',
      });
      // Reload lại danh sách
      fetchCampaigns();
    } catch (error) {
      // Log chi tiết lỗi
      console.error('Failed to add campaign:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        alert('Thêm chương trình thất bại! ' + (error.response.data?.message || JSON.stringify(error.response.data) || ''));
      } else {
        alert('Thêm chương trình thất bại! ' + error.message);
      }
    }
  };
  
  // Xử lý cập nhật chương trình
  const handleUpdateCampaign = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.name,
        description: formData.description,
        targetAudience: formData.targetAudience,
        startDate: toISODateTime(formData.startDate),
        endDate: toISODateTime(formData.endDate),
        location: formData.location,
        maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : 0,
      };
      await api.put(`/CommunityProgram/${selectedCampaign.programId || selectedCampaign.id}`, payload);
      setShowEditModal(false);
      setSelectedCampaign(null);
      setFormData({
        name: '',
        description: '',
        targetAudience: '',
        startDate: '',
        endDate: '',
        location: '',
        maxParticipants: '',
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Failed to update campaign:', error);
      if (error.response) {
        alert('Cập nhật chương trình thất bại! ' + (error.response.data?.message || JSON.stringify(error.response.data) || ''));
      } else {
        alert('Cập nhật chương trình thất bại! ' + error.message);
      }
    }
  };

  // Hàm format ngày giờ 24h
  function formatDateTime24h(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date)) return '-';
    // Format: HH:mm:ss DD/MM/YYYY
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  }

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý chương trình</h1>
            <p className="text-gray-600 mt-1">Xem thông tin và quản lý tất cả các chương trình trên hệ thống</p>
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
            onClick={handleOpenAddModal}
            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Thêm chương trình
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tên chương trình
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  SL tối đa
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  SL đã đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cập nhật lúc
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{campaign.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">{campaign.maxParticipants !== undefined ? campaign.maxParticipants : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">{campaign.currentParticipantsCount !== undefined ? campaign.currentParticipantsCount : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.createdAt || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.updatedAt || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewCampaign(campaign)}
                          className="p-2 rounded hover:bg-blue-50 text-blue-600"
                          title="Xem chi tiết"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleEditCampaign(campaign)}
                          className="p-2 rounded hover:bg-amber-50 text-amber-500"
                          title="Chỉnh sửa"
                        >
                          <PencilLine size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteCampaign(campaign)}
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
                    Không tìm thấy chương trình nào phù hợp
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đối tượng
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa điểm
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng tối đa
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min="0"
                />
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
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
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
              {/* <div>
                <h4 className="text-sm font-medium text-gray-500">ID chương trình</h4>
                <p className="mt-1 text-base break-all">{selectedCampaign.id || selectedCampaign.programId}</p>
              </div> */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">Tên chương trình</h4>
                <p className="mt-1 text-base">{selectedCampaign.name || selectedCampaign.title}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Mô tả</h4>
                <p className="mt-1 text-base">{selectedCampaign.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Đối tượng</h4>
                <p className="mt-1 text-base">{selectedCampaign.targetAudience || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Ngày bắt đầu</h4>
                  <p className="mt-1 text-sm text-gray-500">{formatDateTime24h(selectedCampaign.startDate)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Ngày kết thúc</h4>
                  <p className="mt-1 text-sm text-gray-500">{formatDateTime24h(selectedCampaign.endDate)}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Địa điểm</h4>
                <p className="mt-1 text-base">{selectedCampaign.location || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Ngày tạo</h4>
                  <p className="mt-1 text-sm text-gray-500">{formatDateTime24h(selectedCampaign.createdAt)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Cập nhật lần cuối</h4>
                  <p className="mt-1 text-sm text-gray-500">{formatDateTime24h(selectedCampaign.updatedAt)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Số lượng tối đa</h4>
                  <p className="mt-1 text-base">{selectedCampaign.maxParticipants !== undefined ? selectedCampaign.maxParticipants : '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Số lượng đã đăng ký</h4>
                  <p className="mt-1 text-base">{selectedCampaign.currentParticipantsCount !== undefined ? selectedCampaign.currentParticipantsCount : '-'}</p>
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
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Chỉnh sửa chương trình</h3>
              <button
                onClick={handleCloseEditModal}
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đối tượng
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa điểm
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng tối đa
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
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
    </>
  );
};

export default CampaignManagement;