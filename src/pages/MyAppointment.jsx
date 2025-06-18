import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, Info, Plus } from 'lucide-react';

const MyAppointment = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock data for bookings
  const bookings = {
    upcoming: [
      {
        id: 1,
        date: '20/05/2023',
        time: '10:00',
        type: 'Trực tuyến',
        expert: 'TS. Nguyễn Văn A',
        note: 'Buổi tư vấn đầu tiên về nhận thức ma túy',
      },
      {
        id: 2,
        date: '05/06/2023',
        time: '15:30',
        type: 'Trực tuyến',
        expert: 'PGS.TS. Lê Văn C',
        note: 'Tư vấn về kỹ năng từ chối',
      },
    ],
    completed: [
      {
        id: 3,
        date: '15/04/2023',
        time: '14:00',
        type: 'Trực tiếp',
        expert: 'ThS. Trần Thị B',
        address: 'Văn phòng tư vấn, 123 Đường ABC, Quận 1, TP.HCM',
        note: 'Đánh giá sau khi hoàn thành khóa học',
      },
      {
        id: 4,
        date: '10/03/2023',
        time: '09:00',
        type: 'Trực tiếp',
        expert: 'ThS. Phạm Thị D',
        address: 'Văn phòng tư vấn, 123 Đường ABC, Quận 1, TP.HCM',
        note: 'Buổi tư vấn ban đầu',
      },
    ],
  };

  // Calendar mock state
  const [selectedDate, setSelectedDate] = useState('2025-06-19');

  // Render booking card
  const renderBookingCard = (booking, isCompleted = false) => (
    <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-5 mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex items-start">
        <div className="mr-4 mt-1">
          {isCompleted ? (
            <CheckCircle className="w-7 h-7 text-green-400" />
          ) : (
            <Clock className="w-7 h-7 text-blue-500" />
          )}
        </div>
        <div>
          <div className="flex items-center mb-1">
            <span className="font-semibold text-lg">{booking.date} - {booking.time}</span>
            <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{isCompleted ? 'Đã hoàn thành' : booking.type}</span>
          </div>
          <div className="text-gray-700 text-sm mb-1">Chuyên viên: {booking.expert}{booking.type === 'Trực tiếp' && booking.address && (
            <><span className="mx-2">-</span><span className="inline-flex items-center"><Calendar className="w-4 h-4 mr-1 inline" /> {booking.address}</span></>
          )}</div>
          <div className="text-gray-900 text-sm mt-1">
            <span className="font-semibold">Ghi chú:</span> {booking.note}
          </div>
        </div>
      </div>
      <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 md:ml-6">
      <Link to="/appointmentdetail" className={`px-4 py-2 rounded-md ${isCompleted ? 'border border-gray-300 bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>Xem chi tiết</Link>
        {!isCompleted && (
          <button className="px-4 py-2 border border-gray-300 rounded-md bg-red-600 text-white hover:bg-red-700">Hủy lịch</button>
        )} 
      </div>
    </div>
  );

  // Calendar UI (static for now)
  const renderCalendar = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
      <h2 className="text-lg font-bold mb-1">Lịch</h2>
      <p className="text-sm text-gray-600 mb-4">Xem lịch hẹn theo ngày</p>
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <button className="px-2 py-1 text-gray-500 hover:text-gray-700">&#60;</button>
            <span className="font-semibold">June 2025</span>
            <button className="px-2 py-1 text-gray-500 hover:text-gray-700">&#62;</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-gray-500 text-sm mb-1">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({length: 35}, (_, i) => {
              const day = i - 1;
              const isSelected = day === 18; // 19th
              return (
                <div key={i} className={`w-8 h-8 flex items-center justify-center rounded-full ${isSelected ? 'bg-black text-white' : 'hover:bg-gray-200'} cursor-pointer`}>
                  {i > 0 && i <= 30 ? i : ''}
                </div>
              );
            })}
          </div>
        </div>
        <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Đặt lịch mới</button>
      </div>
    </div>
  );

  // Useful info
  const renderUsefulInfo = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="text-lg font-bold mb-3">Thông tin hữu ích</h2>
      <div className="mb-3">
        <div className="font-semibold">Thời gian tư vấn</div>
        <div className="text-sm text-gray-600">Mỗi buổi tư vấn kéo dài 45-60 phút, tùy thuộc vào nhu cầu của bạn.</div>
      </div>
      <hr className="my-3" />
      <div className="mb-3">
        <div className="font-semibold">Hủy lịch hẹn</div>
        <div className="text-sm text-gray-600">Vui lòng hủy lịch hẹn ít nhất 24 giờ trước giờ hẹn để chúng tôi có thể sắp xếp cho người khác.</div>
      </div>
      <hr className="my-3" />
      <div>
        <div className="font-semibold">Hỗ trợ khẩn cấp</div>
        <div className="text-sm text-gray-600">Nếu bạn cần hỗ trợ khẩn cấp, vui lòng gọi đường dây nóng: 1800 1234</div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn của tôi</h1>
            <p className="text-gray-600 mt-1">Quản lý các buổi tư vấn của bạn</p>
          </div>
          <Link to="/home" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Về trang chủ
          </Link>
        </div>
      </div>
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 mx-auto">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'upcoming' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Sắp tới
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'completed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Đã hoàn thành
            </button>
          </div>
          {/* Booking list */}
          <div>
            {activeTab === 'upcoming' && (
              bookings.upcoming.length > 0 ? (
                bookings.upcoming.map(b => renderBookingCard(b, false))
              ) : (
                <div className="text-center py-10 text-gray-500">Không có lịch hẹn sắp tới nào</div>
              )
            )}
            {activeTab === 'completed' && (
              bookings.completed.length > 0 ? (
                bookings.completed.map(b => renderBookingCard(b, true))
              ) : (
                <div className="text-center py-10 text-gray-500">Chưa có lịch hẹn đã hoàn thành</div>
              )
            )}
          </div>
        </div>
        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {renderCalendar()}
          {renderUsefulInfo()}
        </div>
      </div>
    </div>
  );
};

export default MyAppointment;
