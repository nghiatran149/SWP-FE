import api from './api';

// Function to verify email using token
export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/User/verify?token=${token}`);
    return {
      success: true,
      data: response.data,
      message: response.data.messages?.[0] || 'Email verified successfully'
    };
  } catch (error) {
    console.error('Email verification error:', error);
    return {
      success: false,
      error: error.response?.data?.messages?.[0] || 'Email verification failed',
      status: error.response?.status
    };
  }
};

// Function to resend verification email
export const resendVerificationEmail = async (email) => {
  try {
    const response = await api.post('/User/resend-verification', { email });
    return {
      success: true,
      data: response.data,
      message: response.data.messages?.[0] || 'Verification email sent successfully'
    };
  } catch (error) {
    console.error('Resend verification error:', error);
    return {
      success: false,
      error: error.response?.data?.messages?.[0] || 'Failed to resend verification email',
      status: error.response?.status
    };
  }
};
