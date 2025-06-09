import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Printer, Calendar, Clock, User, Award, Building } from 'lucide-react';

const CertificateDetail = () => {
  const certificateData = {
    id: "CERT-2023-12345",
    title: "Chứng chỉ hoàn thành",
    courseName: "Hiểu biết về tác hại của ma túy",
    studentName: "Nguyễn Văn Nam",
    completionDate: "15/05/2023",
    duration: "8 tuần",
    instructor: "TS. Nguyễn Văn A",
    organization: "Trung tâm Phòng chống Ma túy Quốc gia",
    description: "Chúc mừng bạn đã hoàn thành khóa học \"Hiểu biết về tác hại của ma túy\""
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <span>Khóa học</span>
          <span>/</span>
          <span>Hiểu biết về tác hại của ma túy</span>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Chứng chỉ</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{certificateData.title}</h1>
            <p className="text-gray-600 mt-1">{certificateData.description}</p>
          </div>
          <Link to="/mycourses" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại khóa học</span>
          </Link>
        </div>
      </div>

      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Certificate Image - Left Side */}
            <div className="lg:w-1/2 p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="relative">
                <div className="bg-white rounded-lg shadow-lg p-8 border-4 border-yellow-400">
                  {/* Certificate Header */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">CHỨNG NHẬN</h2>
                    <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
                  </div>

                  {/* Certificate Body */}
                  <div className="text-center space-y-4">
                    <p className="text-gray-600">Chứng nhận rằng</p>
                    <h3 className="text-3xl font-bold text-blue-900">{certificateData.studentName}</h3>
                    <p className="text-gray-600">đã hoàn thành xuất sắc khóa học</p>
                    <h4 className="text-xl font-semibold text-gray-900 px-4 py-2 bg-gray-50 rounded">
                      {certificateData.courseName}
                    </h4>
                    
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 text-sm">
                      <div className="text-left">
                        <p className="text-gray-600">Ngày hoàn thành</p>
                        <p className="font-semibold">{certificateData.completionDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">ID Chứng chỉ</p>
                        <p className="font-semibold">{certificateData.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-yellow-400"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-yellow-400"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-yellow-400"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-yellow-400"></div>
                </div>
              </div>
            </div>

            {/* Certificate Information - Right Side */}
            <div className="lg:w-1/2 p-8">
              <div className="space-y-6">
                {/* Certificate Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chứng chỉ</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Học viên</p>
                        <p className="font-medium text-gray-900">{certificateData.studentName}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Ngày hoàn thành</p>
                        <p className="font-medium text-gray-900">{certificateData.completionDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Khóa học</p>
                        <p className="font-medium text-gray-900">{certificateData.courseName}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Thời lượng</p>
                        <p className="font-medium text-gray-900">{certificateData.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Giảng viên</p>
                        <p className="font-medium text-gray-900">{certificateData.instructor}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Tổ chức cấp chứng chỉ</p>
                        <p className="font-medium text-gray-900">{certificateData.organization}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certificate ID */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">ID Chứng chỉ</p>
                      <p className="font-mono text-lg font-semibold text-gray-900">{certificateData.id}</p>
                    </div>
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                      <Award className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                    <Printer className="w-5 h-5" />
                    <span>In chứng chỉ</span>
                  </button>

                  <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-5 h-5" />
                    <span>Tải xuống PDF</span>
                  </button>

                  <button className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Chia sẻ</span>
                  </button>
                </div>

                {/* Additional Info */}
                {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm font-bold">i</span>
                    </div>
                    <div>
                      <p className="text-sm text-blue-800">
                        <strong>Lưu ý:</strong> Chứng chỉ này có giá trị chính thức và được công nhận bởi Trung tâm Phòng chống Ma túy Quốc gia. 
                        Bạn có thể sử dụng mã ID để xác thực tính hợp lệ của chứng chỉ.
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            Quay lại khóa học
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetail;