// Giao diện lịch hẹn tư vấn
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  MapPin,
  Info,
  ArrowLeft,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

const MyBooking = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Mock data for bookings
  const [bookings, setBookings] = useState([
    {
      id: 1,
      date: '20/05/2023',
      time: '10:00',
      consultant: 'TS. Nguyễn Văn A',
      type: 'Trực tuyến',
      status: 'pending',
      note: 'Buổi tư vấn đầu tiên về nghiện thức ma túy',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      consultantDetails: {
        name: 'TS. Nguyễn Văn A',
        specialty: 'Tư vấn phòng chống ma túy',
        experience: '10 năm kinh nghiệm',
        bio: 'TS. Nguyễn Văn A là chuyên gia hàng đầu trong lĩnh vực tư vấn và phòng chống ma túy. Với hơn 10 năm kinh nghiệm, ông đã giúp đỡ hàng trăm người vượt qua các vấn đề liên quan đến ma túy.'
      }
    },
    {
      id: 2,
      date: '05/06/2023',
      time: '15:30',
      consultant: 'PGS TS. Lê Văn C',
      type: 'Trực tuyến',
      status: 'pending',
      note: 'Tư vấn về kỹ năng từ chối',
      meetingLink: 'https://meet.google.com/xyz-abcd-efg',
      consultantDetails: {
        name: 'PGS TS. Lê Văn C',
        specialty: 'Tư vấn kỹ năng xã hội',
        experience: '15 năm kinh nghiệm',
        bio: 'PGS TS. Lê Văn C chuyên về tư vấn các kỹ năng xã hội và kỹ năng từ chối, giúp nhiều thanh thiếu niên trang bị kỹ năng sống cần thiết.'
      }
    },
    {
      id: 3,
      date: '15/04/2023',
      time: '14:00',
      consultant: 'ThS. Trần Thị B',
      type: 'Trực tiếp',
      location: 'Văn phòng tư vấn, 123 Đường ABC, Quận 1, TP.HCM',
      status: 'completed',
      note: 'Đánh giá sau khi hoàn thành khóa học',
      consultantDetails: {
        name: 'ThS. Trần Thị B',
        specialty: 'Đánh giá và theo dõi',
        experience: '8 năm kinh nghiệm',
        bio: 'ThS. Trần Thị B có nhiều kinh nghiệm trong việc đánh giá và theo dõi tiến trình sau khi hoàn thành các khóa học phòng chống ma túy.'
      }
    },
    {
      id: 4,
      date: '10/03/2023',
      time: '09:00',
      consultant: 'ThS. Phạm Thị D',
      type: 'Trực tiếp',
      location: 'Văn phòng tư vấn, 123 Đường ABC, Quận 1, TP.HCM',
      status: 'completed',
      note: 'Buổi tư vấn ban đầu',
      consultantDetails: {
        name: 'ThS. Phạm Thị D',
        specialty: 'Tư vấn ban đầu và đánh giá',
        experience: '7 năm kinh nghiệm',
        bio: 'ThS. Phạm Thị D chuyên về các buổi tư vấn ban đầu và đánh giá nhu cầu của người cần được tư vấn về các vấn đề liên quan đến ma túy.'
      }
    }
  ]);

  // Filter bookings by status
  const upcomingBookings = bookings.filter(booking => booking.status === 'pending');
  const completedBookings = bookings.filter(booking => booking.status === 'completed');
  
  // Handle view detail click
  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setViewMode('detail');
  };
  
  // Handle back to list
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedBooking(null);
  };

  // Handle cancel booking
  const handleShowCancelModal = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const handleCancelBooking = () => {
    // Logic để hủy lịch hẹn (trong thực tế, bạn sẽ gọi API ở đây)
    const updatedBookings = bookings.filter(booking => booking.id !== bookingToCancel.id);
    setBookings(updatedBookings);
    setShowCancelModal(false);
    
    // Nếu đang ở trang chi tiết, quay về danh sách
    if (selectedBooking && selectedBooking.id === bookingToCancel.id) {
      setViewMode('list');
      setSelectedBooking(null);
    }
    
    // Hiển thị thông báo thành công
    setShowSuccessNotification(true);
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 3000);
  };

  // Custom Button component
  const CustomButton = ({ children, onClick, type = 'default', danger = false, block = false, size = 'medium', className = '' }) => {
    let buttonStyles = '';
    
    if (type === 'primary') {
      buttonStyles = danger 
        ? 'bg-red-600 hover:bg-red-700 text-white' 
        : 'bg-blue-600 hover:bg-blue-700 text-white';
    } else if (type === 'text') {
      buttonStyles = danger 
        ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
        : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100';
    } else {
      buttonStyles = 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700';
    }
    
    if (size === 'small') {
      buttonStyles += ' text-sm py-1 px-3';
    } else {
      buttonStyles += ' py-2 px-4';
    }
    
    return (
      <button 
        className={`rounded-md font-medium transition-colors focus:outline-none ${buttonStyles} ${block ? 'w-full' : ''} ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  // Simple Calendar Component
  const SimpleCalendar = () => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Tính số ngày trong tháng
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Tính ngày đầu tiên trong tháng (0 = CN, 1 = T2, ...)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    // Tạo mảng chứa các ngày trong tháng
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }
    
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <h3 className="font-medium text-gray-900">
            Tháng 6 2023
          </h3>
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map(day => (
            <div key={day} className="text-center text-xs text-gray-500 font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div 
              key={index} 
              className={`
                h-8 flex items-center justify-center text-sm
                ${!day ? '' : 'cursor-pointer hover:bg-gray-100'}
                ${day === 18 ? 'bg-blue-600 text-white rounded-full' : 'text-gray-700'}
                ${!day ? 'text-gray-300' : ''}
              `}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Function to render booking items
  const renderBookingItem = (booking) => (
    <div key={booking.id} className="flex border-b border-gray-200 py-4 gap-3">
      <div className="flex-none pt-1">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
      </div>
      
      <div className="flex-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <div className="font-medium">{booking.date} - {booking.time}</div>
            <div className="text-blue-600 bg-blue-50 rounded px-2 py-0.5 text-xs">
              {booking.type}
            </div>
          </div>
          
          <div className="text-gray-700 text-sm mt-1">
            <div>Chuyên viên: {booking.consultant}</div>
            <div className="text-gray-500 mt-1">Ghi chú: {booking.note}</div>
          </div>
        </div>
      </div>
      
      <div className="flex-none flex items-center gap-2">
        {booking.status === 'pending' && (
          <button 
            className="text-red-600 hover:text-red-700 text-sm"
            onClick={() => handleShowCancelModal(booking)}
          >
            Hủy lịch
          </button>
        )}
        <CustomButton 
          type="primary" 
          size="small"
          onClick={() => handleViewDetail(booking)}
        >
          Xem chi tiết
        </CustomButton>
      </div>
    </div>
  );

  // Custom Tabs component
const CustomTabs = ({ activeKey, onChange, items }) => {
  return (
    <div>
      <div className="flex">
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`px-4 py-2.5 text-sm font-medium flex-1 transition-colors ${
              activeKey === item.key 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="py-4">
        {items.find(item => item.key === activeKey)?.children}
      </div>
    </div>
  );
};

  // Notification component
  const SuccessNotification = () => {
    if (!showSuccessNotification) return null;
    
    return (
      <div className="fixed bottom-5 right-5 bg-green-100 border-l-4 border-green-500 p-4 flex items-start rounded shadow-lg z-50 max-w-sm">
        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-green-800 font-medium">Đã hủy lịch hẹn thành công.</p>
          <p className="text-green-700 text-sm mt-1">Lịch hẹn đã bị xóa khỏi hệ thống.</p>
        </div>
        <button 
          className="text-gray-500 hover:text-gray-700 ml-4"
          onClick={() => setShowSuccessNotification(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // Function to render booking list view
  const renderBookingList = () => (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Lịch hẹn của tôi</h1>
        <p className="text-sm text-gray-500">Quản lý các buổi tư vấn của bạn</p>
      </div>
      
      <CustomTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'upcoming',
            label: 'Sắp tới',
            children: (
              <div>
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map(booking => renderBookingItem(booking))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    Bạn không có lịch hẹn sắp tới
                  </div>
                )}
              </div>
            )
          },
          {
            key: 'completed',
            label: 'Đã hoàn thành',
            children: (
              <div>
                {completedBookings.length > 0 ? (
                  completedBookings.map(booking => renderBookingItem(booking))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    Bạn chưa có lịch hẹn hoàn thành
                  </div>
                )}
              </div>
            )
          }
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        {/* Calendar Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:w-1/2">
          <h2 className="text-base font-medium text-gray-900 mb-1">Lịch</h2>
          <p className="text-gray-500 text-sm mb-4">Xem lịch hẹn theo ngày</p>
          
          <SimpleCalendar />
          
          <Link to="/booking" className="w-full block">
  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-medium flex items-center justify-center">
    <Calendar className="h-4 w-4 mr-2" />
    Đặt lịch mới
  </button>
</Link>
        </div>
        
        {/* Info Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:w-1/2">
          <h2 className="text-base font-medium text-gray-900 mb-5">Thông tin hữu ích</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-600 mb-1">Thời gian tư vấn</h3>
                <p className="text-sm text-gray-600">
                  Mỗi buổi tư vấn kéo dài 45-60 phút, tùy thuộc vào nhu cầu của bạn
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-600 mb-1">Hủy lịch hẹn</h3>
                <p className="text-sm text-gray-600">
                  Vui lòng hủy lịch hẹn ít nhất 24 giờ trước giờ hẹn để chúng tôi có thể sắp xếp cho người khác
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-600 mb-1">Hỗ trợ khẩn cấp</h3>
                <p className="text-sm text-gray-600">
                  Nếu bạn cần hỗ trợ khẩn cấp, vui lòng gọi đường dây nóng: 1800 1234
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Function to render booking detail view
  const renderBookingDetail = () => {
    if (!selectedBooking) return null;
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-5">
          <button 
            onClick={handleBackToList}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
          </button>
        </div>
        
        <h1 className="text-xl font-bold text-gray-900 mb-6">Chi tiết cuộc hẹn</h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-medium">Thông tin cuộc hẹn</h2>
              <p className="text-sm text-gray-500">Chi tiết về cuộc hẹn tư vấn của bạn</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              selectedBooking.status === 'pending' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {selectedBooking.status === 'pending' ? 'Sắp tới' : 'Đã hoàn thành'}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div className="w-24 text-gray-600">Ngày</div>
              <div>{selectedBooking.date}</div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div className="w-24 text-gray-600">Thời gian</div>
              <div>{selectedBooking.time} (45 phút)</div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 mr-3"></div>
              <div className="w-24 text-gray-600">Hình thức</div>
              <div>{selectedBooking.type}</div>
            </div>
          </div>
          
          {selectedBooking.type === 'Trực tuyến' && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-medium mb-2">Link cuộc họp</h3>
              <div className="bg-gray-50 p-2 rounded text-sm text-gray-700">
                {selectedBooking.meetingLink}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Link cuộc họp sẽ hoạt động 20 phút trước giờ hẹn
              </p>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-medium mb-2">Ghi chú</h3>
            <p className="text-gray-700 text-sm">{selectedBooking.note}</p>
          </div>
          
          {selectedBooking.status === 'pending' && (
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
              <CustomButton 
                type="primary" 
                danger
                onClick={() => handleShowCancelModal(selectedBooking)}
              >
                Hủy cuộc hẹn
              </CustomButton>
            </div>
          )}
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Chuyên viên tư vấn</h2>
          
          <div className="text-center mb-5">
            <div className="text-lg font-bold mb-1">{selectedBooking.consultantDetails.name}</div>
            <div className="text-blue-600">{selectedBooking.consultantDetails.specialty}</div>
            <div className="text-sm text-gray-500">{selectedBooking.consultantDetails.experience}</div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Giới thiệu:</h3>
            <p className="text-sm text-gray-600">{selectedBooking.consultantDetails.bio}</p>
          </div>
          
          <CustomButton type="default" block className="mt-5">
            Xem hồ sơ đầy đủ
          </CustomButton>
        </div>
      </div>
    );
  };

  // Cancel Modal
  const CancelBookingModal = () => {
    if (!showCancelModal || !bookingToCancel) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold">Xác nhận hủy lịch hẹn</h2>
            <button 
              onClick={() => setShowCancelModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-6 py-4">
            <p className="text-gray-700 mb-4">
              Bạn có chắc chắn muốn hủy lịch hẹn vào ngày {bookingToCancel.date} lúc {bookingToCancel.time} với {bookingToCancel.consultant} không?
            </p>
            
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Lưu ý:</span> Việc hủy lịch hẹn trước 24 giờ sẽ không bị tính phí. Hủy lịch hẹn trong vòng 24 giờ có thể phát sinh phí hủy.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
              >
                Giữ lịch hẹn
              </button>
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 text-white font-medium"
              >
                Hủy lịch hẹn
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 font-sans">
      {viewMode === 'list' ? renderBookingList() : renderBookingDetail()}
      <CancelBookingModal />
      <SuccessNotification />
    </div>
  );
};

export default MyBooking;