import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api';
import { ArrowLeft } from 'lucide-react';

const MyAssessmentResult = () => {
  const { responseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState([]);

  const renderRiskBadge = (risk) => {
    let colorClass = '';
    if (risk === 'Nguy cơ cao' || risk === 'High Risk') {
      colorClass = 'bg-red-100 text-red-800';
    } else if (risk === 'Nguy cơ trung bình' || risk === 'Moderate Risk') {
      colorClass = 'bg-orange-100 text-orange-800';
    } else if (risk === 'Nguy cơ thấp' || risk === 'Low Risk') {
      colorClass = 'bg-green-100 text-green-800';
    } else {
      colorClass = 'bg-gray-100 text-gray-800';
    }
    return (
      <span className={`px-3 py-1 rounded-lg text-xl font-medium ${colorClass}`}>
        {risk}
      </span>
    );
  };

  useEffect(() => {
    const fetchResultAndAnswers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch main result
        const resultRes = await api.get(`/UserSurveyResponse/${responseId}/result`);
        if (resultRes.data && resultRes.data.data) {
          setResult(resultRes.data.data);
        } else {
          setError('Không lấy được kết quả đánh giá.');
          setLoading(false);
          return;
        }

        // Fetch question answers
        const qaRes = await api.get(`/UserSurveyResponse/${responseId}/question-answers`);
        if (qaRes.data && qaRes.data.data) {
          setQuestionAnswers(qaRes.data.data);
        } else {
          console.warn('Không lấy được chi tiết câu trả lời.');
        }
      } catch (err) {
        setError('Có lỗi khi lấy dữ liệu đánh giá.');
      } finally {
        setLoading(false);
      }
    };
    if (responseId) fetchResultAndAnswers();
  }, [responseId]);

  const recommendations = [
    'Tham gia khóa học về nhận thức ma túy',
    'Tham khảo ý kiến chuyên viên tư vấn',
    'Giảm thiểu việc sử dụng chất gây nghiện',
    'Tìm hiểu các kỹ năng từ chối và đối phó với áp lực',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <span>Đánh giá của tôi</span>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Kết quả đánh giá</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kết quả đánh giá ASSIST</h1>
            <p className="text-gray-600 mt-1">
              Dưới đây là kết quả đánh giá nguy cơ sử dụng chất gây nghiện của bạn.
            </p>
          </div>
          <Link to="/myassessment" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center text-gray-500">Đang tải kết quả...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : result ? (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Mức độ nguy cơ */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-x-3">
                    <span>Mức độ nguy cơ:</span>
                    {result.riskLevel && renderRiskBadge(result.riskLevel)}
                  </h2>
                  <div className="text-gray-500 text-sm">
                    Bạn có nguy cơ {result.riskLevel?.toLowerCase()} liên quan đến việc sử dụng chất gây nghiện.
                  </div>
                </div>

                {/* Điểm số */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-2xl font-bold mb-2">Điểm số của bạn: <span className="text-teal-600">{result.totalScore}</span></h2>
                  <div className="text-gray-500 mb-2 text-sm">Dựa trên câu trả lời của bạn trong bài đánh giá ASSIST</div>
                  <div className="text-gray-700 mb-2">
                    Điểm số này phản ánh mức độ nguy cơ liên quan đến việc sử dụng chất gây nghiện của bạn. Điểm số càng cao, nguy cơ càng lớn.
                  </div>
                  <div className="text-gray-700">
                    <div className="font-semibold mb-1">Thang điểm đánh giá:</div>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>0-3: Nguy cơ thấp</li>
                      <li>4-26: Nguy cơ trung bình</li>
                      <li>27+: Nguy cơ cao</li>
                    </ul>
                  </div>
                </div>

                {/* Khuyến nghị */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-2xl font-bold mb-2">Khuyến nghị</h2>
                  <div className="text-gray-500 mb-2 text-sm">Dựa trên kết quả đánh giá, chúng tôi đề xuất những hành động sau</div>
                  <ul className="space-y-2 mb-4">
                    {recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-800">
                        <span className="text-green-600"><i className="fa-solid fa-circle-check"></i></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-4">
                    <Link to="/courses"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                      Xem khóa học
                    </Link>
                    <Link to="/booking"
                      className="bg-black text-white font-medium py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Đặt lịch tư vấn
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Chi tiết câu trả lời */}
                {questionAnswers.length > 0 && (
                  <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Chi tiết câu trả lời</h2>
                    <div className="space-y-6">
                      {questionAnswers.map((item, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                          <p className="text-gray-600 mb-2">
                            <span className="font-semibold">Câu {index + 1}:</span> {item.questionText}
                          </p>
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div>
                              <span className="text-blue-600 font-medium mr-2">Trả lời:</span>
                              <span className="text-gray-800">{item.chosenAnswerText}</span>
                            </div>
                            <span className="font-semibold text-gray-700">Điểm: {item.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-gray-400 text-sm text-center mt-8">
              Lưu ý: Kết quả này chỉ mang tính chất tham khảo và không thay thế cho chẩn đoán chuyên nghiệp. Nếu bạn lo lắng về việc sử dụng chất gây nghiện, vui lòng tham khảo ý kiến của chuyên viên tư vấn.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MyAssessmentResult;
