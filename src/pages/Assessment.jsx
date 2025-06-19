import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Clock, Users, Brain, Shield } from 'lucide-react';

const BASE_URL = 'http://drugpreventionsystem.somee.com/api';

const Assessment = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Survey`);
        const data = response.data;
        if (data && data.data) {
          setSurveys(data.data);
        } else {
          setSurveys([]);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu đánh giá.');
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Đánh giá nguy cơ sử dụng ma túy
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Các bài đánh giá dưới đây giúp xác định mức độ nguy cơ sử dụng ma túy và các chất gây nghiện. Kết quả đánh giá sẽ giúp bạn nhận được khuyến nghị phù hợp.
          </p>
        </div>

        {/* Assessment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-2 text-center text-gray-500">Đang tải...</div>
          ) : error ? (
            <div className="col-span-2 text-center text-red-500">{error}</div>
          ) : (
            surveys.map((survey, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{survey.name}</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">{survey.description}</p>
                  <Link to={`/assessmentdetail/${survey.surveyId}`} className="flex flex-col items-center w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 text-center" style={{display: 'block'}}>
                    Làm bài đánh giá
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Important Notice Section */}
        <div className="mt-16 bg-gray-100 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Lưu ý quan trọng
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto mb-6">
            Các bài đánh giá này chỉ mang tính chất sàng lọc ban đầu và không thay thế cho chẩn đoán chuyên nghiệp. 
            Nếu bạn lo lắng về việc sử dụng chất gây nghiện của bản thân hoặc người thân, vui lòng tham khảo ý kiến 
            của chuyên viên tư vấn hoặc nhân viên y tế.
          </p>
          <Link to="/booking" className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
            Đặt lịch tư vấn
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Assessment;