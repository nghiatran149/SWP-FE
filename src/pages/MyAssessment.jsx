import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

const MyAssessment = () => {
  const [activeTab, setActiveTab] = useState('history');

  // Mock data for assessments
  const assessments = {
    upcoming: [
      {
        id: 1,
        type: 'AUDIT',
        scheduledDate: '20/11/2023',
        description: 'Đánh giá theo dõi việc sử dụng rượu'
      },
    ],
    history: [
      {
        id: 2,
        type: 'ASSIST',
        date: '15/10/2023',
        score: 18,
        risk: 'Nguy cơ trung bình',
        substances: ['Rượu', 'Cần sa'],
        recommendation: 'Xem xét can thiệp ngắn hạn và theo dõi'
      },
      {
        id: 3,
        type: 'CRAFFT',
        date: '01/09/2023',
        score: 3,
        risk: 'Nguy cơ cao',
        substances: ['Rượu'],
        recommendation: 'Khuyến nghị chuyển sang đánh giá chuyên sâu'
      },
      {
        id: 4,
        type: 'DAST',
        date: '10/08/2023',
        score: 4,
        risk: 'Nguy cơ trung bình',
        substances: ['Chất kích thích'],
        recommendation: 'Khuyến nghị can thiệp ngắn hạn'
      }
    ]
  };
  

  // Function to render assessment trend chart placeholder
  const renderTrendChart = () => {
    return (
      <div className="flex items-center justify-center h-60 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">Biểu đồ xu hướng đánh giá sẽ hiển thị ở đây</p>
      </div>
    );
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

  // Function to render substance pill
  const renderSubstancePill = (substance) => {
    return (
      <span key={substance} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full mr-2">
        {substance}
      </span>
    );
  };

  // Function to render assessment history cards
  const renderAssessmentHistoryCard = (assessment) => {
    return (
      <div key={assessment.id} className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold">Bài đánh giá {assessment.type}</h3>
            <p className="text-sm text-gray-500">Làm vào ngày {assessment.date}</p>
          </div>
          {assessment.risk && renderRiskBadge(assessment.risk)}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Điểm</p>
            <p className="text-2xl font-bold">{assessment.score}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Chất sử dụng</p>
            <div className="flex flex-wrap mt-1">
              {assessment.substances.map(substance => renderSubstancePill(substance))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Khuyến nghị</p>
          <p className="text-gray-800">{assessment.recommendation}</p>
        </div>

        <div className="flex justify-between mt-4">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md hover:bg-gray-50 font-medium">
            <FileText className="h-4 w-4 mr-1" /> Xem kết quả chi tiết
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
            Làm lại <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  // Function to render upcoming assessment card
  const renderUpcomingAssessment = (assessment) => {
    return (
      <div key={assessment.id} className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold">Bài đánh giá {assessment.type}</h3>
          <p className="text-sm text-gray-500">Đã lên lịch vào {assessment.scheduledDate}</p>
        </div>

        <p className="text-gray-700 mb-4">{assessment.description}</p>

        <div className="flex justify-between mt-4">
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Lên lịch lại
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Làm ngay <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  // Function to render assessment trends
  const renderAssessmentTrends = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-bold mb-1">Assessment Trends</h3>
        <p className="text-sm text-gray-600 mb-6">Track your progress over time. More data will be available as you complete additional assessments.</p>
        {renderTrendChart()}
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
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              {[
                { id: 'history', label: 'Lịch sử đánh giá', count: assessments.history.length },
                { id: 'upcoming', label: 'Sắp tới', count: assessments.upcoming.length },
                { id: 'insights', label: 'Thống kê', count: null },
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
                  {tab.label}{tab.count !== null ? ` (${tab.count})` : ''}
                </button>
              ))}
            </div>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ml-4">
              Làm bài đánh giá mới
              <Plus className="h-4 w-4 ml-2" />
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'history' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assessments.history.map(assessment => renderAssessmentHistoryCard(assessment))}
              </div>
            )}

            {activeTab === 'upcoming' && (
              <div>
                {assessments.upcoming.length > 0 ? (
                  assessments.upcoming.map(assessment => renderUpcomingAssessment(assessment))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    Không có đánh giá sắp tới nào được lên lịch
                  </div>
                )}
              </div>
            )}

            {activeTab === 'insights' && renderAssessmentTrends()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAssessment;