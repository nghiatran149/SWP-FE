import axios from 'axios';

const BASE_URL = 'http://drugpreventionsystem.somee.com/api';

const api = axios.create({
    baseURL: BASE_URL,

});

export default api;
export { BASE_URL };
