import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  Clock,
  Briefcase,
  Edit,
  Lock,
  Loader,
  ArrowLeft,
  Check,
} from "lucide-react";
import axios from "axios";

const ProfilePage = () => {
  // State để lưu trữ dữ liệu
  const [profileData, setProfileData] = useState(null); // Lưu trữ dữ liệu profile từ API
  const [isLoading, setIsLoading] = useState(true); // Theo dõi trạng thái loading
  const [error, setError] = useState(null); // Lưu trữ thông báo lỗi nếu có
  const [isEditing, setIsEditing] = useState(false); // Theo dõi trạng thái chỉnh sửa
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    address: "",
    city: "",
    occupation: "",
    educationLevel: "",
    certificates: "",
    workSchedule: "",
    specialization: "",
  });

  // Lấy token từ localStorage
  const getToken = () => localStorage.getItem("token");

  // Hàm lấy userId từ localStorage
  const getUserId = () => {
    // Lấy từ userInfo nếu được lưu dưới dạng object
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        return userData.userId || null;
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }

    // Lấy trực tiếp từ userId trong localStorage nếu được lưu riêng
    const userId = localStorage.getItem("userId");
    if (userId) return userId;

    // Lấy từ user nếu được lưu dưới dạng object khác
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.id || userData.userId || null;
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    return null;
  };

  // Cập nhật formData khi profileData thay đổi
  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        dateOfBirth: profileData.dateOfBirth
          ? formatDateForInput(profileData.dateOfBirth)
          : "",
        gender: profileData.gender || "",
        phoneNumber: profileData.phoneNumber || "",
        address: profileData.address || "",
        city: profileData.city || "",
        occupation: profileData.occupation || "",
        educationLevel: profileData.educationLevel || "",
        certificates: profileData.certificates || "",
        workSchedule: profileData.workSchedule || "",
        specialization: profileData.specialization || "",
      });
    }
  }, [profileData]);

  // Hàm chuyển đổi định dạng ngày tháng cho input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; // Kiểm tra ngày hợp lệ

      // Format ngày thành YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Hàm chuyển đổi định dạng ngày tháng cho API - Đã sửa để đơn giản hơn
  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    try {
      // Sử dụng cách đơn giản để tạo ISO string
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return date.toISOString();
    } catch (error) {
      console.error("Error formatting date for API:", error);
      return null;
    }
  };

  // Hàm gọi API lấy thông tin người dùng - Đã sửa để sử dụng userId từ localStorage
  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      // Lấy userId từ localStorage thay vì từ token
      const userId = getUserId();

      if (!userId) {
        setError("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
        setIsLoading(false);
        return;
      }

      console.log("Fetching profile for user ID:", userId);

      // Sử dụng template literals đúng cách để đưa userId vào URL
      const response = await axios.get(
        // `https://drugpreventionsystem-hwgecaa9ekasgngf.southeastasia-01.azurewebsites.net/api/UserProfile/${userId}/UserProfile`,
        `http://drugpreventionsystem.somee.com/api/UserProfile/${userId}/UserProfile`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      console.log("Profile response:", response.data);

      // Cập nhật xử lý response để phù hợp với cấu trúc mới
      if (response.data && response.data.data) {
        // API mới trả về object trong data, không phải mảng
        const userData = response.data.data;
        console.log("User profile data:", userData);
        setProfileData(userData);
        setError(null);
      } else {
        console.error("Invalid data structure:", response.data);
        setError("Không tìm thấy thông tin hồ sơ. Vui lòng thử lại sau.");
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);

      // Hiển thị thông báo lỗi cụ thể hơn
      if (err.response) {
        if (err.response.status === 404) {
          setError(
            "Không tìm thấy hồ sơ người dùng. Có thể bạn chưa tạo hồ sơ."
          );
        } else if (err.response.status === 401) {
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        } else {
          setError(
            `Lỗi máy chủ (${err.response.status}). Vui lòng thử lại sau.`
          );
        }
      } else if (err.request) {
        setError(
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        setError("Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Xử lý đơn giản: cập nhật tất cả các trường mà không cần validate phức tạp
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm gọi API cập nhật thông tin - Đã sửa để thử nhiều phương thức và endpoint khác nhau
  const updateProfile = async () => {
    setIsLoading(true);
    try {
      // Lấy ID từ profileData
      const profileId = profileData.profileId;
      const userId = profileData.userId;

      // Log trước khi định dạng để debug
      console.log("Before formatting - Phone:", formData.phoneNumber);

      // Format dữ liệu để khớp với yêu cầu của API
      const formattedData = {
        profileId: profileId,
        userId: userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth
          ? formatDateForAPI(formData.dateOfBirth)
          : null,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber ? formData.phoneNumber.trim() : "", // Loại bỏ khoảng trắng
        address: formData.address,
        city: formData.city,
        occupation: formData.occupation,
        educationLevel: formData.educationLevel,
        certificates: formData.certificates,
        workSchedule: formData.workSchedule,
        specialization: formData.specialization,
      };

      console.log("After formatting - Data being sent:", formattedData);

      // Sử dụng chỉ một endpoint chính xác đã xác định
      const response = await axios.put(
        // `https://drugpreventionsystem-hwgecaa9ekasgngf.southeastasia-01.azurewebsites.net/api/UserProfile/${profileId}`,
        `http://drugpreventionsystem.somee.com/api/UserProfile/${profileId}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update response:", response.data);

      if (response.data && response.data.resultStatus === "Success") {
        await fetchProfileData();
        setIsEditing(false);
        alert("Cập nhật thông tin thành công!");
      } else {
        // Log lỗi nếu có
        console.log("Update not successful:", response.data);
        setError("Không thể cập nhật thông tin. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);

      // Hiển thị chi tiết lỗi
      if (err.response && err.response.data) {
        console.log("Error details:", err.response.data);

        // Kiểm tra lỗi liên quan đến phoneNumber
        if (err.response.data.errors && err.response.data.errors.PhoneNumber) {
          setError(
            `Lỗi số điện thoại: ${err.response.data.errors.PhoneNumber.join(
              ", "
            )}`
          );
        } else {
          setError(`Lỗi cập nhật: ${JSON.stringify(err.response.data)}`);
        }
      } else {
        setError("Không thể cập nhật thông tin. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý form submit - Đã thêm validate ngày tháng
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate ngày tháng trước khi submit
    if (formData.dateOfBirth) {
      try {
        const date = new Date(formData.dateOfBirth);
        if (isNaN(date.getTime())) {
          setError("Ngày sinh không hợp lệ. Vui lòng kiểm tra lại.");
          return;
        }

        const year = date.getFullYear();
        if (year < 1900 || year > new Date().getFullYear()) {
          setError("Năm sinh phải từ 1900 đến năm hiện tại");
          return;
        }
      } catch (error) {
        setError("Định dạng ngày sinh không hợp lệ");
        return;
      }
    }

    // Nếu validate thành công thì tiếp tục cập nhật
    updateProfile();
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Hiển thị loading spinner khi đang tải dữ liệu lần đầu
  if (isLoading && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="mt-2 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
            <p className="text-gray-600 mt-1">
              Quản lý thông tin cá nhân của bạn
            </p>
          </div>
          <Link
            to="/home"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Hiển thị thông báo lỗi nếu có */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Sửa hồ sơ
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Đổi mật khẩu
                </button>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit}>
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
                      Họ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="p-3 bg-white rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">
                          {profileData?.firstName || "Chưa cập nhật"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      Tên
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="p-3 bg-white rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">
                          {profileData?.lastName || "Chưa cập nhật"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="p-3 bg-white rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">
                          {profileData?.phoneNumber || "Chưa cập nhật"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Ngày sinh
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth || ""}
                        onChange={handleChange}
                        min="1900-01-01"
                        max={new Date().toISOString().split("T")[0]} // Không cho chọn ngày tương lai
                        className="p-3 bg-white rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">
                          {profileData?.dateOfBirth
                            ? new Date(
                                profileData.dateOfBirth
                              ).toLocaleDateString("vi-VN")
                            : "Chưa cập nhật"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      Giới tính
                    </label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={formData.gender || ""}
                        onChange={handleChange}
                        className="p-3 bg-white rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Chọn giới tính --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">
                          {profileData?.gender || "Chưa cập nhật"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address || ""}
                        onChange={handleChange}
                        className="p-3 bg-white rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">
                          {profileData?.address || "Chưa cập nhật"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin chuyên viên */}
            <div className="bg-white rounded-xl shadow border border-gray-200 mt-6">
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
                    {isEditing ? (
                      <textarea
                        name="certificates"
                        value={formData.certificates || ""}
                        onChange={handleChange}
                        className="p-3 bg-white rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      ></textarea>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900 leading-relaxed">
                          {profileData?.certificates || "Chưa cập nhật"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        Lịch làm việc
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="workSchedule"
                          value={formData.workSchedule || ""}
                          onChange={handleChange}
                          className="p-3 bg-white rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-900">
                            {profileData?.workSchedule || "Chưa cập nhật"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        Chuyên môn
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization || ""}
                          onChange={handleChange}
                          className="p-3 bg-white rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-900">
                            {profileData?.specialization || "Chưa cập nhật"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Action buttons mobile view */}
          <div className="md:hidden flex flex-col gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Sửa hồ sơ
                </button>
                <button className="bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Đổi mật khẩu
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
