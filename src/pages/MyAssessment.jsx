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
        scheduledDate: '11/20/2023',
        description: 'Follow-up assessment for alcohol use'
      },
    ],
    history: [
      {
        id: 2,
        type: 'ASSIST',
        date: '10/15/2023',
        score: 18,
        risk: 'Moderate Risk',
        substances: ['Alcohol', 'Cannabis'],
        recommendation: 'Consider brief intervention and monitoring'
      },
      {
        id: 3,
        type: 'CRAFFT',
        date: '9/1/2023',
        score: 3,
        risk: 'High Risk',
        substances: ['Alcohol'],
        recommendation: 'Referral to specialized assessment recommended'
      },
      {
        id: 4,
        type: 'DAST',
        date: '8/10/2023',
        score: 4,
        risk: 'Moderate Risk',
        substances: ['Stimulants'],
        recommendation: 'Brief intervention advised'
      }
    ]
  };
  
  // Function to render assessment trend chart placeholder
  const renderTrendChart = () => {
    return (
      <div className="flex items-center justify-center h-60 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">Assessment trend chart will appear here</p>
      </div>
    );
  };
  
  // Function to render risk badge
  const renderRiskBadge = (risk) => {
    let colorClass = '';
    
    if (risk === 'High Risk') {
      colorClass = 'bg-red-500 text-white';
    } else if (risk === 'Moderate Risk') {
      colorClass = 'bg-orange-400 text-white';
    } else if (risk === 'Low Risk') {
      colorClass = 'bg-green-500 text-white';
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
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
            <h3 className="text-lg font-bold">{assessment.type} Assessment</h3>
            <p className="text-sm text-gray-500">Taken on {assessment.date}</p>
          </div>
          {assessment.risk && renderRiskBadge(assessment.risk)}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Score</p>
            <p className="text-2xl font-bold">{assessment.score}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Substances</p>
            <div className="flex flex-wrap mt-1">
              {assessment.substances.map(substance => renderSubstancePill(substance))}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500">Recommendations</p>
          <p className="text-gray-800">{assessment.recommendation}</p>
        </div>
        
        <div className="flex justify-between mt-4">
          <button className="flex items-center text-blue-600 hover:text-blue-800">
            <FileText className="h-4 w-4 mr-1" /> View Detailed Results
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
            Retake <ArrowRight className="h-4 w-4 ml-1" />
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
          <h3 className="text-lg font-bold">{assessment.type} Assessment</h3>
          <p className="text-sm text-gray-500">Scheduled for {assessment.scheduledDate}</p>
        </div>
        
        <p className="text-gray-700 mb-4">{assessment.description}</p>
        
        <div className="flex justify-between mt-4">
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Reschedule
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
            Take Now <ArrowRight className="h-4 w-4 ml-1" />
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
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <div className="flex items-start">
          <TrendingUp  className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium">Assessment Recommendation</h3>
            <p className="text-sm text-gray-600">Based on your previous results, we recommend taking the AUDIT assessment to monitor your progress. Take AUDIT Assessment</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded hover:bg-gray-100">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <Link to="/home" className="text-blue-600 hover:text-blue-800">
            Về trang chủ
          </Link>
        </div>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Assessments</h1>
            <p className="text-gray-600">Track your assessment history and schedule follow-ups</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black">
            Take New Assessment
            <Info className="h-4 w-4 ml-2" />
          </button>
        </div>
        
        {renderRecommendation()}
        
        <div className="mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 text-sm font-medium flex-1 transition-colors ${
                activeTab === 'history' 
                  ? 'bg-white text-gray-800 border-t border-l border-r border-gray-200' 
                  : 'bg-gray-100 text-gray-600 border-b border-gray-200'
              }`}
            >
              Assessment History
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 text-sm font-medium flex-1 transition-colors ${
                activeTab === 'upcoming' 
                  ? 'bg-white text-gray-800 border-t border-l border-r border-gray-200' 
                  : 'bg-gray-100 text-gray-600 border-b border-gray-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-6 py-3 text-sm font-medium flex-1 transition-colors ${
                activeTab === 'insights' 
                  ? 'bg-white text-gray-800 border-t border-l border-r border-gray-200' 
                  : 'bg-gray-100 text-gray-600 border-b border-gray-200'
              }`}
            >
              Insights
            </button>
          </div>
          
          <div className="mt-6">
            {activeTab === 'history' && (
              <div>
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