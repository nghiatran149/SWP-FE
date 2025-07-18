import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Calendar, Clock, MapPin, Users, User, Download, Share2, Bookmark, Info, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TABS = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'schedule', label: 'Lịch trình' },
    { id: 'speakers', label: 'Diễn giả' },
];

const CampaignDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/CommunityProgram/${id}`);
                if (res.data && res.data.data) {
                    setCampaign(res.data.data);
                } else {
                    setCampaign(null);
                }
            } catch (err) {
                setError('Không thể tải thông tin chương trình.');
            } finally {
                setLoading(false);
            }
        };
        // Kiểm tra trạng thái đăng ký nếu đã đăng nhập
        const checkRegistered = async () => {
            if (!user) return;
            try {
                const res = await api.get(`/CommunityProgram/user/${user.userId}/enrolled`);
                if (Array.isArray(res.data)) {
                    const found = res.data.find(c => c.programId === id);
                    if (found) setIsRegistered(true);
                }
            } catch (err) {
                // ignore
            }
        };
        if (id) fetchCampaign();
        if (id && user) checkRegistered();
    }, [id, user]);

    // Helper: format date/time
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN');
    };
    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    // Helper: status
    const isEnded = campaign && campaign.endDate && new Date() > new Date(campaign.endDate);
    const getStatusBadge = () => {
        if (!campaign?.startDate || !campaign?.endDate) return null;
        const now = new Date();
        const start = new Date(campaign.startDate);
        const end = new Date(campaign.endDate);
        if (now < start) {
            return <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-md font-bold ml-4 whitespace-nowrap">Sắp diễn ra</span>;
        }
        if (now > end) {
            return <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-md font-bold ml-4 whitespace-nowrap">Đã kết thúc</span>;
        }
        return <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-md font-bold ml-4 whitespace-nowrap">Đang diễn ra</span>;
    };

    // Đăng ký tham gia
    const handleRegister = async () => {
        if (isEnded) {
            alert('Chương trình đã kết thúc, không thể đăng ký.');
            return;
        }
        if (!user) {
            alert('Bạn cần đăng nhập để đăng ký chương trình.');
            navigate('/login');
            return;
        }
        setIsRegistering(true);
        try {
            const res = await api.post('/CommunityProgram/register', {
                userId: user.userId,
                programId: id,
            });
            if (res.data && res.data.participantId) {
                setIsRegistered(true);
            } else {
                alert('Đăng ký không thành công.');
            }
        } catch (err) {
            // Nếu đã đăng ký rồi thì disable nút và đổi chữ
            if (err.response && err.response.status === 400 && err.response.data && err.response.data.message && err.response.data.message.includes('already registered')) {
                setIsRegistered(true);
            } else {
                alert('Đăng ký không thành công.');
            }
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="mb-6">
                        {loading ? (
                            <div className="text-gray-500 py-8">Đang tải...</div>
                        ) : error ? (
                            <div className="text-red-500 py-8">{error}</div>
                        ) : campaign ? (
                            <>
                                <h1 className="text-4xl font-bold text-gray-900 mb-5">
                                    {campaign.title}
                                </h1>
                                <p className="text-lg text-gray-700 mb-5 max-w-4xl">
                                    {campaign.description}
                                </p>
                                {/* Target audience + Status in one row */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2 text-gray-500 text-base">
                                        <User size={18} />
                                        <span>Đối tượng: {campaign.targetAudience}</span>
                                    </div>
                                    {getStatusBadge()}
                                </div>
                                {/* Tabs */}
                                <div className="bg-white rounded-lg border border-gray-300 shadow-sm mb-8">
                                    <div className="border-b border-gray-200 flex">
                                        {TABS.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`px-6 py-3 text-sm font-medium border-b-2 focus:outline-none transition-colors duration-200 ${activeTab === tab.id
                                                    ? 'border-blue-600 text-blue-700 bg-blue-50'
                                                    : 'border-transparent text-gray-500 hover:text-blue-700'
                                                    }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="p-6">
                                        {activeTab === 'overview' && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">Giới thiệu chương trình</h3>
                                                <p className="text-gray-700 mb-2">{campaign.description}</p>
                                            </div>
                                        )}
                                        {activeTab === 'schedule' && (
                                            <div className="text-gray-500">Lịch trình sẽ được cập nhật sau.</div>
                                        )}
                                        {activeTab === 'speakers' && (
                                            <div className="text-gray-500">Thông tin diễn giả sẽ được cập nhật sau.</div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6 mb-6 sticky top-30">
                        <h3 className="text-xl font-semibold mb-4">Thông tin chương trình</h3>
                        {loading ? (
                            <div className="text-gray-500">Đang tải...</div>
                        ) : error ? (
                            <div className="text-red-500">{error}</div>
                        ) : campaign ? (
                            <>
                                <div className="flex items-center gap-2 text-gray-700 mb-4">
                                    <Calendar size={18} />
                                    <span>Ngày: {formatDate(campaign.startDate)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 mb-4">
                                    <Clock size={18} />
                                    <span>
                                        Thời gian: {formatTime(campaign.startDate)} - {formatTime(campaign.endDate)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 mb-4">
                                    <MapPin size={18} />
                                    <span>Địa điểm: {campaign.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 mb-4">
                                    <Users size={18} />
                                    <span>Số lượng người tham gia: {campaign.maxParticipants} người</span>
                                </div>
                                <hr className="my-4" />
                                <button
                                    className={`w-full py-3 rounded-lg font-medium transition-colors ${isRegistered || isEnded ? 'bg-green-800 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                    onClick={handleRegister}
                                    disabled={isRegistered || isRegistering || isEnded}
                                >
                                    {isEnded ? 'Đã kết thúc' : isRegistered ? 'Đã đăng ký' : isRegistering ? 'Đang xử lý...' : 'Đăng ký tham gia'}
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetail;
