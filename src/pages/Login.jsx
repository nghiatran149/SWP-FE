import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import api from '../api/api';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowResendVerification(false);

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post(
        '/User/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      const result = response.data;
      console.log('API login result:', result);

      if (result.resultStatus === "Success" && result.data) {
        const userInfo = {
          userId: result.data.userId,
          username: result.data.username,
          email: result.data.email,
          roleId: result.data.roleId,
          roleName: result.data.roleName,
          token: result.data.token,
          tokenExpires: result.data.tokenExpires,
        };
        login(userInfo);
        navigate("/home", { state: { justLoggedIn: true } });
      } else {
        setError(result.messages?.[0] || "Đăng nhập thất bại!");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.response) {
        const status = err.response.status;
        const responseData = err.response.data;
        
        switch (status) {
          case 400:
            // Bad Request - Invalid password
            if (responseData.resultStatus === "Failed") {
              const errorMessage = responseData.messages?.[0] || "Mật khẩu không chính xác";
              // Translate specific BE messages
              const translatedMessage = errorMessage === "Invalid password" 
                ? "Mật khẩu không chính xác" 
                : errorMessage;
              setError(translatedMessage);
            } else {
              setError("Thông tin đăng nhập không hợp lệ");
            }
            break;
            
          case 401:
            // Unauthorized - Email not verified
            if (responseData.resultStatus === "NotVerified") {
              const errorMessage = responseData.messages?.[0] || "Email chưa được xác thực";
              // Translate specific BE messages
              const translatedMessage = errorMessage === "Your email is not verified." 
                ? "Email chưa được xác thực" 
                : errorMessage;
              setError(translatedMessage);
              setShowResendVerification(true);
            } else {
              setError("Không có quyền truy cập");
            }
            break;
            
          case 404:
            // Not Found - Invalid email
            if (responseData.resultStatus === "NotFound") {
              const errorMessage = responseData.messages?.[0] || "Email không tồn tại trong hệ thống";
              // Translate specific BE messages
              const translatedMessage = errorMessage === "Invalid email" 
                ? "Email không tồn tại trong hệ thống" 
                : errorMessage;
              setError(translatedMessage);
            } else {
              setError("Tài khoản không tồn tại");
            }
            break;
            
          default:
            setError(responseData.messages?.[0] || "Đăng nhập thất bại, vui lòng thử lại");
            break;
        }
      } else if (err.request) {
        setError("Không thể kết nối đến máy chủ, vui lòng thử lại sau");
      } else {
        setError("Đăng nhập thất bại, vui lòng thử lại");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError("Vui lòng nhập email để gửi lại xác thực");
      return;
    }

    try {
      setIsResending(true);
      // POST request với query parameter
      const response = await api.post('/User/resend-verification', null, {
        params: { email: email }
      });
      
      console.log("Resend verification response:", response.data);
      
      if (response.status === 200 && response.data.resultStatus === "Success") {
        const successMessage = response.data.messages?.[0] || "Email xác thực đã được gửi lại";
        
        // Check if email is already verified
        if (successMessage === "Email is already verified.") {
          const translatedMessage = "Email đã được xác thực. Bạn có thể đăng nhập bình thường.";
          toast.success(translatedMessage);
          setShowResendVerification(false);
          setError("");
        } else {
          // Email verification sent successfully
          const translatedMessage = successMessage === "Verification email has been sent. Please check your email." 
            ? "Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn." 
            : successMessage;
          toast.success(translatedMessage);
          setShowResendVerification(false);
          setError("");
        }
      } else {
        setError(response.data.messages?.[0] || "Không thể gửi lại email xác thực");
      }
    } catch (err) {
      console.error("Resend verification error:", err);
      
      if (err.response) {
        const status = err.response.status;
        const responseData = err.response.data;
        
        switch (status) {
          case 400:
            const badRequestMessage = responseData.messages?.[0] || "Email không hợp lệ";
            const translatedBadRequest = badRequestMessage === "Invalid email format" 
              ? "Email không hợp lệ" 
              : badRequestMessage;
            setError(translatedBadRequest);
            break;
          case 404:
            const notFoundMessage = responseData.messages?.[0] || "Email không tồn tại trong hệ thống";
            const translatedNotFound = notFoundMessage === "Email not found" 
              ? "Email không tồn tại trong hệ thống" 
              : notFoundMessage;
            setError(translatedNotFound);
            break;
          default:
            setError(responseData.messages?.[0] || "Không thể gửi lại email xác thực");
            break;
        }
      } else if (err.request) {
        setError("Không thể kết nối đến máy chủ, vui lòng thử lại sau");
      } else {
        setError("Lỗi kết nối, vui lòng thử lại sau");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              đăng ký tài khoản mới
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h- 5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {showResendVerification && (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isResending || !email}
                className={`text-sm font-medium text-blue-600 hover:text-blue-500 ${
                  isResending || !email ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isResending ? "Đang gửi..." : "Gửi lại email xác thực"}
              </button>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
