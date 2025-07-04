import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Calendar, MapPin, Users, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Campaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/CommunityProgram');
        if (res.data && res.data.data) {
          setCampaigns(res.data.data);
        } else {
          setCampaigns([]);
        }
      } catch (err) {
        setError('Không thể tải danh sách chương trình cộng đồng.');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Render một card chương trình
  const renderCampaignCard = (campaign) => {
    return (
      <div key={campaign.programId} className="bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
        {/* Nội dung chương trình */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold mb-4">{campaign.title}</h3>
          <p className="text-gray-600 mb-4 text-md flex-1">{campaign.description}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar size={16} />
              <span>
                {campaign.startDate ? new Date(campaign.startDate).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : ''}
                {campaign.endDate ? ` - ${new Date(campaign.endDate).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin size={16} />
              <span>{campaign.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Users size={16} />
              <span>
                {campaign.currentParticipantsCount || 0} / {campaign.maxParticipants || '?'} người tham gia
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <User size={16} />
              <span>{campaign.targetAudience}</span>
            </div>
          </div>

          {/* Trạng thái */}
          <div className="mb-4">
            {campaign.startDate && campaign.endDate ? (
              (() => {
                const now = new Date();
                const start = new Date(campaign.startDate);
                const end = new Date(campaign.endDate);
                if (now < start) {
                  return <div className="bg-blue-100 text-blue-800 w-full py-2 rounded text-center text-sm font-semibold">Sắp diễn ra</div>;
                } else if (now > end) {
                  return <div className="bg-gray-100 text-gray-600 w-full py-2 rounded text-center text-sm font-semibold">Đã kết thúc</div>;
                } else {
                  return <div className="bg-green-100 text-green-800 w-full py-2 rounded text-center text-sm font-semibold">Đang diễn ra</div>;
                }
              })()
            ) : null}
          </div>

          {/* Nút xem chi tiết */}
          <button
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            onClick={() => navigate(`/campaigndetail/${campaign.programId}`)}
          >
            Xem chi tiết
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chương trình cộng đồng
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tham gia vào các hoạt động phòng chống ma túy tại cộng đồng
          </p>
        </div>

        {/* Loading/Error State */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Đang tải...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <>
            {/* Campaign Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((campaign) => renderCampaignCard(campaign))}
            </div>

            {/* Empty State */}
            {campaigns.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có chương trình cộng đồng nào
                </h3>
                <p className="text-gray-600">
                  Các chương trình cộng đồng đang được cập nhật. Vui lòng quay lại sau.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Campaign;