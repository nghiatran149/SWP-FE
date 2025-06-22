import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';

const Campaign = () => {
  // Dữ liệu mẫu cho các chương trình
  const campaigns = [
    {
      id: 1,
      title: "Ngày hội phòng chống ma túy trong trường học",
      description: "Chương trình nâng cao nhận thức về phòng chống ma túy cho học sinh, giáo viên và phụ huynh",
      date: "6/26/2023",
      location: "Trường THPT Nguyễn Du, Quận 1, TP.HCM",
      participants: 500,
      image: "/images/school-campaign.jpg",
      status: "upcoming" // upcoming, ongoing, completed
    },
    {
      id: 2,
      title: "Hội thảo kỹ năng từ chối ma túy cho thanh thiếu niên",
      description: "Hội thảo trang bị kỹ năng từ chối và đối phó với áp lực từ bạn bè",
      date: "7/15/2023",
      location: "Nhà Văn hóa Thanh niên, Quận 1, TP.HCM",
      participants: 200,
      image: "/images/youth-workshop.jpg",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Tập huấn phòng chống ma túy cho giáo viên",
      description: "Chương trình tập huấn kỹ năng nhận biết và phòng ngừa sử dụng ma túy trong trường học",
      date: "5/10/2023",
      location: "Trung tâm Giáo dục Thường xuyên, Quận 3, TP.HCM",
      participants: 150,
      image: "/images/teacher-training.jpg",
      status: "completed"
    }
  ];

  // Render một card chương trình
  const renderCampaignCard = (campaign) => {
    return (
      <div key={campaign.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="flex flex-col h-full">
          {/* Tiêu đề chương trình */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{campaign.title}</h3>
            <p className="text-sm text-gray-600">{campaign.description}</p>
          </div>
          
          {/* Hình ảnh minh họa */}
          <div className="aspect-[4/3] bg-gray-100 w-full flex-none">
            {campaign.image ? (
              <img 
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">Không có hình ảnh</span>
              </div>
            )}
          </div>
          
          {/* Thông tin bổ sung */}
          <div className="p-5 space-y-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              {campaign.date}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              {campaign.location}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 text-gray-400" />
              {campaign.participants}
            </div>
            
            {/* Trạng thái của chương trình */}
            <div className="pt-3">
              {campaign.status === 'upcoming' ? (
                <div className="bg-gray-100 w-full py-2 rounded text-center text-sm text-gray-600">
                  Sắp diễn ra
                </div>
              ) : campaign.status === 'completed' ? (
                <button className="bg-black text-white w-full py-2 rounded text-center text-sm">
                  Đã kết thúc
                </button>
              ) : (
                <div className="bg-blue-50 text-blue-600 w-full py-2 rounded text-center text-sm font-medium">
                  Đang diễn ra
                </div>
              )}
            </div>
            
            {/* Nút xem chi tiết */}
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 w-full py-2 rounded text-center text-sm">
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-0">
      <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Chương trình cộng đồng
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Tham gia vào các hoạt động phòng chống ma túy tại cộng đồng
            </p>
          </div>
          </div>

      {/* Danh sách chương trình */}
      <div className="px-8 py-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(campaign => renderCampaignCard(campaign))}
        </div>
      </div>
    </div>
  );
};

export default Campaign;