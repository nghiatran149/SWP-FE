import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';
import { ArrowLeft, Download, Printer, Calendar, Clock, User, Award, Building, Fingerprint } from 'lucide-react';

const CertificateDetail = () => {
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get('courseId');

  const formatCompletionDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user || !courseId) {
      setError("Không thể tải thông tin chứng chỉ. Thiếu thông tin người dùng hoặc khóa học.");
      setLoading(false);
      return;
    }

    const fetchCertificate = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/CourseCertificate/${courseId}/certificate?userId=${user.userId}`);
        if (res.data && res.data.data) {
          setCertificateData(res.data.data);
        } else {
          setError("Không tìm thấy chứng chỉ cho khóa học này.");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.messages?.join(' ') || err.message;
        if (err.response?.status === 404) {
          setError("Không tìm thấy chứng chỉ. Có thể bạn chưa hoàn thành khóa học hoặc chứng chỉ chưa được cấp.");
        } else {
          setError(`Lỗi khi tải dữ liệu chứng chỉ: ${errorMessage}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [courseId, user, isAuthLoading]);

  const handlePrint = () => {
    if (!certificateData?.certificateUrl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>In chứng chỉ</title></head><body style="margin:0; padding:0;"><img src="${certificateData.certificateUrl}" style="width:100%; height:auto;" onload="window.print();window.close()"></body></html>`);
    printWindow.document.close();
    printWindow.focus();
  };

  if (isAuthLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen text-gray-600">Đang tải chứng chỉ...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <Award className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">Không thể tải chứng chỉ</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Link to="/mycourse" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Quay lại khóa học của tôi
          </Link>
        </div>
      </div>
    );
  }

  if (!certificateData) {
    return (
      <div className="text-center py-12 text-gray-500">
        Không có dữ liệu chứng chỉ.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <Link to="/mycourse" className="hover:underline">Khóa học của tôi</Link>
          <span>/</span>
          <Link to={`/mycoursedetail?courseId=${courseId}`} className="hover:underline truncate max-w-xs">{certificateData.courseTitle}</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Chứng chỉ</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chứng chỉ hoàn thành</h1>
            <p className="text-gray-600 mt-1">Chúc mừng bạn đã hoàn thành khóa học "{certificateData.courseTitle}"</p>
          </div>
          <Link to={`/mycoursedetail?courseId=${courseId}`} className="flex min-w-max ml-10 items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại chi tiết</span>
          </Link>
        </div>
      </div>

      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Certificate Image - Left Side */}
            <div className="lg:w-2/3 p-8 bg-gray-100 flex justify-center items-center">
              {certificateData.certificateUrl ? (
                <img src={certificateData.certificateUrl} alt={`Chứng chỉ ${certificateData.courseTitle}`} className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
              ) : (
                <div className="text-center text-gray-500">Không có hình ảnh chứng chỉ.</div>
              )}
            </div>

            {/* Certificate Information - Right Side */}
            <div className="lg:w-1/3 p-8 border-l border-gray-200 flex flex-col">
              <div className="space-y-6 flex-grow">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chứng chỉ</h3>
                  <div className="space-y-4">
                    <InfoItem icon={Fingerprint} label="ID Chứng chỉ" value={certificateData.certificateId}/>
                    <InfoItem icon={User} label="Học viên" value={certificateData.userName} />
                    <InfoItem icon={Calendar} label="Ngày hoàn thành" value={formatCompletionDate(certificateData.completionDate)} />
                    <InfoItem icon={Award} label="Khóa học" value={certificateData.courseTitle} />
                    <InfoItem icon={Clock} label="Thời lượng" value={certificateData.durationWeeks} />
                    <InfoItem icon={User} label="Giảng viên" value={certificateData.instructorName} />
                    <InfoItem icon={Building} label="Tổ chức cấp" value={certificateData.issuingOrganization} />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button onClick={handlePrint} className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  <Printer className="w-5 h-5" />
                  <span>In chứng chỉ</span>
                </button>
                <a href={certificateData.certificateUrl} download={`Chung_chi_${certificateData.courseTitle?.replace(/\s+/g, '_')}.png`} className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center">
                  <Download className="w-5 h-5" />
                  <span>Tải xuống</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value, valueClassName }) => (
  <div className="flex items-start space-x-3">
    <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`font-medium text-gray-900 ${valueClassName || ''}`}>{value}</p>
    </div>
  </div>
);

export default CertificateDetail;