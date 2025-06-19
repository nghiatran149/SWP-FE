import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'http://drugpreventionsystem.somee.com/api';

function getUserId() {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const userData = JSON.parse(userInfo);
      return userData.userId || null;
    } catch (e) {
      return null;
    }
  }
  return null;
}

const AssessmentDetail = () => {
  const { surveyId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [started, setStarted] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [startError, setStartError] = useState(null);
  const [responseId, setResponseId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BASE_URL}/Survey/${surveyId}/questions-with-options`);
        if (res.data && res.data.data) {
          setQuestions(res.data.data);
          setAnswers(Array(res.data.data.length).fill(null));
        } else {
          setQuestions([]);
        }
      } catch (err) {
        setError('Không thể tải câu hỏi.');
      } finally {
        setLoading(false);
      }
    };
    if (surveyId) fetchQuestions();
  }, [surveyId]);

  const handleStart = async () => {
    setStartLoading(true);
    setStartError(null);
    const userId = getUserId();
    if (!userId) {
      setStartError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      setStartLoading(false);
      return;
    }
    try {
      const payload = { userId, surveyId };
      console.log('Gửi start-session:', payload);
      const res = await axios.post(`${BASE_URL}/UserSurveyResponse/start-session`, payload);
      console.log('Kết quả start-session:', res.data);
      if (res.data && res.data.data && res.data.data.responseId) {
        setResponseId(res.data.data.responseId);
      }
      setStarted(true);
    } catch (err) {
      setStartError('Không thể bắt đầu làm bài đánh giá.');
      console.log('Lỗi start-session:', err);
    } finally {
      setStartLoading(false);
    }
  };

  const handleOptionChange = (idx) => {
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
  };

  const handleNext = async () => {
    if (!responseId) {
      alert('Không tìm thấy responseId. Vui lòng tải lại trang.');
      return;
    }
    const question = questions[current];
    const optionIdx = answers[current];
    if (question && optionIdx !== null && question.options[optionIdx]) {
      const answerPayload = {
        responseId,
        questionId: question.questionId,
        optionId: question.options[optionIdx].optionId
      };
      console.log('Gửi save-answer:', answerPayload);
      try {
        const res = await axios.post(`${BASE_URL}/UserSurveyResponse/save-answer`, answerPayload);
        console.log('Kết quả save-answer:', res.data);
      } catch (err) {
        console.log('Lỗi save-answer:', err);
      }
    }
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // Hoàn thành: gọi API lấy kết quả và chuyển trang
      try {
        const res = await axios.post(`${BASE_URL}/UserSurveyResponse/complete/${responseId}`);
        console.log('Kết quả complete:', res.data);
        if (res.data && res.data.data) {
          navigate(`/assessment-result/${responseId}`);
        } else {
          alert('Không lấy được kết quả đánh giá.');
        }
      } catch (err) {
        alert('Có lỗi khi hoàn thành bài đánh giá.');
        console.log('Lỗi complete:', err);
      }
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const percent = questions.length ? Math.round(((current + 1) / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">Bài đánh giá ASSIST</h1>
        <p className="text-center text-gray-600 mb-8">
          ASSIST (Alcohol, Smoking and Substance Involvement Screening Test) là công cụ sàng lọc được phát triển bởi Tổ chức Y tế Thế giới (WHO) để đánh giá mức độ nguy cơ liên quan đến việc sử dụng các chất gây nghiện.
        </p>
        <div className="bg-gray-100 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">Hướng dẫn</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Bài đánh giá này gồm nhiều câu hỏi về việc sử dụng các chất gây nghiện.</li>
            <li>Hãy trả lời trung thực để nhận được kết quả chính xác nhất.</li>
            <li>Thông tin của bạn sẽ được bảo mật hoàn toàn.</li>
            <li>Thời gian hoàn thành khoảng 5-10 phút.</li>
          </ul>
        </div>
        {!started ? (
          <div className="flex flex-col items-center">
            {startError && <div className="mb-4 text-red-600 font-medium">{startError}</div>}
            <button
              onClick={handleStart}
              className="bg-teal-600 text-white py-3 px-10 rounded-lg font-medium text-lg hover:bg-teal-700 transition-colors duration-200 shadow-md"
              disabled={startLoading}
            >
              {startLoading ? 'Đang bắt đầu...' : 'Bắt đầu làm bài đánh giá'}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            {loading ? (
              <div className="text-center text-gray-500">Đang tải câu hỏi...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : questions.length === 0 ? (
              <div className="text-center text-gray-500">Không có câu hỏi nào.</div>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Câu hỏi {current + 1} / {questions.length}</span>
                  <span className="text-gray-500 text-sm">{percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div className="bg-teal-600 h-2 rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
                </div>
                <div className="mb-6">
                  <p className="text-lg font-semibold mb-4">{questions[current].questionText}</p>
                  <div className="space-y-3">
                    {questions[current].options.map((opt, idx) => (
                      <label key={opt.optionId} className="flex items-center bg-gray-50 border rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-100 transition">
                        <input
                          type="radio"
                          name={`q${current}`}
                          checked={answers[current] === idx}
                          onChange={() => handleOptionChange(idx)}
                          className="form-radio h-5 w-5 text-teal-600 mr-3"
                        />
                        <span className="text-gray-800">{opt.optionText}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrev}
                    disabled={current === 0}
                    className={`py-2 px-6 rounded-lg font-medium transition-colors duration-200 ${current === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Quay lại
                  </button>
                  {current === questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      disabled={answers[current] === null}
                      className={`py-2 px-8 rounded-lg font-medium transition-colors duration-200 ${answers[current] === null ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                    >
                      Hoàn thành
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={answers[current] === null}
                      className={`py-2 px-8 rounded-lg font-medium transition-colors duration-200 ${answers[current] === null ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                    >
                      Tiếp theo
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentDetail;
