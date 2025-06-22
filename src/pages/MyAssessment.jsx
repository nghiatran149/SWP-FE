import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  FileText,
  BarChart2,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Info,
  Plus,
  AlertTriangle
} from 'lucide-react';
import api from '../api/api';

const MyAssessment = () => {
  const [surveyResponses, setSurveyResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch survey responses from API
  useEffect(() => {
    const fetchSurveyResponses = async () => {
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

        // Call API to get survey responses
        const response = await api.get(`/UserSurveyResponse/user/${userId}`);
        
        if (response.data.resultStatus === 'Success') {
          setSurveyResponses(response.data.data || []);
        } else {
          setError(response.data.messages?.[0] || 'Không thể tải dữ liệu đánh giá');
        }
      } catch (err) {
        console.error('Error fetching survey responses:', err);
        setError('Lỗi kết nối đến server');
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyResponses();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Function to extract survey type from survey name
  const extractSurveyType = (surveyName) => {
    if (surveyName.includes('ASSIST')) return 'ASSIST';
    if (surveyName.includes('AUDIT')) return 'AUDIT';
    if (surveyName.includes('CRAFFT')) return 'CRAFFT';
    if (surveyName.includes('DAST')) return 'DAST';
    return surveyName.replace('Bài đánh giá ', '');
  };

  // Function to handle retake assessment
  const handleRetakeAssessment = (surveyId) => {
    navigate(`/assessmentdetail/${surveyId}`);
  };

  // Function to render risk badge
  const renderRiskBadge = (risk) => {
    let colorClass = '';
    if (risk === 'Nguy cơ cao' || risk === 'High Risk') {
      colorClass = 'bg-red-500 text-white';
    } else if (risk === 'Nguy cơ trung bình' || risk === 'Moderate Risk') {
      colorClass = 'bg-orange-400 text-white';
    } else if (risk === 'Nguy cơ thấp' || risk === 'Low Risk') {
      colorClass = 'bg-green-500 text-white';
    } else {
      colorClass = 'bg-gray-200 text-gray-800';
    }
    return (
      <span className={`px-5 py-2 rounded-full text-sm font-semibold ${colorClass}`}>
        {risk}
      </span>
    );
  };

  // Function to render recommended action pill
  const renderRecommendedActionPill = (action) => {
    return (
      <span key={action} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mr-2 mb-2">
        {action}
      </span>
    );
  };

  // Function to render assessment history cards
  const renderAssessmentHistoryCard = (assessment) => {
    return (
      <div key={assessment.responseId} className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold">{assessment.surveyName}</h3>
            <p className="text-sm text-gray-500">Làm vào ngày {formatDate(assessment.takenAt)}</p>
          </div>
          {assessment.riskLevel && renderRiskBadge(assessment.riskLevel)}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Điểm</p>
            <p className="text-2xl font-bold">{assessment.totalScore}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Loại đánh giá</p>
            <p className="text-gray-800 font-medium">{extractSurveyType(assessment.surveyName)}</p>
          </div>
        </div>

        {assessment.recommendedActions && assessment.recommendedActions.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Khuyến nghị hành động</p>
            <div className="flex flex-wrap">
              {assessment.recommendedActions.map(action => renderRecommendedActionPill(action))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <Link 
            to={`/my-assessment-result/${assessment.responseId}`}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md hover:bg-gray-50 font-medium"
          >
            <FileText className="h-4 w-4 mr-1" /> Xem kết quả chi tiết
          </Link>
          <button 
            onClick={() => handleRetakeAssessment(assessment.surveyId)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Làm lại <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  // Function to render the recommendation section
  const renderRecommendation = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <TrendingUp className="h-5 w-5 text-blue-600 mr-2 mt-1" />
          <div>
            <h3 className="font-medium">Khuyến nghị đánh giá</h3>
            <p className="text-sm text-gray-600">Dựa trên kết quả trước đó của bạn, chúng tôi khuyến nghị bạn nên làm bài đánh giá AUDIT để theo dõi tiến trình của mình. Làm bài đánh giá AUDIT</p>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu đánh giá...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Các bài đánh giá của tôi</h1>
            <p className="text-gray-600 mt-1">Quản lý và xem kết quả của các bài đánh giá của bạn về phòng chống ma túy.</p>
          </div>
          <Link to="/home" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Về trang chủ
          </Link>
        </div>
      </div>
      <div className="p-8 mx-auto">

        {renderRecommendation()}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Lịch sử đánh giá ({surveyResponses.length})</h2>
            <Link to="/assessments" className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Làm bài đánh giá mới
              <Plus className="h-4 w-4 ml-2" />
            </Link>
          </div>

          <div>
            {surveyResponses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {surveyResponses.map(assessment => renderAssessmentHistoryCard(assessment))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Bạn chưa có bài đánh giá nào</p>
                <Link to="/assessments" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Làm bài đánh giá đầu tiên
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAssessment;