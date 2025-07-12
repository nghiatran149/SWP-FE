import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, PencilLine, Trash2, X } from 'lucide-react';
import api from '../api/api';

const CampaignManagement = () => {
  // State cho danh sách chương trình từ API
  const [campaigns, setCampaigns] = useState([]);
  // State lưu object gốc từ API để xem chi tiết
  const [rawCampaigns, setRawCampaigns] = useState([]);

  // State cho chức năng tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  
  // State để kiểm soát modal thêm mới
  const [showAddModal, setShowAddModal] = useState(false);
  
  // State để kiểm soát modal xem chi tiết
  const [showViewModal, setShowViewModal] = useState(false);
  
  // State để kiểm soát modal chỉnh sửa
  const [showEditModal, setShowEditModal] = useState(false);
  
  // State để lưu trữ chương trình đang được chọn để xem/chỉnh sửa
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  
  // State cho form thêm mới/chỉnh sửa
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAudience: '',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: '',
  });

  // State cho modal xem khảo sát
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [surveyData, setSurveyData] = useState(null);
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [surveyError, setSurveyError] = useState('');
  const [currentSurveyId, setCurrentSurveyId] = useState(null);

  // State cho modal tạo khảo sát
  const [showCreateSurveyModal, setShowCreateSurveyModal] = useState(false);
  const [createSurveyLoading, setCreateSurveyLoading] = useState(false);
  const [createSurveyError, setCreateSurveyError] = useState('');
  const [createSurveyForm, setCreateSurveyForm] = useState({ title: '', description: '' });
  const [createSurveyProgramId, setCreateSurveyProgramId] = useState(null);

  // State cho modal cập nhật khảo sát
  const [showUpdateSurveyModal, setShowUpdateSurveyModal] = useState(false);
  const [updateSurveyLoading, setUpdateSurveyLoading] = useState(false);
  const [updateSurveyError, setUpdateSurveyError] = useState('');
  const [updateSurveyForm, setUpdateSurveyForm] = useState({ title: '', description: '' });
  const [updateSurveyProgramId, setUpdateSurveyProgramId] = useState(null);
  const [updateSurveyId, setUpdateSurveyId] = useState(null);

  // State cho câu hỏi khảo sát
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [surveyQuestionsLoading, setSurveyQuestionsLoading] = useState(false);
  const [surveyQuestionsError, setSurveyQuestionsError] = useState('');
  const [openSurveyQuestionIds, setOpenSurveyQuestionIds] = useState([]);

  // State cho modal tạo câu hỏi khảo sát
  const [showAddSurveyQuestionModal, setShowAddSurveyQuestionModal] = useState(false);
  const [addSurveyQuestionForm, setAddSurveyQuestionForm] = useState({ questionText: '', questionType: 'text' });
  const [addSurveyQuestionLoading, setAddSurveyQuestionLoading] = useState(false);
  const [addSurveyQuestionError, setAddSurveyQuestionError] = useState('');

  // State cho modal cập nhật câu hỏi khảo sát
  const [showEditSurveyQuestionModal, setShowEditSurveyQuestionModal] = useState(false);
  const [editSurveyQuestionForm, setEditSurveyQuestionForm] = useState({ questionId: '', questionText: '', questionType: 'text' });
  const [editSurveyQuestionLoading, setEditSurveyQuestionLoading] = useState(false);
  const [editSurveyQuestionError, setEditSurveyQuestionError] = useState('');

  // State cho đáp án từng câu hỏi single choice
  const [answerOptions, setAnswerOptions] = useState({}); // { [questionId]: [option, ...] }
  const [answerOptionsLoading, setAnswerOptionsLoading] = useState({}); // { [questionId]: boolean }
  const [answerOptionsError, setAnswerOptionsError] = useState({}); // { [questionId]: string }

  // State cho modal thêm đáp án
  const [showAddAnswerOptionModal, setShowAddAnswerOptionModal] = useState(false);
  const [addAnswerOptionForm, setAddAnswerOptionForm] = useState({ questionId: '', optionText: '' });
  const [addAnswerOptionLoading, setAddAnswerOptionLoading] = useState(false);
  const [addAnswerOptionError, setAddAnswerOptionError] = useState('');
  const [addAnswerOptionTargetQuestionId, setAddAnswerOptionTargetQuestionId] = useState(null);

  // State cho modal cập nhật đáp án
  const [showEditAnswerOptionModal, setShowEditAnswerOptionModal] = useState(false);
  const [editAnswerOptionForm, setEditAnswerOptionForm] = useState({ optionId: '', questionId: '', optionText: '' });
  const [editAnswerOptionLoading, setEditAnswerOptionLoading] = useState(false);
  const [editAnswerOptionError, setEditAnswerOptionError] = useState('');
  const [editAnswerOptionTargetQuestionId, setEditAnswerOptionTargetQuestionId] = useState(null);

  // Đặt ngoài useEffect, trong body của component
  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/CommunityProgram');
      const data = response.data;
      if (data && data.data) {
        console.log('API data:', data.data); // Log dữ liệu gốc từ API
        setRawCampaigns(data.data); // Lưu object gốc
        const mapped = data.data.map((item) => ({
          id: item.programId,
          name: item.title,
          createdAt: item.createdAt, // giữ nguyên ISO string
          updatedAt: item.updatedAt, // giữ nguyên ISO string
          maxParticipants: item.maxParticipants,
          currentParticipantsCount: item.currentParticipantsCount,
          surveyId: item.surveyId,
        }));
        console.log('Mapped campaigns:', mapped); // Log dữ liệu đã map cho bảng
        const sortedCampaigns = [...mapped].sort((a, b) => {
          const aDate = new Date(a.updatedAt && a.updatedAt !== '-' ? a.updatedAt : a.createdAt).getTime();
          const bDate = new Date(b.updatedAt && b.updatedAt !== '-' ? b.updatedAt : b.createdAt).getTime();
          return bDate - aDate;
        });
        setCampaigns(sortedCampaigns);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch campaigns:', error);
    }
  };

  // Trong useEffect chỉ gọi lại hàm này
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Sắp xếp campaigns mới tạo/cập nhật lên đầu (giống UserManagement)
  const sortedCampaigns = [...campaigns].sort((a, b) => {
    const aDate = new Date(a.updatedAt && a.updatedAt !== '-' ? a.updatedAt : a.createdAt).getTime();
    const bDate = new Date(b.updatedAt && b.updatedAt !== '-' ? b.updatedAt : b.createdAt).getTime();
    return bDate - aDate;
  });

  // Lọc chương trình theo từ khóa tìm kiếm (chỉ theo name)
  const filteredCampaigns = sortedCampaigns.filter(campaign => 
    campaign.name && campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Xử lý mở modal xem chi tiết
  const handleViewCampaign = (campaign) => {
    // Tìm object gốc theo id
    const original = rawCampaigns.find(item => item.programId === campaign.id);
    setSelectedCampaign(original || campaign);
    setShowViewModal(true);
  };
  
  // Xử lý mở modal chỉnh sửa
  const handleEditCampaign = (campaign) => {
    // Lấy object gốc từ rawCampaigns nếu có
    const original = rawCampaigns.find(item => item.programId === campaign.id || item.programId === campaign.programId) || campaign;
    setSelectedCampaign(original);
    setFormData({
      name: original.name || original.title || '',
      description: original.description || '',
      targetAudience: original.targetAudience || '',
      startDate: original.startDate ? toInputDateTime(original.startDate) : '',
      endDate: original.endDate ? toInputDateTime(original.endDate) : '',
      location: original.location || '',
      maxParticipants: original.maxParticipants !== undefined ? original.maxParticipants : '',
    });
    setShowEditModal(true);
  };
  
  // Xử lý xóa chương trình
  const handleDeleteCampaign = async (campaign) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chương trình này?')) return;
    try {
      await api.delete(`/CommunityProgram/${campaign.id || campaign.programId}`);
      alert('Xóa chương trình thành công!');
      fetchCampaigns();
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      if (error.response) {
        alert('Xóa chương trình thất bại! ' + (error.response.data?.message || JSON.stringify(error.response.data) || ''));
      } else {
        alert('Xóa chương trình thất bại! ' + error.message);
      }
    }
  };
  
  // Hàm chuyển datetime-local sang ISO 8601
  function toISODateTime(str) {
    if (!str) return null;
    // str: '2025-07-09T18:18' => '2025-07-09T18:18:00'
    return str.length === 16 ? str + ':00' : str;
  }
  
  // Hàm chuyển ISO về input datetime-local
  function toInputDateTime(str) {
    if (!str) return '';
    const d = new Date(str);
    if (isNaN(d)) return '';
    // yyyy-MM-ddTHH:mm
    return d.toISOString().slice(0, 16);
  }
  
  // Hàm mở modal add và reset formData
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      description: '',
      targetAudience: '',
      startDate: '',
      endDate: '',
      location: '',
      maxParticipants: '',
    });
    setShowAddModal(true);
  };
  
  // Hàm đóng modal update và reset formData
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setFormData({
      name: '',
      description: '',
      targetAudience: '',
      startDate: '',
      endDate: '',
      location: '',
      maxParticipants: '',
    });
  };
  
  // Xử lý thêm chương trình mới
  const handleAddCampaign = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.name,
        description: formData.description,
        targetAudience: formData.targetAudience,
        startDate: toISODateTime(formData.startDate),
        endDate: toISODateTime(formData.endDate),
        location: formData.location,
        maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : 0,
        surveyId: null,
      };
      await api.post('/CommunityProgram', payload);
      setShowAddModal(false);
      setFormData({
        name: '',
        description: '',
        targetAudience: '',
        startDate: '',
        endDate: '',
        location: '',
        maxParticipants: '',
      });
      // Reload lại danh sách
      fetchCampaigns();
    } catch (error) {
      // Log chi tiết lỗi
      console.error('Failed to add campaign:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        alert('Thêm chương trình thất bại! ' + (error.response.data?.message || JSON.stringify(error.response.data) || ''));
      } else {
        alert('Thêm chương trình thất bại! ' + error.message);
      }
    }
  };
  
  // Xử lý cập nhật chương trình
  const handleUpdateCampaign = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.name,
        description: formData.description,
        targetAudience: formData.targetAudience,
        startDate: toISODateTime(formData.startDate),
        endDate: toISODateTime(formData.endDate),
        location: formData.location,
        maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : 0,
      };
      await api.put(`/CommunityProgram/${selectedCampaign.programId || selectedCampaign.id}`, payload);
      setShowEditModal(false);
      setSelectedCampaign(null);
      setFormData({
        name: '',
        description: '',
        targetAudience: '',
        startDate: '',
        endDate: '',
        location: '',
        maxParticipants: '',
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Failed to update campaign:', error);
      if (error.response) {
        alert('Cập nhật chương trình thất bại! ' + (error.response.data?.message || JSON.stringify(error.response.data) || ''));
      } else {
        alert('Cập nhật chương trình thất bại! ' + error.message);
      }
    }
  };

  // Hàm format ngày giờ 24h
  function formatDateTime24h(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date)) return '-';
    // Format: HH:mm:ss DD/MM/YYYY
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  }

  // Hàm xem khảo sát
  const handleViewSurvey = async (campaign) => {
    if (!campaign.surveyId) return;
    setSurveyLoading(true);
    setSurveyError('');
    setShowSurveyModal(true);
    setSurveyQuestions([]);
    setSurveyQuestionsError('');
    setSurveyQuestionsLoading(true);
    setCurrentSurveyId(campaign.surveyId); // Lưu surveyId hiện tại
    try {
      const response = await api.get(`/ProgramSurvey/${campaign.surveyId}`);
      setSurveyData({
        title: response.data.title,
        description: response.data.description,
      });
      // Lấy câu hỏi
      const qRes = await api.get(`/ProgramSurveyQuestion/survey/${campaign.surveyId}`);
      setSurveyQuestions(qRes.data || []);
    } catch (err) {
      setSurveyError('Không thể tải khảo sát.');
      setSurveyData(null);
      setSurveyQuestionsError('Không thể tải câu hỏi khảo sát.');
    } finally {
      setSurveyLoading(false);
      setSurveyQuestionsLoading(false);
    }
  };

  // Hàm lấy đáp án cho câu hỏi single choice
  const fetchAnswerOptions = async (questionId) => {
    setAnswerOptionsLoading((prev) => ({ ...prev, [questionId]: true }));
    setAnswerOptionsError((prev) => ({ ...prev, [questionId]: '' }));
    try {
      const res = await api.get(`/ProgramSurveyAnswerOption/question/${questionId}`);
      setAnswerOptions((prev) => ({ ...prev, [questionId]: res.data || [] }));
    } catch (err) {
      setAnswerOptionsError((prev) => ({ ...prev, [questionId]: 'Không thể tải đáp án.' }));
    } finally {
      setAnswerOptionsLoading((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  // Hàm toggle dropdown câu hỏi
  const handleToggleSurveyQuestion = (questionId, questionType) => {
    setOpenSurveyQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
    if (!openSurveyQuestionIds.includes(questionId) && questionType === 'single choice' && !answerOptions[questionId]) {
      fetchAnswerOptions(questionId);
    }
  };

  // Hàm mở modal tạo khảo sát
  const handleOpenCreateSurvey = (campaign) => {
    setCreateSurveyForm({ title: '', description: '' });
    setCreateSurveyProgramId(campaign.id || campaign.programId);
    setCreateSurveyError('');
    setShowCreateSurveyModal(true);
  };

  // Hàm submit tạo khảo sát
  const handleCreateSurvey = async (e) => {
    e.preventDefault();
    setCreateSurveyLoading(true);
    setCreateSurveyError('');
    try {
      await api.post('/ProgramSurvey', {
        title: createSurveyForm.title,
        description: createSurveyForm.description,
        programId: createSurveyProgramId,
      });
      setShowCreateSurveyModal(false);
      setCreateSurveyForm({ title: '', description: '' });
      setCreateSurveyProgramId(null);
      // Reload lại danh sách campaign để cập nhật surveyId
      fetchCampaigns();
    } catch (err) {
      setCreateSurveyError('Tạo khảo sát thất bại!');
    } finally {
      setCreateSurveyLoading(false);
    }
  };

  // Hàm mở modal cập nhật khảo sát
  const handleOpenUpdateSurvey = async (campaign) => {
    setUpdateSurveyError('');
    setUpdateSurveyLoading(true);
    setShowUpdateSurveyModal(true);
    try {
      // Lấy thông tin khảo sát hiện tại
      const response = await api.get(`/ProgramSurvey/${campaign.surveyId}`);
      setUpdateSurveyForm({
        title: response.data.title || '',
        description: response.data.description || '',
      });
      setUpdateSurveyProgramId(campaign.id || campaign.programId);
      setUpdateSurveyId(campaign.surveyId);
    } catch (err) {
      setUpdateSurveyError('Không thể tải thông tin khảo sát!');
    } finally {
      setUpdateSurveyLoading(false);
    }
  };

  // Hàm submit cập nhật khảo sát
  const handleUpdateSurvey = async (e) => {
    e.preventDefault();
    setUpdateSurveyLoading(true);
    setUpdateSurveyError('');
    try {
      await api.put(`/ProgramSurvey/${updateSurveyId}`, {
        title: updateSurveyForm.title,
        description: updateSurveyForm.description,
        programId: updateSurveyProgramId,
      });
      setShowUpdateSurveyModal(false);
      setUpdateSurveyForm({ title: '', description: '' });
      setUpdateSurveyId(null);
      setUpdateSurveyProgramId(null);
      fetchCampaigns();
    } catch (err) {
      setUpdateSurveyError('Cập nhật khảo sát thất bại!');
    } finally {
      setUpdateSurveyLoading(false);
    }
  };

  // Hàm xóa khảo sát
  const handleDeleteSurvey = async (campaign) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khảo sát này?')) return;
    try {
      await api.delete(`/ProgramSurvey/${campaign.surveyId}`);
      fetchCampaigns();
    } catch (err) {
      alert('Xóa khảo sát thất bại!');
    }
  };

  // Hàm mở modal thêm câu hỏi
  const handleOpenAddSurveyQuestion = () => {
    setAddSurveyQuestionForm({ questionText: '', questionType: 'text' });
    setAddSurveyQuestionError('');
    setShowAddSurveyQuestionModal(true);
  };

  // Hàm submit tạo câu hỏi khảo sát
  const handleAddSurveyQuestion = async (e) => {
    e.preventDefault();
    if (!surveyData || !currentSurveyId) return;
    setAddSurveyQuestionLoading(true);
    setAddSurveyQuestionError('');
    try {
      await api.post('/ProgramSurveyQuestion', {
        surveyId: currentSurveyId,
        questionText: addSurveyQuestionForm.questionText,
        questionType: addSurveyQuestionForm.questionType,
      });
      setShowAddSurveyQuestionModal(false);
      setAddSurveyQuestionForm({ questionText: '', questionType: 'text' });
      // Reload lại danh sách câu hỏi khảo sát
      setSurveyQuestionsLoading(true);
      setSurveyQuestionsError('');
      try {
        const qRes = await api.get(`/ProgramSurveyQuestion/survey/${currentSurveyId}`);
        setSurveyQuestions(qRes.data || []);
      } catch (err) {
        setSurveyQuestionsError('Không thể tải câu hỏi khảo sát.');
      } finally {
        setSurveyQuestionsLoading(false);
      }
    } catch (err) {
      setAddSurveyQuestionError('Tạo câu hỏi thất bại!');
    } finally {
      setAddSurveyQuestionLoading(false);
    }
  };

  // Hàm mở modal sửa câu hỏi
  const handleOpenEditSurveyQuestion = (q) => {
    let type = q.questionType;
    if (type !== 'text' && type !== 'single choice') {
      type = 'text';
    }
    setEditSurveyQuestionForm({
      questionId: q.questionId,
      questionText: q.questionText,
      questionType: type,
    });
    setEditSurveyQuestionError('');
    setShowEditSurveyQuestionModal(true);
  };

  // Hàm submit cập nhật câu hỏi khảo sát
  const handleEditSurveyQuestion = async (e) => {
    e.preventDefault();
    if (!currentSurveyId || !editSurveyQuestionForm.questionId) return;
    setEditSurveyQuestionLoading(true);
    setEditSurveyQuestionError('');
    try {
      await api.put(`/ProgramSurveyQuestion/${editSurveyQuestionForm.questionId}`, {
        surveyId: currentSurveyId,
        questionText: editSurveyQuestionForm.questionText,
        questionType: editSurveyQuestionForm.questionType,
      });
      setShowEditSurveyQuestionModal(false);
      setEditSurveyQuestionForm({ questionId: '', questionText: '', questionType: 'text' });
      // Reload lại danh sách câu hỏi khảo sát
      setSurveyQuestionsLoading(true);
      setSurveyQuestionsError('');
      try {
        const qRes = await api.get(`/ProgramSurveyQuestion/survey/${currentSurveyId}`);
        setSurveyQuestions(qRes.data || []);
      } catch (err) {
        setSurveyQuestionsError('Không thể tải câu hỏi khảo sát.');
      } finally {
        setSurveyQuestionsLoading(false);
      }
    } catch (err) {
      setEditSurveyQuestionError('Cập nhật câu hỏi thất bại!');
    } finally {
      setEditSurveyQuestionLoading(false);
    }
  };

  // Hàm xóa câu hỏi khảo sát
  const handleDeleteSurveyQuestion = async (q) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    if (!q.questionId) return;
    try {
      await api.delete(`/ProgramSurveyQuestion/${q.questionId}`);
      // Reload lại danh sách câu hỏi khảo sát
      setSurveyQuestionsLoading(true);
      setSurveyQuestionsError('');
      try {
        const qRes = await api.get(`/ProgramSurveyQuestion/survey/${currentSurveyId}`);
        setSurveyQuestions(qRes.data || []);
      } catch (err) {
        setSurveyQuestionsError('Không thể tải câu hỏi khảo sát.');
      } finally {
        setSurveyQuestionsLoading(false);
      }
    } catch (err) {
      alert('Xóa câu hỏi thất bại!');
    }
  };

  // Hàm mở modal thêm đáp án
  const handleOpenAddAnswerOption = (questionId) => {
    setAddAnswerOptionForm({ questionId, optionText: '' });
    setAddAnswerOptionError('');
    setAddAnswerOptionTargetQuestionId(questionId);
    setShowAddAnswerOptionModal(true);
  };

  // Hàm submit thêm đáp án
  const handleAddAnswerOption = async (e) => {
    e.preventDefault();
    setAddAnswerOptionLoading(true);
    setAddAnswerOptionError('');
    try {
      await api.post('/ProgramSurveyAnswerOption', {
        questionId: addAnswerOptionForm.questionId,
        optionText: addAnswerOptionForm.optionText,
      });
      setShowAddAnswerOptionModal(false);
      setAddAnswerOptionForm({ questionId: '', optionText: '' });
      setAddAnswerOptionTargetQuestionId(null);
      // Reload lại đáp án cho câu hỏi này
      fetchAnswerOptions(addAnswerOptionForm.questionId);
    } catch (err) {
      setAddAnswerOptionError('Thêm đáp án thất bại!');
    } finally {
      setAddAnswerOptionLoading(false);
    }
  };

  // Hàm mở modal sửa đáp án
  const handleOpenEditAnswerOption = (opt) => {
    setEditAnswerOptionForm({
      optionId: opt.optionId,
      questionId: opt.questionId,
      optionText: opt.optionText,
    });
    setEditAnswerOptionError('');
    setEditAnswerOptionTargetQuestionId(opt.questionId);
    setShowEditAnswerOptionModal(true);
  };

  // Hàm submit cập nhật đáp án
  const handleEditAnswerOption = async (e) => {
    e.preventDefault();
    setEditAnswerOptionLoading(true);
    setEditAnswerOptionError('');
    try {
      await api.put(`/ProgramSurveyAnswerOption/${editAnswerOptionForm.optionId}`, {
        questionId: editAnswerOptionForm.questionId,
        optionText: editAnswerOptionForm.optionText,
      });
      setShowEditAnswerOptionModal(false);
      setEditAnswerOptionForm({ optionId: '', questionId: '', optionText: '' });
      setEditAnswerOptionTargetQuestionId(null);
      // Reload lại đáp án cho câu hỏi này
      fetchAnswerOptions(editAnswerOptionForm.questionId);
    } catch (err) {
      setEditAnswerOptionError('Cập nhật đáp án thất bại!');
    } finally {
      setEditAnswerOptionLoading(false);
    }
  };

  // Hàm xóa đáp án
  const handleDeleteAnswerOption = async (opt) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đáp án này?')) return;
    if (!opt.optionId || !opt.questionId) return;
    try {
      await api.delete(`/ProgramSurveyAnswerOption/${opt.optionId}`);
      // Reload lại đáp án cho câu hỏi này
      fetchAnswerOptions(opt.questionId);
    } catch (err) {
      alert('Xóa đáp án thất bại!');
    }
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý chương trình</h1>
            <p className="text-gray-600 mt-1">Xem thông tin và quản lý tất cả các chương trình trên hệ thống</p>
          </div>
          <Link to="/home" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Về trang chủ
          </Link>
        </div>
      </div>

      <div className="px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mô tả..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Thêm chương trình
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tên chương trình
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  SL tối đa
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  SL đã đăng ký
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Khảo sát
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  QL Khảo sát
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cập nhật lúc
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{campaign.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">{campaign.maxParticipants !== undefined ? campaign.maxParticipants : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">{campaign.currentParticipantsCount !== undefined ? campaign.currentParticipantsCount : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {campaign.surveyId ? '✔️' : '❌'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {campaign.surveyId ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-2 rounded hover:bg-blue-50 text-blue-600"
                            title="Xem khảo sát"
                            onClick={() => handleViewSurvey(campaign)}
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="p-2 rounded hover:bg-amber-50 text-amber-500"
                            title="Sửa khảo sát"
                            onClick={() => handleOpenUpdateSurvey(campaign)}
                          >
                            <PencilLine size={18} />
                          </button>
                          <button
                            className="p-2 rounded hover:bg-red-50 text-red-500"
                            title="Xóa khảo sát"
                            onClick={() => handleDeleteSurvey(campaign)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="p-2 rounded hover:bg-green-50 text-green-600"
                          title="Thêm khảo sát"
                          onClick={() => handleOpenCreateSurvey(campaign)}
                        >
                          <Plus size={18} />
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(() => {
                        const date = campaign.createdAt ? new Date(campaign.createdAt) : null;
                        if (!date || isNaN(date)) return '-';
                        const pad = (n) => n.toString().padStart(2, '0');
                        return <>
                          {pad(date.getHours())}:{pad(date.getMinutes())}:{pad(date.getSeconds())}<br />
                          {pad(date.getDate())}/{pad(date.getMonth() + 1)}/{date.getFullYear()}
                        </>;
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(() => {
                        const date = campaign.updatedAt ? new Date(campaign.updatedAt) : null;
                        if (!date || isNaN(date)) return '-';
                        const pad = (n) => n.toString().padStart(2, '0');
                        return <>
                          {pad(date.getHours())}:{pad(date.getMinutes())}:{pad(date.getSeconds())}<br />
                          {pad(date.getDate())}/{pad(date.getMonth() + 1)}/{date.getFullYear()}
                        </>;
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewCampaign(campaign)}
                          className="p-2 rounded hover:bg-blue-50 text-blue-600"
                          title="Xem chi tiết"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleEditCampaign(campaign)}
                          className="p-2 rounded hover:bg-amber-50 text-amber-500"
                          title="Chỉnh sửa"
                        >
                          <PencilLine size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteCampaign(campaign)}
                          className="p-2 rounded hover:bg-red-50 text-red-500"
                          title="Xóa"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy chương trình nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal thêm mới */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Thêm chương trình mới</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCampaign}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên chương trình
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đối tượng
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa điểm
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng tối đa
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Thêm mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết */}
      {showViewModal && selectedCampaign && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Chi tiết chương trình</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* <div>
                <h4 className="text-sm font-medium text-gray-500">ID chương trình</h4>
                <p className="mt-1 text-base break-all">{selectedCampaign.id || selectedCampaign.programId}</p>
              </div> */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">Tên chương trình</h4>
                <p className="mt-1 text-base">{selectedCampaign.name || selectedCampaign.title}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Mô tả</h4>
                <p className="mt-1 text-base">{selectedCampaign.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Đối tượng</h4>
                <p className="mt-1 text-base">{selectedCampaign.targetAudience || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Ngày bắt đầu</h4>
                  <p className="mt-1 text-sm text-gray-500">{formatDateTime24h(selectedCampaign.startDate)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Ngày kết thúc</h4>
                  <p className="mt-1 text-sm text-gray-500">{formatDateTime24h(selectedCampaign.endDate)}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Địa điểm</h4>
                <p className="mt-1 text-base">{selectedCampaign.location || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Ngày tạo</h4>
                  <p className="mt-1 text-sm text-gray-500">{formatDateTime24h(selectedCampaign.createdAt)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Cập nhật lần cuối</h4>
                  <p className="mt-1 text-sm text-gray-500">{formatDateTime24h(selectedCampaign.updatedAt)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Số lượng tối đa</h4>
                  <p className="mt-1 text-base">{selectedCampaign.maxParticipants !== undefined ? selectedCampaign.maxParticipants : '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Số lượng đã đăng ký</h4>
                  <p className="mt-1 text-base">{selectedCampaign.currentParticipantsCount !== undefined ? selectedCampaign.currentParticipantsCount : '-'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa */}
      {showEditModal && selectedCampaign && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Chỉnh sửa chương trình</h3>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateCampaign}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên chương trình
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đối tượng
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa điểm
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng tối đa
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xem khảo sát */}
      {showSurveyModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] p-6 overflow-y-auto hide-scrollbar"
          >
            <style>{`
              .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Xem khảo sát chương trình</h3>
              <button onClick={() => setShowSurveyModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            {surveyLoading ? (
              <div className="text-center py-8 text-gray-500">Đang tải khảo sát...</div>
            ) : surveyError ? (
              <div className="text-center text-red-500 py-8">{surveyError}</div>
            ) : surveyData ? (
              <div>
                <div className="mb-4">
                  <div className="font-semibold text-base mb-1">Tiêu đề:</div>
                  <div className="text-lg mb-2">{surveyData.title}</div>
                  <div className="font-semibold text-base mb-1">Mô tả:</div>
                  <div className="text-gray-600 mb-2">{surveyData.description}</div>
                </div>
                {/* Khung thêm câu hỏi */}
                <div className="my-3">
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
                    onClick={handleOpenAddSurveyQuestion}
                  >
                    <Plus className="w-5 h-5" />
                    <span>Thêm câu hỏi</span>
                  </button>
                </div>
                {/* Danh sách câu hỏi khảo sát */}
                <div className="space-y-4">
                  {surveyQuestionsLoading ? (
                    <div className="text-gray-500">Đang tải câu hỏi...</div>
                  ) : surveyQuestionsError ? (
                    <div className="text-red-500">{surveyQuestionsError}</div>
                  ) : surveyQuestions.length > 0 ? (
                    surveyQuestions.map((q, idx) => {
                      if (q.questionType === 'text') {
                        return (
                          <div key={q.questionId} className="bg-white rounded-xl shadow border border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-gray-900">Câu {idx + 1}: {q.questionText}</div>
                              <div className="flex items-center gap-2">
                                <button className="p-1 rounded hover:bg-amber-50 text-amber-500" title="Sửa câu hỏi" onClick={() => handleOpenEditSurveyQuestion(q)}>
                                  <PencilLine size={18} />
                                </button>
                                <button className="p-1 rounded hover:bg-red-50 text-red-500" title="Xóa câu hỏi" onClick={() => handleDeleteSurveyQuestion(q)}>
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 font-semibold mt-2">Loại: Tự luận</div>
                          </div>
                        );
                      } else if (q.questionType === 'single choice') {
                        return (
                          <div key={q.questionId} className="bg-white rounded-xl shadow border border-gray-200">
                            <div
                              className="px-6 py-4 cursor-pointer select-none"
                              onClick={() => handleToggleSurveyQuestion(q.questionId, q.questionType)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {openSurveyQuestionIds.includes(q.questionId) ? (
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                  ) : (
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                  )}
                                  <span className="font-medium text-gray-900">Câu {idx + 1}: {q.questionText}</span>
                                </div>
                                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                  <button className="p-1 rounded hover:bg-amber-50 text-amber-500" title="Sửa câu hỏi" onClick={() => handleOpenEditSurveyQuestion(q)}>
                                    <PencilLine size={18} />
                                  </button>
                                  <button className="p-1 rounded hover:bg-red-50 text-red-500" title="Xóa câu hỏi" onClick={() => handleDeleteSurveyQuestion(q)}>
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500 font-semibold mt-2">Loại: Chọn một đáp án</div>
                            </div>
                            {openSurveyQuestionIds.includes(q.questionId) && (
                              <div className="bg-white border-t border-gray-100 px-8 pb-4 pt-2">
                                {/* Khung thêm đáp án */}
                                <div className="my-2">
                                  <button
                                    className="w-full flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
                                    onClick={() => handleOpenAddAnswerOption(q.questionId)}
                                  >
                                    <Plus className="w-5 h-5" />
                                    <span>Thêm đáp án</span>
                                  </button>
                                </div>
                                {/* Danh sách đáp án */}
                                {answerOptionsLoading[q.questionId] ? (
                                  <div className="text-gray-500">Đang tải đáp án...</div>
                                ) : answerOptionsError[q.questionId] ? (
                                  <div className="text-red-500">{answerOptionsError[q.questionId]}</div>
                                ) : answerOptions[q.questionId] && answerOptions[q.questionId].length > 0 ? (
                                  <div className="space-y-2 mt-2">
                                    {answerOptions[q.questionId].map(opt => (
                                      <div key={opt.optionId} className="flex items-center justify-between px-4 py-2 rounded border border-gray-300 bg-white">
                                        <span className="text-gray-800">{opt.optionText}</span>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                          <button className="p-1 rounded hover:bg-amber-50 text-amber-500" title="Sửa đáp án" onClick={() => handleOpenEditAnswerOption(opt)}>
                                            <PencilLine size={16} />
                                          </button>
                                          <button className="p-1 rounded hover:bg-red-50 text-red-500" title="Xóa đáp án" onClick={() => handleDeleteAnswerOption(opt)}>
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-gray-500">Không có đáp án nào.</div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        return (
                          <div key={q.questionId} className="bg-white rounded-xl shadow border border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-gray-900">Câu {idx + 1}: {q.questionText}</div>
                              <div className="flex items-center gap-2">
                                <button className="p-1 rounded hover:bg-amber-50 text-amber-500" title="Sửa câu hỏi" onClick={() => handleOpenEditSurveyQuestion(q)}>
                                  <PencilLine size={18} />
                                </button>
                                <button className="p-1 rounded hover:bg-red-50 text-red-500" title="Xóa câu hỏi" onClick={() => handleDeleteSurveyQuestion(q)}>
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 font-semibold mt-2">Loại: Khác</div>
                          </div>
                        );
                      }
                    })
                  ) : (
                    <div className="text-gray-500">Không có câu hỏi nào.</div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Modal tạo khảo sát */}
      {showCreateSurveyModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Tạo khảo sát mới</h3>
              <button onClick={() => setShowCreateSurveyModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateSurvey}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tiêu đề khảo sát</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={createSurveyForm.title}
                  onChange={e => setCreateSurveyForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Mô tả khảo sát</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={createSurveyForm.description}
                  onChange={e => setCreateSurveyForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>
              {createSurveyError && <div className="text-red-500 mb-2">{createSurveyError}</div>}
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setShowCreateSurveyModal(false)}>Hủy</button>
                <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700" disabled={createSurveyLoading}>
                  {createSurveyLoading ? 'Đang tạo...' : 'Tạo khảo sát'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal cập nhật khảo sát */}
      {showUpdateSurveyModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Cập nhật khảo sát</h3>
              <button onClick={() => setShowUpdateSurveyModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdateSurvey}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tiêu đề khảo sát</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={updateSurveyForm.title}
                  onChange={e => setUpdateSurveyForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Mô tả khảo sát</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={updateSurveyForm.description}
                  onChange={e => setUpdateSurveyForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>
              {updateSurveyError && <div className="text-red-500 mb-2">{updateSurveyError}</div>}
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setShowUpdateSurveyModal(false)}>Hủy</button>
                <button type="submit" className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-700" disabled={updateSurveyLoading}>
                  {updateSurveyLoading ? 'Đang cập nhật...' : 'Cập nhật khảo sát'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal thêm câu hỏi khảo sát */}
      {showAddSurveyQuestionModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Thêm câu hỏi khảo sát</h3>
              <button onClick={() => setShowAddSurveyQuestionModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSurveyQuestion}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nội dung câu hỏi</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={addSurveyQuestionForm.questionText}
                  onChange={e => setAddSurveyQuestionForm(f => ({ ...f, questionText: e.target.value }))}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Loại câu hỏi</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={addSurveyQuestionForm.questionType}
                  onChange={e => setAddSurveyQuestionForm(f => ({ ...f, questionType: e.target.value }))}
                  required
                >
                  <option value="text">Tự luận</option>
                  <option value="single choice">Chọn một đáp án</option>
                </select>
              </div>
              {addSurveyQuestionError && <div className="text-red-500 mb-2">{addSurveyQuestionError}</div>}
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setShowAddSurveyQuestionModal(false)}>Hủy</button>
                <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700" disabled={addSurveyQuestionLoading}>
                  {addSurveyQuestionLoading ? 'Đang tạo...' : 'Tạo câu hỏi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal cập nhật câu hỏi khảo sát */}
      {showEditSurveyQuestionModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Cập nhật câu hỏi khảo sát</h3>
              <button onClick={() => setShowEditSurveyQuestionModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <form onSubmit={handleEditSurveyQuestion}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nội dung câu hỏi</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={editSurveyQuestionForm.questionText}
                  onChange={e => setEditSurveyQuestionForm(f => ({ ...f, questionText: e.target.value }))}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Loại câu hỏi</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={editSurveyQuestionForm.questionType}
                  onChange={e => setEditSurveyQuestionForm(f => ({ ...f, questionType: e.target.value }))}
                  required
                >
                  <option value="text">Tự luận</option>
                  <option value="single choice">Chọn một đáp án</option>
                </select>
              </div>
              {editSurveyQuestionError && <div className="text-red-500 mb-2">{editSurveyQuestionError}</div>}
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setShowEditSurveyQuestionModal(false)}>Hủy</button>
                <button type="submit" className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-700" disabled={editSurveyQuestionLoading}>
                  {editSurveyQuestionLoading ? 'Đang cập nhật...' : 'Cập nhật câu hỏi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal thêm đáp án */}
      {showAddAnswerOptionModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Thêm đáp án</h3>
              <button onClick={() => setShowAddAnswerOptionModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddAnswerOption}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nội dung đáp án</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={addAnswerOptionForm.optionText}
                  onChange={e => setAddAnswerOptionForm(f => ({ ...f, optionText: e.target.value }))}
                  required
                />
              </div>
              {addAnswerOptionError && <div className="text-red-500 mb-2">{addAnswerOptionError}</div>}
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setShowAddAnswerOptionModal(false)}>Hủy</button>
                <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700" disabled={addAnswerOptionLoading}>
                  {addAnswerOptionLoading ? 'Đang thêm...' : 'Thêm đáp án'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal cập nhật đáp án */}
      {showEditAnswerOptionModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Cập nhật đáp án</h3>
              <button onClick={() => setShowEditAnswerOptionModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <form onSubmit={handleEditAnswerOption}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nội dung đáp án</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={editAnswerOptionForm.optionText}
                  onChange={e => setEditAnswerOptionForm(f => ({ ...f, optionText: e.target.value }))}
                  required
                />
              </div>
              {editAnswerOptionError && <div className="text-red-500 mb-2">{editAnswerOptionError}</div>}
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setShowEditAnswerOptionModal(false)}>Hủy</button>
                <button type="submit" className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-700" disabled={editAnswerOptionLoading}>
                  {editAnswerOptionLoading ? 'Đang cập nhật...' : 'Cập nhật đáp án'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CampaignManagement;