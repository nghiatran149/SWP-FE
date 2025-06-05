import React from 'react';
import { Shield, ArrowRight, Book, Calendar, Users, ShieldCheck, GraduationCap, Heart, CheckCircle, BarChart2 } from 'lucide-react';

import FeaturedCourses from '../components/FeaturedCourses';

const stats = [
  { value: "500+", label: "Người đã được hỗ trợ" },
  { value: "20+", label: "Chuyên viên tư vấn" },
  { value: "30+", label: "Khóa học trực tuyến" },
  { value: "15+", label: "Chương trình cộng đồng" },
];

const features = [
  {
    icon: GraduationCap,
    title: "Phương pháp khoa học",
    description: "Các chương trình và đánh giá dựa trên nghiên cứu khoa học và thực tiễn",
    color: "bg-teal-100 text-teal-600"
  },
  {
    icon: Users,
    title: "Đội ngũ chuyên nghiệp",
    description: "Chuyên viên tư vấn có trình độ chuyên môn cao và giàu kinh nghiệm",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: ShieldCheck,
    title: "Giáo dục toàn diện",
    description: "Khóa học đa dạng phù hợp với nhiều đối tượng và nhu cầu khác nhau",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: Heart,
    title: "Hỗ trợ liên tục",
    description: "Luôn sẵn sàng hỗ trợ 24/7 qua nhiều kênh khác nhau",
    color: "bg-orange-100 text-orange-600"
  }
];

const assessments = [
  {
    title: "Bài đánh giá ASSIST",
    desc: "Công cụ sàng lọc sử dụng chất gây nghiện được phát triển bởi WHO",
  },
  {
    title: "Bài đánh giá CRAFFT",
    desc: "Công cụ sàng lọc dành cho thanh thiếu niên",
  },
  {
    title: "Bài đánh giá DAST",
    desc: "Công cụ đánh giá mức độ lạm dụng ma túy",
  },
  {
    title: "Bài đánh giá AUDIT",
    desc: "Công cụ đánh giá mức độ sử dụng rượu",
  },
];

const Homepage = () => {
  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-blue-600 to-blue-800"></div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 border border-white rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">

          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-10 h-10 text-teal-300" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Bảo vệ tương lai{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
              không ma túy
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed">
            Chúng tôi cung cấp các công cụ, khóa học và hỗ trợ để giúp cộng đồng
            phòng ngừa sử dụng ma túy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="bg-teal-600 hover:bg-teal-700 text-white border-none h-12 px-8 text-base font-semibold flex items-center justify-center gap-2 rounded-md transition-colors duration-200">
              Đánh giá nguy cơ
              <ArrowRight className="w-4 h-4" />
            </button>

            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent h-12 px-8 text-base font-semibold flex items-center justify-center gap-2 rounded-md transition-all duration-200">
              <Book className="w-4 h-4" />
              Khám phá khóa học
            </button>

            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent h-12 px-8 text-base font-semibold flex items-center justify-center gap-2 rounded-md transition-all duration-200">
              <Calendar className="w-4 h-4" />
              Đặt lịch tư vấn
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-blue-500 bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 rounded-lg p-6"
              >
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-teal-300 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-200 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '1000ms' }}></div>
        <div className="absolute top-2/3 left-1/6 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '500ms' }}></div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Chúng tôi cung cấp giải pháp toàn diện để hỗ trợ cộng đồng trong việc phòng ngừa sử dụng ma túy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">

                <div className="flex justify-center mb-6">
                  <div className={`w-20 h-20 rounded-full ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-10 h-10" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <FeaturedCourses />

      {/* Risk Assessment Section */}
      <section className="py-12 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Đánh giá nguy cơ
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Các công cụ đánh giá được phát triển bởi các tổ chức y tế uy tín giúp xác định mức độ nguy cơ và đưa ra khuyến nghị phù hợp.
              </p>
              
              <div className="space-y-4 mb-8">
                {assessments.map((assessment, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {assessment.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {assessment.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 group">
                Làm bài đánh giá
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            <div className="relative">

              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Biểu đồ đánh giá nguy cơ</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 inline-block">
                <div className="flex items-center gap-4">
                  <div className="bg-cyan-100 p-3 rounded-lg">
                    <BarChart2 className="h-8 w-8 text-cyan-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-cyan-600">5,000+</div>
                    <div className="text-gray-600 text-sm">Bài đánh giá đã thực hiện</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Booking Section */}
      <section className="py-12 rounded-2xl mx-6 my-6 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 relative overflow-hidden">

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-40 h-40 border border-white rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute top-1/2 right-10 w-20 h-20 border border-white rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Đặt lịch tư vấn
              </h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Đội ngũ chuyên viên tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn và người thân. Đặt lịch hẹn trực tuyến ngay hôm nay.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-700 bg-opacity-50 backdrop-blur-sm border border-blue-400 border-opacity-30 rounded-lg p-6 hover:bg-opacity-70 transition-all duration-300">
                  <Users className="h-8 w-8 text-teal-300 mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">Tư vấn cá nhân</h3>
                  <p className="text-blue-200 text-sm">Tư vấn riêng tư với chuyên viên</p>
                </div>

                <div className="bg-blue-700 bg-opacity-50 backdrop-blur-sm border border-blue-400 border-opacity-30 rounded-lg p-6 hover:bg-opacity-70 transition-all duration-300">
                  <Calendar className="h-8 w-8 text-teal-300 mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">Linh hoạt thời gian</h3>
                  <p className="text-blue-200 text-sm">Chọn thời gian phù hợp với bạn</p>
                </div>

                <div className="bg-blue-700 bg-opacity-50 backdrop-blur-sm border border-blue-400 border-opacity-30 rounded-lg p-6 hover:bg-opacity-70 transition-all duration-300">
                  <ShieldCheck className="h-8 w-8 text-teal-300 mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">Chuyên viên giàu kinh nghiệm</h3>
                  <p className="text-blue-200 text-sm">Đội ngũ chuyên môn cao</p>
                </div>

                <div className="bg-blue-700 bg-opacity-50 backdrop-blur-sm border border-blue-400 border-opacity-30 rounded-lg p-6 hover:bg-opacity-70 transition-all duration-300">
                  <Book className="h-8 w-8 text-teal-300 mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">Tài liệu hỗ trợ</h3>
                  <p className="text-blue-200 text-sm">Nhận tài liệu hướng dẫn</p>
                </div>
              </div>

              <button className="bg-white text-blue-900 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 group">
                Đặt lịch ngay
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            <div className="relative">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
                <div className="w-full h-80 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center relative overflow-hidden">

                  <div className="text-center">
                    <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <Users className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-xl mb-2">Tư vấn</h3>
                    <p className="text-blue-100">Hỗ trợ chuyên nghiệp</p>
                  </div>
                  
                  <div className="absolute top-4 left-4 w-3 h-3 bg-white bg-opacity-40 rounded-full"></div>
                  <div className="absolute bottom-6 right-6 w-2 h-2 bg-white bg-opacity-60 rounded-full"></div>
                  <div className="absolute top-1/3 right-4 w-4 h-4 bg-white bg-opacity-30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;