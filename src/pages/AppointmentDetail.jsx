import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Link as LinkIcon,
  FileText,
  Download,
  Edit2,
  Trash2,
  ArrowLeft,
  Info,
  AlertTriangle,
  HelpCircle,
  MessageCircle
} from 'lucide-react';

const AppointmentDetail = () => {
  const [activeTab, setActiveTab] = useState('info');

  // Mock data
  const appointment = {
    date: '20/05/2023',
    time: '10:00 (45 phút)',
    type: 'Trực tuyến',
    link: 'https://meet.google.com/abc-defg-hij',
    note: 'Buổi tư vấn đầu tiên về nhận thức ma túy',
    files: [
      { title: 'Tài liệu chuẩn bị', type: 'PDF', size: '1.2 MB' },
      { title: 'Bảng câu hỏi đánh giá', type: 'PDF', size: '0.8 MB' }
    ],
    expert: {
      name: 'TS. Nguyễn Văn A',
      title: 'Tư vấn phòng chống ma túy',
      experience: '10 năm kinh nghiệm',
      desc: 'TS. Nguyễn Văn A là chuyên gia hàng đầu trong lĩnh vực tư vấn và phòng chống ma túy. Với hơn 10 năm kinh nghiệm, ông đã giúp đỡ hàng trăm người vượt qua các vấn đề liên quan đến ma túy.'
    },
    support: {
      hotline: '1800 1234',
      email: 'support@drugprevention.vn',
      phone: '028 1234 5678'
    },
    preparation: {
      before: [
        'Hoàn thành bảng câu hỏi đánh giá (nếu có)',
        'Chuẩn bị danh sách câu hỏi hoặc vấn đề bạn muốn thảo luận',
        'Đảm bảo bạn có không gian riêng tư và yên tĩnh cho cuộc hẹn',
        'Kiểm tra kết nối internet và thiết bị của bạn',
        'Cài đặt phần mềm họp trực tuyến nếu cần thiết'
      ],
      during: [
        'Chia sẻ thông tin một cách cởi mở và trung thực',
        'Đặt câu hỏi nếu bạn không hiểu điều gì đó',
        'Ghi chú lại những điểm quan trọng'
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <span>Lịch hẹn</span>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Chi tiết cuộc hẹn</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết cuộc hẹn</h1>
            <p className="text-gray-600 mt-1">Xem thông tin chi tiết về cuộc hẹn tư vấn của bạn</p>
          </div>
          <Link to="/myappointment" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại danh sách cuộc hẹn</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Thông tin cuộc hẹn</h2>
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Sắp tới</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5" />
                    <span>Ngày: <span className="font-medium">{appointment.date}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5" />
                    <span>Thời gian: <span className="font-medium">{appointment.time}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Info className="w-5 h-5" />
                    <span>Hình thức: <span className="font-medium">{appointment.type}</span></span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <LinkIcon className="w-5 h-5" />
                    <span>Link cuộc họp:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={appointment.link}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 text-gray-700 text-sm font-mono"
                    />
                    <button className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm">Sao chép</button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Link cuộc họp sẽ hoạt động 10 phút trước giờ hẹn. Vui lòng kiểm tra thiết bị và kết nối internet của bạn trước khi tham gia.
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-800 mb-1">Ghi chú</div>
                <div className="text-gray-700 text-sm">{appointment.note}</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-800 mb-1">Tài liệu</div>
                <div className="flex flex-col gap-2">
                  {appointment.files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-4 py-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <span className="font-medium text-gray-900">{file.title}</span>
                        <span className="text-xs text-gray-500">{file.type} • {file.size}</span>
                      </div>
                      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                        <Download className="w-4 h-4" />
                        <span>Tải xuống</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                  <Edit2 className="w-4 h-4" />
                  Đổi lịch hẹn
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  <Trash2 className="w-4 h-4" />
                  Hủy cuộc hẹn
                </button>
              </div>
            </div>

            {/* Tabs for preparation */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === 'info'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Chuẩn bị cho cuộc hẹn
                  </button>
                </nav>
              </div>
              <div className="p-6">
                {activeTab === 'info' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Những điều bạn nên chuẩn bị trước cuộc hẹn</h3>
                    <div className="mb-4">
                      <div className="font-semibold text-gray-800 mb-2">Trước cuộc hẹn</div>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                        {appointment.preparation.before.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 mb-2">Trong cuộc hẹn</div>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                        {appointment.preparation.during.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Expert Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Chuyên viên tư vấn</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-lg">NA</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{appointment.expert.name}</div>
                  <div className="text-sm text-gray-600">{appointment.expert.title}</div>
                  <div className="text-xs text-gray-500">{appointment.expert.experience}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{appointment.expert.desc}</p>
              <button className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium py-2 rounded-lg border border-blue-100 mt-2">Xem hồ sơ đầy đủ</button>
            </div>

            {/* Support Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
              <div className="flex items-center gap-2 mb-3 p-3 bg-yellow-50 rounded">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-800 font-medium">Cần hỗ trợ khẩn cấp?</span>
              </div>
              <div className="text-sm text-gray-700 mb-2">Gọi đường dây nóng 24/7 của chúng tôi: <span className="font-semibold">{appointment.support.hotline}</span></div>
              <div className="text-sm text-gray-700 mb-2">Email: <span className="font-medium">{appointment.support.email}</span></div>
              <div className="text-sm text-gray-700">Điện thoại: <span className="font-medium">{appointment.support.phone}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;
