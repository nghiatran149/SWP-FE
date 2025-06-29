import React, { useState } from 'react';
import { Plus, Search, Eye, PencilLine, Trash2 } from 'lucide-react';

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

  // Lọc chương trình theo từ khóa tìm kiếm
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <button className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
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
                  Không tìm thấy chương trình nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignManagement;