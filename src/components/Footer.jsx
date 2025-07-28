import React from 'react';
import { Shield, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Trang chủ', href: 'home' },
    { name: 'Khóa học', href: 'courses' },
    { name: 'Đánh giá', href: 'assessments' },
    { name: 'Chương trình', href: 'campaigns' },
    { name: 'Blog', href: 'blog' },
  ];

  const supportLinks = [
    { name: 'Đánh giá nguy cơ', href: 'assessments' },
    { name: 'Chương trình cộng đồng', href: 'campaigns' },
    { name: 'Hỗ trợ khẩn cấp', href: '#' },
    { name: 'Tài liệu tham khảo', href: '#' },
    { name: 'FAQ', href: '#' },
  ];

  const legalLinks = [
    { name: 'Chính sách bảo mật', href: '#' },
    { name: 'Điều khoản sử dụng', href: '#' },
    { name: 'Quy tắc cộng đồng', href: '#' },
    { name: 'Báo cáo vi phạm', href: '#' },
  ];

  const emergencyContacts = [
    { name: 'Đường dây nóng chống ma túy', number: '1800-1234', available: '24/7' },
    { name: 'Tư vấn tâm lý', number: '1800-5678', available: '6:00 - 22:00' },
    { name: 'Hỗ trợ khẩn cấp', number: '113', available: '24/7' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { name: 'Youtube', icon: Youtube, href: '#', color: 'hover:text-red-600' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-teal-900 text-white">
      {/* Emergency Banner */}
      <div className="bg-red-800 py-3">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white font-semibold">
            🚨 Cần hỗ trợ khẩn cấp? Gọi ngay đường dây nóng:
            <a href="tel:1800-1234" className="ml-2 underline hover:no-underline font-bold">
              1800-1234
            </a>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full flex items-center justify-center mr-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent">
                Drug Prevention
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Chúng tôi cam kết xây dựng một cộng đồng khỏe mạnh, không ma túy thông qua giáo dục, hỗ trợ và các chương trình phòng ngừa hiệu quả.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-teal-400" />
                <span>024-1234-5678</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-teal-400" />
                <span>info@drugprevention.vn</span>
              </div>
              <div className="flex items-start text-gray-300">
                <MapPin className="w-4 h-4 mr-3 mt-1 text-teal-400 flex-shrink-0" />
                <span>123 Đường ABC, Quận 1, TP.HCM, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-teal-300">Liên kết nhanh</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-teal-300 transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-teal-300">Hỗ trợ</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-teal-300 transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                    {link.name === 'Hỗ trợ khẩn cấp' && (
                      <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-teal-300">Đường dây nóng</h4>
            <div className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-blue-800 bg-opacity-30 rounded-lg p-4 border border-blue-700 border-opacity-50">
                  <h5 className="font-semibold text-white mb-1">{contact.name}</h5>
                  <a
                    href={`tel:${contact.number}`}
                    className="text-teal-300 font-bold text-lg hover:text-teal-200 transition-colors duration-200"
                  >
                    {contact.number}
                  </a>
                  <p className="text-gray-400 text-sm mt-1">{contact.available}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        {/* <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-4 text-teal-300">Theo dõi chúng tôi</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 ${social.color} transition-all duration-200 hover:scale-110 hover:bg-gray-600`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="text-center md:text-right">
              <h4 className="text-lg font-semibold mb-4 text-teal-300">Đăng ký nhận tin</h4>
              <div className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
                />
                <button className="bg-teal-500 hover:bg-teal-600 px-6 py-2 rounded-r-lg font-semibold transition-colors duration-200">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div> */}

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © 2025 Drug Prevention. Được phát triển với{' '}
                <Heart className="w-4 h-4 inline text-red-500" /> tại Việt Nam
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {legalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-teal-300 text-sm transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;