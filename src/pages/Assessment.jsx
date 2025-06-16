import React from 'react';
import { Clock, Users, Brain, Shield } from 'lucide-react';

const Assessment = () => {
  const assessments = [
    {
      title: "Bài đánh giá ASSIST",
      subtitle: "Công cụ sàng lọc sử dụng chất gây nghiện được phát triển bởi WHO",
      description: "ASSIST (Alcohol, Smoking and Substance Involvement Screening Test) là công cụ sàng lọc được phát triển bởi Tổ chức Y tế Thế giới (WHO) để đánh giá mức độ nguy cơ liên quan đến việc sử dụng các chất gây nghiện, bao gồm rượu, thuốc lá và các loại ma túy khác.",
      duration: "5-10 phút",
      target: "Người trưởng thành",
      icon: Brain,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Bài đánh giá CRAFFT",
      subtitle: "Công cụ sàng lọc dành cho thanh thiếu niên",
      description: "CRAFFT là công cụ sàng lọc ngắn gọn được thiết kế đặc biệt cho thanh thiếu niên để đánh giá nguy cơ sử dụng chất gây nghiện. Tên viết tắt CRAFFT đại diện cho các từ khóa: Car, Relax, Alone, Forget, Friends, Trouble.",
      duration: "2-3 phút",
      target: "Thanh thiếu niên",
      icon: Users,
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Bài đánh giá DAST-10",
      subtitle: "Công cụ sàng lọc lạm dụng ma túy",
      description: "DAST-10 (Drug Abuse Screening Test) là phiên bản rút gọn của công cụ sàng lọc lạm dụng ma túy, giúp xác định mức độ nguy cơ liên quan đến việc sử dụng ma túy trong 12 tháng qua.",
      duration: "3-5 phút",
      target: "Người trưởng thành",
      icon: Shield,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Bài đánh giá AUDIT",
      subtitle: "Công cụ sàng lọc rối loạn sử dụng rượu",
      description: "AUDIT (Alcohol Use Disorders Identification Test) là công cụ sàng lọc được phát triển bởi WHO để xác định những người có mẫu uống rượu nguy hiểm hoặc có hại.",
      duration: "2-4 phút",
      target: "Người trưởng thành",
      icon: Clock,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
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
          {assessments.map((assessment, index) => {
            const IconComponent = assessment.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className={`${assessment.bgColor} p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {assessment.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {assessment.subtitle}
                      </p>
                    </div>
                    <div className={`${assessment.iconColor} ml-4`}>
                      <IconComponent size={32} />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{assessment.duration}</span>
                    <span>•</span>
                    <span>Đối tượng: {assessment.target}</span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {assessment.description}
                  </p>
                  
                  <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200">
                    Làm bài đánh giá
                  </button>
                </div>
              </div>
            );
          })}
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
          <button className="bg-gray-900 text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200">
            Đặt lịch tư vấn
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;