import axios from "axios";
import { store } from "../stores/store";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
}); // tạo axios instance

agent.interceptors.request.use((config) => {
    store.uiStore.isBusy();
    return config;
}); // set giá trị của isLoading thành true

agent.interceptors.response.use(async (response) => {
    try {
        await sleep(1000); // interceptor 1s trước khi trả response về
        return response;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    } finally {
        store.uiStore.isIdle(); // set giá trị của isLoading thành false;
    }
});

export default agent;
