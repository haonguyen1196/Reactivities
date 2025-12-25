import axios from "axios";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
}); // tạo axios instance

agent.interceptors.response.use(async (response) => {
    try {
        await sleep(1000); // interceptor 1s trước khi trả response về
        return response;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
});

export default agent;
