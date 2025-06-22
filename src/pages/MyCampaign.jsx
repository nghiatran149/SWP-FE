import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Clock, BookOpen, Download, Award, CheckCircle, Users, Plus } from 'lucide-react';

const MyCampaign = () => {
  const [activeTab, setActiveTab] = useState('registered'); // 'registered', 'completed', 'recommended'

  // Dữ liệu mẫu cho các chương trình đã đăng ký
  const registeredCampaigns = [
    {
      id: 1,
      title: "Phòng ngừa lạm dụng chất gây nghiện ở thanh thiếu niên",
      description: "Một chương trình toàn diện được thiết kế dành cho thanh thiếu niên nhằm hiểu và ngăn ngừa tình trạng lạm dụng chất gây nghiện.",
      progress: 65,
      startDate: "15/9/2023",
      endDate: "12/15/2023",
      nextSession: "11/10/2023",
      completedSessions: 8,
      totalSessions: 12,
      status: "Đang tiến hành",
      image: "/images/teen-prevention.jpg"
    },
    {
      id: 2,
      title: "Hội thảo giáo dục phòng ngừa lạm dụng chất gây nghiện cho phụ huynh",
      description: "Chuỗi hội thảo giáo dục dành cho phụ huynh để tìm hiểu về các chiến lược phòng ngừa lạm dụng chất gây nghiện.",
      progress: 30,
      startDate: "10/5/2023",
      endDate: "20/01/2024",
      nextSession: "11/12/2023",
      completedSessions: 3,
      totalSessions: 10,
      status: "Đang tiến hành",
      image: "/images/parent-workshop.jpg"
    }
  ];

  // Dữ liệu mẫu cho các chương trình đã hoàn thành
  const completedCampaigns = [
    {
      id: 3,
      title: "Những điều cơ bản về nhận thức về ma túy",
      description: "Hiểu biết cơ bản về các chất khác nhau và tác động của chúng đối với sức khỏe.",
      completionDate: "20/8/2023",
      certificateId: "CERT-DAF-2023-1234",
      completedSessions: 8,
      totalSessions: 8,
      status: "Hoàn thành",
      image: "/images/drug-awareness.jpg"
    }
  ];

  // Dữ liệu mẫu cho các chương trình được khuyến khích
  const recommendedCampaigns = [
    {
      id: 4,
      title: "Sức đề kháng của áp lực ngang hàng",
      description: "Tìm hiểu các chiến lược hiệu quả để chống lại áp lực từ bạn bè liên quan đến việc sử dụng chất gây nghiện.",
      duration: "8 tuần",
      startDate: "12/1/2023",
      sessions: "8 Phiên",
      type: "Chương trình nhóm",
      image: "/images/peer-pressure.jpg"
    },
    {
      id: 5,
      title: "Nhóm hỗ trợ phục hồi",
      description: "Một môi trường hỗ trợ cho những người đang trong quá trình phục hồi sau khi lạm dụng chất gây nghiện.",
      duration: "12 tuần",
      startDate: "25/11/2023",
      sessions: "12 buổi",
      type: "Chương trình nhóm",
      image: "/images/support-group.jpg"
    }
  ];

  // Component hiển thị thanh tiến trình
  const ProgressBar = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
      <div 
        className="bg-green-600 h-2.5 rounded-full" 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );

  // Component hiển thị thẻ trạng thái
  const StatusBadge = ({ status }) => {
    let bgColor = "bg-black";
    
    if (status === "Hoàn thành") {
      bgColor = "bg-green-500";
    } else if (status === "Đang tiến hành") {
      bgColor = "bg-black";
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold text-white ${bgColor} rounded-full`}>
        {status}
      </span>
    );
  };

  // Render chương trình đã hoàn thành
  const renderCompletedCampaign = (campaign) => (
    <div key={campaign.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="relative">
        {/* Hình ảnh chương trình */}
        <div className="aspect-[16/9] bg-gray-200 w-full">
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
        
        {/* Badge trạng thái */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={campaign.status} />
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>
        
        <div className="flex items-start mb-4 gap-2">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Hoàn thành:</p>
            <p className="text-sm">{campaign.completionDate}</p>
          </div>
        </div>

        <div className="flex items-start mb-4 gap-2">
          <Award className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Giấy chứng nhận:</p>
            <p className="text-sm">{campaign.certificateId}</p>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
          <div>
            <p className="text-xs text-gray-500">Phiên:</p>
            <p className="text-sm">{campaign.completedSessions} / {campaign.totalSessions} Phiên</p>
          </div>
        </div>

        <div className="flex justify-between mt-5">
          {/* Thay thế button thành Link */}
          <Link 
            to={`/my-campaigns/${campaign.id}`} 
            className="px-4 py-3 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-md font-medium"
          >
            Xem chi tiết
          </Link>
          <button className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 text-md font-medium flex items-center">
            <Download className="w-4 h-4 mr-1" /> Tải xuống chứng chỉ
          </button>
        </div>
      </div>
    </div>
  );

  // Render chương trình đã đăng ký
  const renderRegisteredCampaign = (campaign) => (
    <div key={campaign.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="relative">
        {/* Hình ảnh chương trình */}
        <div className="aspect-[16/9] bg-gray-200 w-full">
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
        
        {/* Badge trạng thái */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={campaign.status} />
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Tiến trình</span>
            <span className="font-medium">{campaign.progress} %</span>
          </div>
          <ProgressBar value={campaign.progress} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Bắt đầu:</p>
              <p className="text-sm">{campaign.startDate}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Kết thúc:</p>
              <p className="text-sm">{campaign.endDate}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Tiếp theo:</p>
              <p className="text-sm">{campaign.nextSession}</p>
            </div>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Phiên:</p>
              <p className="text-sm">{campaign.completedSessions} / {campaign.totalSessions} Phiên</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-5">
          {/* Thay thế button thành Link */}
          <Link 
            to={`/my-campaigns/${campaign.id}`} 
            className="px-4 py-3 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-md font-medium"
          >
            Xem chi tiết
          </Link>
          <button className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-md font-medium">
            Tiếp tục chương trình
          </button>
        </div>
      </div>
    </div>
  );

  // Render chương trình được khuyến khích
  const renderRecommendedCampaign = (campaign) => (
    <div key={campaign.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="relative">
        {/* Hình ảnh chương trình */}
        <div className="aspect-[16/9] bg-gray-200 w-full">
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
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Thời gian:</p>
              <p className="text-sm">{campaign.duration}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Bắt đầu:</p>
              <p className="text-sm">{campaign.startDate}</p>
            </div>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Phiên:</p>
              <p className="text-sm">{campaign.sessions}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Loại:</p>
              <p className="text-sm">{campaign.type}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-5">
          {/* Thay thế button thành Link */}
          <Link 
            to={`/my-campaigns/${campaign.id}`} 
            className="px-4 py-3 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-md font-medium"
          >
            Tìm hiểu thêm
          </Link>
          <button className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-md font-medium">
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );

  // Hàm để hiển thị nội dung dựa trên tab đang chọn
  const renderTabContent = () => {
    switch (activeTab) {
      case 'registered':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {registeredCampaigns.map(campaign => renderRegisteredCampaign(campaign))}
            {registeredCampaigns.length === 0 && (
              <p className="text-center text-gray-500 col-span-2">Chưa đăng ký chương trình nào.</p>
            )}
          </div>
        );
      case 'completed':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {completedCampaigns.map(campaign => renderCompletedCampaign(campaign))}
            {completedCampaigns.length === 0 && (
              <p className="text-center text-gray-500 col-span-2">Chưa hoàn thành chương trình nào.</p>
            )}
          </div>
        );
      case 'recommended':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recommendedCampaigns.map(campaign => renderRecommendedCampaign(campaign))}
            {recommendedCampaigns.length === 0 && (
              <p className="text-center text-gray-500 col-span-2">Không có chương trình khuyến nghị nào.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chương trình của tôi
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các chương trình đã đăng ký và theo dõi tiến trình của bạn
            </p>
          </div>
          <Link to="/home" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Về trang chủ
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="p-8 mx-auto max-w-7xl">
        {/* Tabs navigation - Updated to match MyAssessment style */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              {[
                { id: 'registered', label: 'Đã đăng ký', count: registeredCampaigns.length },
                { id: 'completed', label: 'Hoàn thành', count: completedCampaigns.length },
                { id: 'recommended', label: 'Khuyến khích', count: recommendedCampaigns.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
            <Link to="/campaigns" className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ml-4">
              Xem tất cả chương trình
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default MyCampaign;