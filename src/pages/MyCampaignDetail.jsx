import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, BookOpen, MessageSquare, FileText, Download } from 'lucide-react';

const MyCampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'all'

  const campaignData = {
    1: {
      id: 1,
      title: "Phòng ngừa lạm dụng chất gây nghiện ở thanh thiếu niên",
      description: "Một chương trình toàn diện được thiết kế dành cho thanh thiếu niên nhằm hiểu và ngăn ngừa tình trạng lạm dụng chất gây nghiện. Chương trình này bao gồm nhiều chủ đề khác nhau bao gồm hiểu biết về chứng nghiện, áp lực từ bạn bè, cơ chế đối phó lành mạnh và xây dựng khả năng phục hồi.",
      progress: 65,
      startDate: "15/9/2023",
      endDate: "15/12/2023",
      instructor: "Tiến sĩ Sarah Johnson",
      totalSessions: 12,
      completedSessions: 8,
      remainingSessions: 4,
      status: "Đang tiến hành",
      location: "Trung tâm cộng đồng và trực tuyến",
      image: "/images/teen-prevention.jpg",
      nextSession: {
        title: "Mối quan hệ lành mạnh",
        date: "11/10/2023",
        duration: "90 phút", 
        description: "Nhận biết các mối quan hệ lành mạnh và không lành mạnh và tác động của chúng đến việc sử dụng chất gây nghiện.",
        materials: [
          "Công cụ đánh giá mối quan hệ",
          "Video: Ranh giới lành mạnh"
        ]
      },
      resources: [
        { name: "Sổ tay chương trình", type: "document" },
        { name: "Phiên ghi âm", type: "audio" },
        { name: "Diễn đàn thảo luận", type: "forum" }
      ],
      completedSessionsDetails: [
        {
          id: 1,
          title: "Hiểu về nghiện ngập",
          date: "15/9/2023",
          duration: "90 phút",
          completed: true,
          description: "Tìm hiểu về cơ chế nghiện trong não bộ và các yếu tố rủi ro có thể dẫn đến nghiện ngập.",
          materials: [
            "Tài liệu phát tay: Cơ bản về hóa học não",
            "Video: Hiểu về nghiện ngập"
          ]
        }
      ]
    },
    2: {
      id: 2,
      title: "Hội thảo giáo dục phòng ngừa lạm dụng chất gây nghiện cho phụ huynh",
      description: "Chuỗi hội thảo giáo dục dành cho phụ huynh để tìm hiểu về các chiến lược phòng ngừa lạm dụng chất gây nghiện.",
      progress: 30,
      startDate: "10/5/2023",
      endDate: "20/01/2024",
      instructor: "ThS. Trần Thị Minh",
      totalSessions: 10,
      completedSessions: 3,
      remainingSessions: 7,
      status: "Đang tiến hành",
      location: "Trường THCS Lê Quý Đôn, Q.3",
      image: "/images/parent-workshop.jpg",
      nextSession: {
        title: "Kỹ năng giao tiếp với con về ma túy",
        date: "11/12/2023",
        duration: "120 phút",
        description: "Học cách tiếp cận và trò chuyện với con về vấn đề ma túy một cách hiệu quả.",
        materials: [
          "Hướng dẫn trò chuyện với con",
          "Tài liệu về kỹ năng lắng nghe chủ động"
        ]
      },
      resources: [
        { name: "Cẩm nang dành cho phụ huynh", type: "document" },
        { name: "Video hướng dẫn", type: "document" },
        { name: "Nhóm hỗ trợ trực tuyến", type: "forum" }
      ],
      completedSessionsDetails: [
        {
          id: 1,
          title: "Hiểu về sự phát triển của thanh thiếu niên",
          date: "10/5/2023",
          duration: "2 giờ",
          completed: true,
          description: "Tìm hiểu về sự phát triển não bộ của thanh thiếu niên và tác động của nó đến hành vi và khả năng ra quyết định.",
          materials: [
            "Tài liệu phát tay: Phát triển não bộ ở tuổi vị thành niên",
            "Hướng dẫn thảo luận"
          ]
        },
        {
          id: 2,
          title: "Các dấu hiệu cảnh báo lạm dụng chất gây nghiện",
          date: "24/5/2023",
          duration: "2 giờ",
          completed: true,
          description: "Nhận biết các dấu hiệu cảnh báo sớm khi con bạn có thể đang thử nghiệm hoặc lạm dụng chất gây nghiện.",
          materials: [
            "Danh sách dấu hiệu nhận biết",
            "Video minh họa: Các thay đổi hành vi"
          ]
        },
        {
          id: 3,
          title: "Xây dựng môi trường gia đình hỗ trợ",
          date: "7/6/2023",
          duration: "2 giờ",
          completed: true,
          description: "Chiến lược để tạo môi trường gia đình hỗ trợ giúp phòng ngừa lạm dụng chất gây nghiện ở thanh thiếu niên.",
          materials: [
            "Tài liệu: Nguyên tắc xây dựng môi trường gia đình lành mạnh",
            "Bài tập thực hành"
          ]
        }
      ]
    },
    3: {
      id: 3,
      title: "Những điều cơ bản về nhận thức về ma túy",
      description: "Hiểu biết cơ bản về các chất khác nhau và tác động của chúng đối với sức khỏe.",
      progress: 100,
      startDate: "05/5/2023",
      endDate: "20/8/2023",
      completionDate: "20/8/2023",
      certificateId: "CERT-DAF-2023-1234",
      instructor: "PGS.TS. Lê Văn Bình",
      totalSessions: 8,
      completedSessions: 8,
      remainingSessions: 0,
      status: "Hoàn thành",
      location: "Trực tuyến",
      image: "/images/drug-awareness.jpg",
      resources: [
        { name: "Tài liệu khóa học", type: "document" },
        { name: "Giấy chứng nhận", type: "document" }
      ]
    },
    4: {
      id: 4,
      title: "Sức đề kháng của áp lực ngang hàng",
      description: "Tìm hiểu các chiến lược hiệu quả để chống lại áp lực từ bạn bè liên quan đến việc sử dụng chất gây nghiện.",
      duration: "8 tuần",
      startDate: "12/1/2023",
      endDate: "6/3/2024",
      instructor: "ThS. Phạm Thu Hà",
      totalSessions: 8,
      status: "Sắp tới",
      location: "Trung tâm Thanh thiếu niên Q.1, TP.HCM",
      image: "/images/peer-pressure.jpg",
      schedule: "Mỗi thứ Bảy, 9:00 - 11:00",
      resources: [
        { name: "Giới thiệu chương trình", type: "document" },
        { name: "Lịch học dự kiến", type: "document" }
      ]
    },
    5: {
      id: 5,
      title: "Nhóm hỗ trợ phục hồi",
      description: "Một môi trường hỗ trợ cho những người đang trong quá trình phục hồi sau khi lạm dụng chất gây nghiện.",
      duration: "12 tuần",
      startDate: "25/11/2023",
      endDate: "17/2/2024",
      instructor: "TS. Hoàng Minh Tuấn",
      totalSessions: 12,
      status: "Sắp tới",
      location: "Trung tâm Y tế dự phòng TP.HCM",
      image: "/images/support-group.jpg",
      schedule: "Mỗi thứ Tư, 18:00 - 20:00",
      resources: [
        { name: "Giới thiệu về nhóm hỗ trợ", type: "document" },
        { name: "Quy tắc tham gia", type: "document" }
      ]
    }
  };

  useEffect(() => {
    // Mô phỏng việc tải dữ liệu
    setLoading(true);
    setTimeout(() => {
      setCampaign(campaignData[id] || null);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy chương trình</h2>
          <p className="text-gray-600 mb-4">Chương trình bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link to="/mycampaign" className="text-blue-600 hover:underline">Quay lại danh sách chương trình</Link>
        </div>
      </div>
    );
  }

  // Component hiển thị thanh tiến độ
  const ProgressBar = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-black h-2 rounded-full" 
        style={{ width: `${value}%` }}
      />
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header với nút quay lại và tiêu đề */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/mycampaign" className="text-gray-500 hover:text-gray-700 mr-3">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">{campaign.title}</h1>
            
            <div className="ml-auto">
              <button className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                {campaign.status === "Đang tiến hành" ? "Đang tiến hành" : campaign.status}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Khung chương trình*/}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Khung chính với border */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          {/* Khoảng trống cho hình ảnh */}
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
            <img 
              src={campaign.image || "https://via.placeholder.com/800x400?text=Campaign+Image"} 
              alt={campaign.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Nội dung bên trong khung */}
          <div className="p-6">
            {/* Tiêu đề và mô tả */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{campaign.title}</h2>
              <p className="text-gray-600 text-sm">{campaign.description}</p>
            </div>
            
            {/* Tiến độ */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Tiến độ chung</span>
                <span className="font-medium">{campaign.progress} %</span>
              </div>
              <ProgressBar value={campaign.progress} />
            </div>
            
            {/* Thông tin người giảng dạy và ngày tháng */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Giảng viên:</p>
                  <p className="text-sm">{campaign.instructor}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Bắt đầu:</p>
                  <p className="text-sm">{campaign.startDate}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Kết thúc:</p>
                  <p className="text-sm">{campaign.endDate}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Phiên:</p>
                  <p className="text-sm">{campaign.completedSessions || 0} / {campaign.totalSessions} Phiên</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout hai cột cho phần bên dưới */}
        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Cột trái - Thông tin chính */}
          <div className="md:w-2/3">
            {/* Tab navigation cho chương trình đang diễn ra - ĐÃ CẬP NHẬT */}
            {campaign.status === "Đang tiến hành" && (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                      {[
                        { id: 'upcoming', label: 'Sắp tới' },
                        { id: 'completed', label: 'Hoàn thành' },
                        { id: 'all', label: 'Tất cả các phiên' },
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
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Tab Sắp tới */}
                {activeTab === 'upcoming' && (
                  <div className="bg-white p-6 rounded-md shadow-sm mb-6">
                    {campaign.nextSession && (
                      <>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-bold">{campaign.nextSession.title}</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Sắp tới</span>
                        </div>
                        
                        <p className="text-gray-700 mb-4">
                          {campaign.nextSession.description}
                        </p>
                        
                        <div className="flex items-center mb-3">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{campaign.nextSession.date}</span>
                        </div>
                        
                        <div className="flex items-center mb-5">
                          <Clock className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{campaign.nextSession.duration}</span>
                        </div>
                        
                        {campaign.nextSession.materials && (
                          <div className="mb-5">
                            <h4 className="font-medium mb-2">Nguyên vật liệu:</h4>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                              {campaign.nextSession.materials.map((material, index) => (
                                <li key={index}>{material}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <button className="w-full bg-black text-white rounded-md py-3 font-medium">
                          Chuẩn bị cho Phiên họp
                        </button>
                      </>
                    )}
                  </div>
                )}
                
                {/* Tab Hoàn thành - ĐÃ CẬP NHẬT FORM VỚI THANH TIẾN ĐỘ */}
                {activeTab === 'completed' && campaign.completedSessionsDetails && campaign.completedSessionsDetails.length > 0 && (
                  <div className="bg-white p-6 rounded-md shadow-sm mb-6">
                    {campaign.completedSessionsDetails[0] && (
                      <>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-bold">{campaign.completedSessionsDetails[0].title}</h3>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Hoàn thành</span>
                        </div>
                        
                        {campaign.completedSessionsDetails[0].description && (
                          <p className="text-gray-700 mb-4">
                            {campaign.completedSessionsDetails[0].description}
                          </p>
                        )}
                        
                        {/* GIỮ LẠI THANH TIẾN ĐỘ */}
                        <div className="mb-5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700">Tiến độ chung</span>
                            <span className="font-medium text-green-600">Hoàn thành</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center mb-3">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{campaign.completedSessionsDetails[0].date}</span>
                        </div>
                        
                        <div className="flex items-center mb-5">
                          <Clock className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{campaign.completedSessionsDetails[0].duration}</span>
                        </div>
                        
                        {campaign.completedSessionsDetails[0].materials && (
                          <div className="mb-5">
                            <h4 className="font-medium mb-2">Nguyên vật liệu:</h4>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                              {campaign.completedSessionsDetails[0].materials.map((material, index) => (
                                <li key={index}>{material}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md py-3 font-medium">
                          Hoàn thành
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Tab Tất cả các phiên */}
                {activeTab === 'all' && (
                  <>
                    {/* Phiên sắp tới - ĐÃ CẬP NHẬT FORM */}
                    {campaign.nextSession && (
                      <div className="bg-white p-6 rounded-md shadow-sm mb-6">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-bold">{campaign.nextSession.title}</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Sắp tới</span>
                        </div>
                        
                        <p className="text-gray-700 mb-4">
                          {campaign.nextSession.description}
                        </p>
                        
                        <div className="flex items-center mb-3">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{campaign.nextSession.date}</span>
                        </div>
                        
                        <div className="flex items-center mb-5">
                          <Clock className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{campaign.nextSession.duration}</span>
                        </div>
                        
                        {campaign.nextSession.materials && (
                          <div className="mb-5">
                            <h4 className="font-medium mb-2">Nguyên vật liệu:</h4>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                              {campaign.nextSession.materials.map((material, index) => (
                                <li key={index}>{material}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <button className="w-full bg-black text-white rounded-md py-3 font-medium">
                          Chuẩn bị cho Phiên họp
                        </button>
                      </div>
                    )}
                    
                    {/* Phiên đã hoàn thành - ĐÃ CẬP NHẬT FORM VỚI THANH TIẾN ĐỘ */}
                    {campaign.completedSessionsDetails && campaign.completedSessionsDetails.map((session) => (
                      <div key={session.id} className="bg-white p-6 rounded-md shadow-sm mb-6">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-bold">{session.title}</h3>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Hoàn thành</span>
                        </div>
                        
                        {session.description && (
                          <p className="text-gray-700 mb-4">
                            {session.description}
                          </p>
                        )}
                        
                        {/* GIỮ LẠI THANH TIẾN ĐỘ */}
                        <div className="mb-5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700">Tiến độ chung</span>
                            <span className="font-medium text-green-600">Hoàn thành</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center mb-3">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{session.date}</span>
                        </div>
                        
                        <div className="flex items-center mb-5">
                          <Clock className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{session.duration}</span>
                        </div>
                        
                        {session.materials && (
                          <div className="mb-5">
                            <h4 className="font-medium mb-2">Nguyên vật liệu:</h4>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                              {session.materials.map((material, index) => (
                                <li key={index}>{material}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md py-3 font-medium">
                          Hoàn thành
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
            
            {/* Hiển thị thông tin chứng chỉ nếu đã hoàn thành */}
            {campaign.status === "Hoàn thành" && (
              <div className="bg-white p-6 rounded-md shadow-sm mb-6">
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="bg-green-500 rounded-full p-2 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-green-800">Chương trình đã hoàn thành</h3>
                      <p className="text-green-700 text-sm">Bạn đã hoàn thành thành công tất cả các phiên học.</p>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Thông tin chứng chỉ</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Mã chứng chỉ:</p>
                      <p className="font-medium">{campaign.certificateId}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Ngày hoàn thành:</p>
                      <p className="font-medium">{campaign.completionDate}</p>
                    </div>
                  </div>
                  
                  <button className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium">
                    <Download className="h-5 w-5 mr-2" />
                    Tải chứng chỉ
                  </button>
                </div>
              </div>
            )}
            
            {/* Hiển thị thông tin lịch trình nếu chương trình sắp tới */}
            {campaign.status === "Sắp tới" && (
              <div className="bg-white p-6 rounded-md shadow-sm mb-6">
                <h3 className="font-medium mb-4">Thông tin lịch trình</h3>
                <div className="space-y-4 mb-6">
                  {campaign.schedule && (
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Lịch học:</p>
                        <p>{campaign.schedule}</p>
                      </div>
                    </div>
                  )}
                  {campaign.duration && (
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Thời gian:</p>
                        <p>{campaign.duration}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <button className="w-full bg-blue-600 text-white py-3 rounded-md font-medium">
                  Đăng ký ngay
                </button>
              </div>
            )}
          </div>
          
          {/* Cột phải - Chi tiết chương trình */}
          <div className="md:w-1/3 mt-6 md:mt-0">
            {/* Chi tiết chương trình */}
            <div className="bg-white p-6 rounded-md shadow-sm">
              <h3 className="text-lg font-bold mb-4">Chi tiết chương trình</h3>
              
              {/* Vị trí */}
              <div className="mb-4">
                <h4 className="text-sm text-gray-500 mb-1">Vị trí</h4>
                <p>{campaign.location}</p>
              </div>
              
              {/* Phiên họp */}
              <div className="mb-4">
                <h4 className="text-sm text-gray-500 mb-1">Phiên họp</h4>
                <div className="flex justify-between mb-1">
                  <p>Tổng số phiên</p>
                  <p className="font-medium">{campaign.totalSessions}</p>
                </div>
                <div className="flex justify-between mb-1">
                  <p>Hoàn thành</p>
                  <p className="font-medium">{campaign.completedSessions || 0}</p>
                </div>
                <div className="flex justify-between">
                  <p>Còn lại</p>
                  <p className="font-medium">{campaign.remainingSessions || (campaign.totalSessions - (campaign.completedSessions || 0))}</p>
                </div>
              </div>
              
              {/* Phiên tiếp theo - chỉ hiển thị cho chương trình đang tiến hành */}
              {campaign.status === "Đang tiến hành" && campaign.nextSession && (
                <div className="mb-6">
                  <h4 className="text-sm text-gray-500 mb-1">Phiên tiếp theo</h4>
                  <p className="font-medium">{campaign.nextSession.title}</p>
                  <p className="text-sm text-gray-600">{campaign.nextSession.date} - {campaign.nextSession.duration}</p>
                </div>
              )}
              
              {/* Button dựa trên trạng thái */}
              <button className={`w-full ${
                campaign.status === "Đang tiến hành" 
                  ? "bg-black" 
                  : campaign.status === "Hoàn thành" 
                    ? "bg-green-600" 
                    : "bg-blue-600"
              } text-white rounded-md py-3 font-medium mt-4`}>
                {campaign.status === "Đang tiến hành" 
                  ? "Tiếp tục chương trình" 
                  : campaign.status === "Hoàn thành" 
                    ? "Tải chứng chỉ" 
                    : "Đăng ký ngay"}
                {campaign.status === "Hoàn thành" && <Download className="h-5 w-5 inline ml-2" />}
              </button>
            </div>
            
            {/* Tài nguyên */}
            {campaign.resources && campaign.resources.length > 0 && (
              <div className="bg-white p-6 rounded-md shadow-sm mt-6">
                <h3 className="text-lg font-bold mb-4">Tài nguyên</h3>
                
                <div className="space-y-3">
                  {campaign.resources.map((resource, index) => (
                    <div key={index} className="flex items-center p-3 border border-gray-200 rounded-md">
                      {resource.type === 'document' && <FileText className="h-5 w-5 text-gray-400 mr-3" />}
                      {resource.type === 'audio' && <Download className="h-5 w-5 text-gray-400 mr-3" />}
                      {resource.type === 'forum' && <MessageSquare className="h-5 w-5 text-gray-400 mr-3" />}
                      <span>{resource.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCampaignDetail;