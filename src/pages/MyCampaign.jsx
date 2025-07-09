import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Lightbulb, X, Download, Award, CheckCircle, Users, Plus, MapPin, User } from 'lucide-react';
import api from '../api/api';

const SurveyModal = ({ open, onClose, survey, answers, setAnswers, onSubmit }) => {
  if (!open || !survey) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative max-h-screen overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"><X className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold mb-2">{survey.title}</h2>
        <p className="mb-4 text-gray-600">{survey.description}</p>
        <form onSubmit={onSubmit} className="space-y-4">
          {survey.questions.map((q) => (
            <div key={q.questionId}>
              <label className="font-medium block mb-1">{q.questionText}</label>
              {q.questionType === 'text' ? (
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={answers[q.questionId] || ''}
                  onChange={e => setAnswers(a => ({ ...a, [q.questionId]: e.target.value }))}
                />
              ) : (
                <div className="space-y-1">
                  {q.answerOptions.map(opt => (
                    <label key={opt.optionId} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={q.questionId}
                        value={opt.optionId}
                        checked={answers[q.questionId] === opt.optionId}
                        onChange={e => setAnswers(a => ({ ...a, [q.questionId]: opt.optionId }))}
                      />
                      <span>{opt.optionText}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button type="submit" className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Gửi khảo sát</button>
        </form>
      </div>
    </div>
  );
};

const MyCampaign = () => {
  const [activeTab, setActiveTab] = useState('registered'); // 'registered', 'completed'
  const [enrolledCampaigns, setEnrolledCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [surveyData, setSurveyData] = useState(null);
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [surveyProgramId, setSurveyProgramId] = useState(null);
  const [surveyStatus, setSurveyStatus] = useState({}); // { [programId]: true/false }

  // Fetch enrolled campaigns from API
  useEffect(() => {
    const fetchEnrolledCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user ID from localStorage
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
          setError('Không tìm thấy thông tin người dùng');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userInfo);
        const userId = user.userId;

        if (!userId) {
          setError('Không tìm thấy ID người dùng');
          setLoading(false);
          return;
        }

        // Call API to get enrolled campaigns
        const response = await api.get(`/CommunityProgram/user/${userId}/enrolled`);
        
        if (Array.isArray(response.data)) {
          setEnrolledCampaigns(response.data);
        } else {
          setEnrolledCampaigns([]);
        }
      } catch (err) {
        console.error('Error fetching enrolled campaigns:', err);
        setError('Lỗi kết nối đến server');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCampaigns();
  }, []);

  // Helper functions for date formatting
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const isCampaignCompleted = (campaign) => {
    const endDate = new Date(campaign.endDate);
    const now = new Date();
    return endDate < now;
  };

  const isCampaignUpcoming = (campaign) => {
    const startDate = new Date(campaign.startDate);
    const now = new Date();
    return startDate > now;
  };

  // Filter campaigns based on status
  const registeredCampaigns = enrolledCampaigns.filter(campaign => 
    !isCampaignCompleted(campaign) && !isCampaignUpcoming(campaign)
  );

  const completedCampaigns = enrolledCampaigns.filter(campaign => 
    isCampaignCompleted(campaign)
  );

  const upcomingCampaigns = enrolledCampaigns.filter(campaign => 
    isCampaignUpcoming(campaign)
  );

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
    let bgColor = "bg-gray-100 text-gray-600";
    
    if (status === "Hoàn thành") {
      bgColor = "bg-green-100 text-green-600";
    } else if (status === "Đang tiến hành") {
      bgColor = "bg-yellow-100 text-yellow-800";
    } else if (status === "Sắp diễn ra") {
      bgColor = "bg-blue-100 text-blue-800";
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold ${bgColor} rounded-full`}>
        {status}
      </span>
    );
  };

  // Hàm mở modal và lấy khảo sát
  const handleOpenSurvey = async (programId) => {
    setSurveyProgramId(programId);
    setSurveyLoading(true);
    setSurveyModalOpen(true);
    setSurveyData(null);
    setSurveyAnswers({});
    try {
      const res = await api.get(`/CommunityProgram/${programId}/survey`);
      setSurveyData(res.data);
    } catch (e) {
      setSurveyData({ title: 'Lỗi', description: 'Không lấy được khảo sát', questions: [] });
    } finally {
      setSurveyLoading(false);
    }
  };

  // Hàm submit khảo sát (gửi lên server)
  const handleSubmitSurvey = async (e) => {
    e.preventDefault();
    if (!surveyData || !surveyProgramId) return;
    // Lấy userId từ localStorage
    const userInfo = localStorage.getItem('userInfo');
    let userId = '';
    if (userInfo) {
      try {
        userId = JSON.parse(userInfo).userId;
      } catch {}
    }
    if (!userId) {
      alert('Không tìm thấy thông tin người dùng.');
      return;
    }
    // Chuẩn bị body gửi đi
    const answers = surveyData.questions.map(q => {
      if (q.questionType === 'text') {
        return {
          questionId: q.questionId,
          answerText: surveyAnswers[q.questionId] || '',
          selectedOptionId: null
        };
      } else {
        return {
          questionId: q.questionId,
          answerText: null,
          selectedOptionId: surveyAnswers[q.questionId] || null
        };
      }
    });
    try {
      await api.post(`/CommunityProgram/${surveyProgramId}/submit-survey?userId=${userId}`, { answers });
      alert('Gửi khảo sát thành công!');
      setSurveyModalOpen(false);
    } catch (err) {
      alert('Gửi khảo sát thất bại!');
    }
  };

  // Hàm kiểm tra trạng thái khảo sát cho từng campaign đã hoàn thành
  const checkSurveyStatus = async (programId, userId) => {
    try {
      const res = await api.get(`/CommunityProgram/${programId}/survey/completion-status?userId=${userId}`);
      setSurveyStatus(prev => ({ ...prev, [programId]: res.data.hasSubmitted }));
    } catch {
      setSurveyStatus(prev => ({ ...prev, [programId]: false }));
    }
  };

  // Khi danh sách completedCampaigns thay đổi, kiểm tra trạng thái khảo sát
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    let userId = '';
    if (userInfo) {
      try {
        userId = JSON.parse(userInfo).userId;
      } catch {}
    }
    if (!userId) return;
    completedCampaigns.forEach(campaign => {
      if (campaign.programId && surveyStatus[campaign.programId] === undefined) {
        checkSurveyStatus(campaign.programId, userId);
      }
    });
    // eslint-disable-next-line
  }, [completedCampaigns]);

  // Render chương trình đã hoàn thành
  const renderCompletedCampaign = (campaign) => (
    <div key={campaign.programId} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="relative">
        {/* Badge trạng thái */}
        <div className="absolute top-3 right-3">
          <StatusBadge status="Hoàn thành" />
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 max-w-[80%] whitespace-normal break-words">{campaign.title}</h3>
        <p className="text-gray-600 text-md mb-4">{campaign.description}</p>
        
        <div className="flex items-center mb-4 gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Hoàn thành:</p>
            <p className="text-sm">{formatDate(campaign.endDate)} {formatTime(campaign.endDate)}</p>
          </div>
        </div>

        <div className="flex items-center mb-4 gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Địa điểm:</p>
            <p className="text-sm">{campaign.location}</p>
          </div>
        </div>

        <div className="flex items-center mb-4 gap-2">
          <Users className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Tham gia:</p>
            <p className="text-sm">{campaign.currentParticipantsCount} / {campaign.maxParticipants} người</p>
          </div>
        </div>

        <div className="flex justify-between mt-5">
          <Link 
            to={`/campaigns/${campaign.programId}`} 
            className="px-4 py-3 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-md font-medium"
          >
            Xem chi tiết
          </Link>
          {surveyStatus[campaign.programId] ? (
            <button
              className="px-4 py-3 bg-gray-300 text-gray-500 rounded-md text-md font-medium flex items-center cursor-not-allowed"
              disabled
            >
              <Lightbulb className="w-4 h-4 mr-1" /> Đã làm khảo sát
            </button>
          ) : (
            <button
              className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 text-md font-medium flex items-center"
              onClick={() => handleOpenSurvey(campaign.programId)}
            >
              <Lightbulb className="w-4 h-4 mr-1" /> Làm khảo sát ý kiến
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render chương trình đang diễn ra
  const renderRegisteredCampaign = (campaign) => (
    <div key={campaign.programId} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="relative">
        {/* Badge trạng thái */}
        <div className="absolute top-3 right-3">
          <StatusBadge status="Đang tiến hành" />
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
        <p className="text-gray-600 text-md mb-4">{campaign.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Bắt đầu:</p>
              <p className="text-sm">{formatDate(campaign.startDate)} {formatTime(campaign.startDate)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Kết thúc:</p>
              <p className="text-sm">{formatDate(campaign.endDate)} {formatTime(campaign.endDate)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Địa điểm:</p>
              <p className="text-sm">{campaign.location}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Tham gia:</p>
              <p className="text-sm">{campaign.currentParticipantsCount} / {campaign.maxParticipants} người</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-5">
          <Link 
            to={`/campaigns/${campaign.programId}`} 
            className="px-4 py-3 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-md font-medium"
          >
            Xem chi tiết
          </Link>
          <button className="px-4 py-3 border border-gray-200 bg-yellow-200 text-yellow-800 rounded-md text-md font-medium">
            Đang diễn ra
          </button>
        </div>
      </div>
    </div>
  );

  // Render chương trình sắp diễn ra
  const renderUpcomingCampaign = (campaign) => (
    <div key={campaign.programId} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="relative">
        {/* Badge trạng thái */}
        <div className="absolute top-3 right-3">
          <StatusBadge status="Sắp diễn ra" />
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
        <p className="text-gray-600 text-md mb-4">{campaign.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Bắt đầu:</p>
              <p className="text-sm">{formatDate(campaign.startDate)} {formatTime(campaign.startDate)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Kết thúc:</p>
              <p className="text-sm">{formatDate(campaign.endDate)} {formatTime(campaign.endDate)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Địa điểm:</p>
              <p className="text-sm">{campaign.location}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Tham gia:</p>
              <p className="text-sm">{campaign.currentParticipantsCount} / {campaign.maxParticipants} người</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-5">
          <Link 
            to={`/campaigns/${campaign.programId}`} 
            className="px-4 py-3 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-md font-medium"
          >
            Xem chi tiết
          </Link>
          <button className="px-4 py-3 border border-gray-200 bg-blue-200 text-blue-800 rounded-md text-md font-medium">
            Chờ bắt đầu
          </button>
        </div>
      </div>
    </div>
  );

  // Hàm để hiển thị nội dung dựa trên tab đang chọn
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'registered':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {registeredCampaigns.map(campaign => renderRegisteredCampaign(campaign))}
            {upcomingCampaigns.map(campaign => renderUpcomingCampaign(campaign))}
            {registeredCampaigns.length === 0 && upcomingCampaigns.length === 0 && (
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
                { id: 'registered', label: 'Chưa hoàn thành', count: registeredCampaigns.length + upcomingCampaigns.length },
                { id: 'completed', label: 'Đã hoàn thành', count: completedCampaigns.length },
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
      {/* Modal khảo sát */}
      <SurveyModal
        open={surveyModalOpen}
        onClose={() => setSurveyModalOpen(false)}
        survey={surveyData}
        answers={surveyAnswers}
        setAnswers={setSurveyAnswers}
        onSubmit={handleSubmitSurvey}
      />
    </div>
  );
};

export default MyCampaign;