import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api';

const AssessmentResult = () => {
  const { responseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

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
    const fetchResult = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.post(`/UserSurveyResponse/complete/${responseId}`);
        if (res.data && res.data.data) {
          setResult(res.data.data);
        } else {
          setError('Không lấy được kết quả đánh giá.');
        }
      } catch (err) {
        setError('Có lỗi khi lấy kết quả đánh giá.');
      } finally {
        setLoading(false);
      }
    };
    if (responseId) fetchResult();
  }, [responseId]);

  const recommendations = [
    'Tham gia khóa học về nhận thức ma túy',
    'Tham khảo ý kiến chuyên viên tư vấn',
    'Giảm thiểu việc sử dụng chất gây nghiện',
    'Tìm hiểu các kỹ năng từ chối và đối phó với áp lực',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">Kết quả đánh giá ASSIST</h1>
        <p className="text-center text-gray-600 mb-8">
          Dưới đây là kết quả đánh giá nguy cơ sử dụng chất gây nghiện của bạn.
        </p>
        {loading ? (
          <div className="text-center text-gray-500">Đang tải kết quả...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : result ? (
          <>
            {/* Mức độ nguy cơ */}
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-x-3">
                <span>Mức độ nguy cơ:</span>
                {result.riskLevel && renderRiskBadge(result.riskLevel)}
              </h2>
              <div className="text-gray-500 text-sm">
                Bạn có nguy cơ {result.riskLevel?.toLowerCase()} liên quan đến việc sử dụng chất gây nghiện.
              </div>
            </div>
            {/* Điểm số */}
            <div className="bg-white rounded-xl shadow p-5 mb-8">
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
            <div className="bg-white rounded-xl shadow p-5 mb-8">
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
            <div className="text-gray-400 text-sm text-center mb-8">
              Lưu ý: Kết quả này chỉ mang tính chất tham khảo và không thay thế cho chẩn đoán chuyên nghiệp. Nếu bạn lo lắng về việc sử dụng chất gây nghiện, vui lòng tham khảo ý kiến của chuyên viên tư vấn.
            </div>
          </>
        ) : null}
        <div className="flex justify-center gap-4">
          <Link to="/assessments"
            className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Quay lại các bài đánh giá
          </Link>
          <Link to="/home"
            className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResult;
