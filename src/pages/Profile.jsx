import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Award, Clock, Briefcase, Edit, Lock, ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
            <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân của bạn</p>
          </div>
          <Link to="/home" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Về trang chủ
            </Link>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Sửa hồ sơ
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Đổi mật khẩu
            </button>
          </div>

          {/* Thông tin cơ bản */}
          <div className="bg-white rounded-xl shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Thông tin cơ bản
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Họ và tên
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">Dr. Trần Thị Mai</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">tranthimai@example.com</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Số điện thoại
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">0987654321</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Ngày sinh
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">20/08/1988</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin chuyên viên */}
          <div className="bg-white rounded-xl shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                Thông tin chuyên viên
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-500" />
                    Chứng chỉ
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900 leading-relaxed">
                      Thạc sĩ Tâm lý học, Chứng chỉ Tư vấn nghiện chất gây nghiện, 
                      Chứng chỉ Liệu pháp hành vi nhận thức
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      Lịch làm việc
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">Thứ 2-6: 8:00-17:00</p>
                      <p className="text-gray-900">Thứ 7: 8:00-12:00</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      Chuyên môn
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">Tư vấn cá nhân</p>
                      <p className="text-gray-900">Liệu pháp nhóm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons mobile view */}
          <div className="md:hidden flex flex-col gap-3">
            <button className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Edit className="w-4 h-4" />
              Sửa hồ sơ
            </button>
            <button className="bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;