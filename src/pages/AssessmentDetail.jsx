import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'http://drugpreventionsystem.somee.com/api';

const AssessmentDetail = () => {
  const { surveyId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);

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

  const handleOptionChange = (idx) => {
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
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
                <button
                  onClick={handleNext}
                  disabled={answers[current] === null}
                  className={`py-2 px-8 rounded-lg font-medium transition-colors duration-200 ${answers[current] === null ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                >
                  Tiếp theo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetail;
