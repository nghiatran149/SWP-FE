import React, { useState } from 'react';
import { Clock, DollarSign, Video, Shield, HelpCircle, Calendar, Mail, Phone, User, Send } from 'lucide-react';

const Booking = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const benefitItems = [
    {
      icon: Clock,
      title: "Thời gian tư vấn",
      description: "Mỗi buổi tư vấn kéo dài 45-60 phút, tùy thuộc vào nhu cầu của bạn.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: DollarSign,
      title: "Chi phí",
      description: "Dịch vụ tư vấn của chúng tôi hoàn toàn miễn phí cho tất cả mọi người.",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: Video,
      title: "Hình thức tư vấn",
      description: "Bạn có thể chọn tư vấn trực tuyến qua video call hoặc tư vấn trực tiếp tại văn phòng của chúng tôi.",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: Shield,
      title: "Bảo mật",
      description: "Thông tin của bạn sẽ được bảo mật hoàn toàn. Chúng tôi tuân thủ nghiêm ngặt các quy định về bảo mật thông tin.",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      icon: HelpCircle,
      title: "Hỗ trợ khẩn cấp",
      description: "Nếu bạn cần hỗ trợ khẩn cấp, vui lòng gọi đường dây nóng: 1800 1234",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Đặt lịch tư vấn
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Đội ngũ chuyên viên tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn và người thân. Đặt 
            lịch hẹn trực tuyến ngay hôm nay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Benefits */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Thông tin hữu ích
              </h2>
              
              <div className="space-y-6">
                {benefitItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`${item.bgColor} p-3 rounded-lg flex-shrink-0`}>
                        <IconComponent size={20} className={item.iconColor} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Đặt lịch tư vấn
              </h2>
              <p className="text-gray-600 mb-8">
                Vui lòng điền thông tin dưới đây để đặt lịch hẹn với chuyên viên tư vấn
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Thông tin cá nhân
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        Họ
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nhập họ của bạn"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Tên
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nhập tên của bạn"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập email của bạn"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Tuổi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tuổi của bạn"
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Tiếp theo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;