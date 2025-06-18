// Trang đặt lịch tư vấn
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, Clock, DollarSign, Video, Shield, HelpCircle } from "lucide-react";

const Booking = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    consultType: "online",
    appointmentDate: "",
    appointmentTime: "",
    consultant: "",
    reason: "",
    note: "",
    hasUsedServiceBefore: "false",
    referralSource: "",
  });

  // Sửa lại hàm xử lý input để không bị lỗi mất focus khi nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Sử dụng cập nhật state thông thường thay vì functional update
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleStep3Submit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleBackToStep2 = () => {
    setCurrentStep(2);
  };

  // Thông tin hữu ích - có thể sử dụng lại ở nhiều nơi
  const renderInfoSidebar = () => {
    return (
      <div className="w-full md:w-1/3 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Thông tin hữu ích
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">
              Thời gian tư vấn
            </h3>
            <p className="text-gray-600 text-sm">
              Mỗi buổi tư vấn kéo dài 45-60 phút, tùy thuộc vào nhu cầu của
              bạn.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Chi phí</h3>
            <p className="text-gray-600 text-sm">
              Dịch vụ tư vấn của chúng tôi hoàn toàn miễn phí cho tất cả mọi
              người.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">
              Hình thức tư vấn
            </h3>
            <p className="text-gray-600 text-sm">
              Bạn có thể chọn tư vấn trực tuyến qua video call hoặc tư vấn
              trực tiếp tại văn phòng của chúng tôi.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Bảo mật</h3>
            <p className="text-gray-600 text-sm">
              Thông tin của bạn sẽ được bảo mật hoàn toàn. Chúng tôi luôn
              tuân thủ nghiêm ngặt các quy định về bảo mật thông tin.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">
              Hỗ trợ khẩn cấp
            </h3>
            <p className="text-gray-600 text-sm">
              Nếu bạn cần hỗ trợ khẩn cấp, vui lòng gọi đường dây nóng:{" "}
              <span className="font-medium">1800 1234</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderSuccessPage = () => {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt lịch thành công!</h2>
        <p className="text-gray-600 mb-6">Cảm ơn bạn đã đặt lịch tư vấn với chúng tôi</p>
        
        <div>
          <h3 className="font-medium text-gray-800 mb-4">Thông tin cuộc hẹn</h3>
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="space-y-2">
              <p><span>Ngày: </span><span className="font-medium">{formData.appointmentDate || '20/05/2023'}</span></p>
              <p><span>Thời gian: </span><span className="font-medium">{formData.appointmentTime || '10:00'}</span></p>
              <p><span>Hình thức: </span><span className="font-medium">{formData.consultType === 'online' ? 'Trực tuyến' : 'Trực tiếp'}</span></p>
              <p><span>Chuyên viên tư vấn: </span><span className="font-medium">
                {formData.consultant === '1' ? 'TS. Nguyễn Văn A' : 
                 formData.consultant === '2' ? 'ThS. Trần Thị B' : 
                 formData.consultant === '3' ? 'TS. Lê Văn C' : 
                 'TS. Nguyễn Văn A'}
              </span></p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="font-medium text-gray-800 mb-4">Các bước tiếp theo</h3>
          <ol className="space-y-3 text-left list-decimal list-inside">
            <li>Bạn sẽ nhận được email xác nhận trong vòng 5 phút.</li>
            <li>Chuyên viên tư vấn sẽ liên hệ với bạn trước ngày hẹn để xác nhận</li>
            <li>Đối với tư vấn trực tuyến, bạn sẽ nhận được link cuộc gọi video qua email</li>
            <li>Vui lòng chuẩn bị sẵn sàng trước giờ hẹn 5-10 phút</li>
          </ol>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md mt-6 text-blue-700 text-sm">
          <p>Nếu bạn cần thay đổi hoặc hủy lịch hẹn, vui lòng liên hệ với chúng tôi ít nhất 24 giờ trước giờ hẹn.</p>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={() => navigate('/booking-history')}
            className="bg-gray-800 text-white py-2 px-6 rounded-md">
            Xem lịch hẹn của tôi
          </button>
          <Link to="/home" className="text-gray-600 hover:text-gray-800 py-2 underline">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  };

  const renderStep1 = () => {
    return (
      <div className="flex flex-col md:flex-row gap-8">
        {renderInfoSidebar()}
        
        {/* Form đặt lịch */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Đặt lịch tư vấn
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng điền thông tin dưới đây để đặt lịch hẹn với chuyên viên tư vấn
          </p>

          <form onSubmit={handleStep1Submit}>
            <h3 className="font-medium text-gray-800 mb-4">
              Thông tin cá nhân
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tuổi
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="1"
                max="120"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-6 rounded-md transition duration-300"
              >
                Tiếp theo
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div className="flex flex-col md:flex-row gap-8">
        {/* Thông tin hữu ích */}
        {renderInfoSidebar()}

        {/* Form đặt lịch */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Đặt lịch tư vấn
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng điền thông tin dưới đây để đặt lịch hẹn với chuyên viên tư vấn
          </p>

          <form onSubmit={handleStep2Submit}>
            <h3 className="font-medium text-gray-800 mb-4">
              Thông tin cuộc hẹn
            </h3>

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">
                Hình thức tư vấn
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center p-4 border rounded-md cursor-pointer">
                  <input
                    type="radio"
                    name="consultType"
                    value="online"
                    checked={formData.consultType === "online"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Trực tuyến</span>
                </label>
                <label className="flex items-center p-4 border rounded-md cursor-pointer">
                  <input
                    type="radio"
                    name="consultType"
                    value="offline"
                    checked={formData.consultType === "offline"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Trực tiếp</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">
                Ngày hẹn
              </h3>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                  </svg>
                </span>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Chọn ngày"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">
                Thời gian
              </h3>
              <select
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn thời gian</option>
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="13:30">13:30</option>
                <option value="14:30">14:30</option>
                <option value="15:30">15:30</option>
                <option value="16:30">16:30</option>
              </select>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">
                Chuyên viên tư vấn
              </h3>
              <select
                name="consultant"
                value={formData.consultant}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn chuyên viên tư vấn</option>
                <option value="1">TS. Nguyễn Văn A</option>
                <option value="2">ThS. Trần Thị B</option>
                <option value="3">TS. Lê Văn C</option>
              </select>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handleBackToStep1}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-2 px-6 rounded-md transition duration-300"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition duration-300"
              >
                Tiếp theo
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    return (
      <div className="flex flex-col md:flex-row gap-8">
        {/* Thông tin hữu ích */}
        {renderInfoSidebar()}

        {/* Form thông tin bổ sung */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Đặt lịch tư vấn
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng điền thông tin dưới đây để đặt lịch hẹn với chuyên viên tư vấn
          </p>

          <form onSubmit={handleStep3Submit}>
            <h3 className="font-medium text-gray-800 mb-4">
              Thông tin bổ sung
            </h3>

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">
                Lý do tư vấn
              </h3>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn lý do tư vấn</option>
                <option value="addiction">Nghiện ngập</option>
                <option value="prevention">Phòng ngừa</option>
                <option value="recovery">Phục hồi</option>
                <option value="education">Tìm hiểu thông tin</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">
                Ghi chú
              </h3>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="5"
                placeholder="Vui lòng cung cấp thêm thông tin về nhu cầu tư vấn của bạn"
              ></textarea>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">
                Bạn đã từng tham gia tư vấn trước đây chưa?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center p-4 border rounded-md cursor-pointer">
                  <input
                    type="radio"
                    name="hasUsedServiceBefore"
                    value="true"
                    checked={formData.hasUsedServiceBefore === "true"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Có</span>
                </label>
                <label className="flex items-center p-4 border rounded-md cursor-pointer">
                  <input
                    type="radio"
                    name="hasUsedServiceBefore"
                    value="false"
                    checked={formData.hasUsedServiceBefore === "false"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Chưa</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">
                Bạn biết đến dịch vụ tư vấn của chúng tôi qua đâu?
              </h3>
              <select
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn nguồn thông tin</option>
                <option value="friend">Bạn bè/Người thân</option>
                <option value="social">Mạng xã hội</option>
                <option value="search">Tìm kiếm Google</option>
                <option value="ad">Quảng cáo</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handleBackToStep2}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-2 px-6 rounded-md transition duration-300"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition duration-300"
              >
                Hoàn tất đặt lịch
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-0">
      <div className="max-w-6xl mx-auto">
        {!bookingSuccess && (
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Đặt lịch tư vấn
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Đội ngũ chuyên viên tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn và
              người thân. Đặt lịch hẹn trực tuyến ngay hôm nay.
            </p>
          </div>
        )}

        {bookingSuccess ? 
          renderSuccessPage() : 
          currentStep === 1 ? 
            renderStep1() : 
            currentStep === 2 ? 
              renderStep2() : 
              renderStep3()
        }
      </div>
    </div>
  );
};

export default Booking;