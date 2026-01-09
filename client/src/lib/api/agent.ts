import axios from "axios";
import { store } from "../stores/store";
import { toast } from "react-toastify";
import { router } from "../../app/router/Routes";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // cho phép trình duyệt lưu cookie response từ api về
}); // tạo axios instance

agent.interceptors.request.use((config) => {
    store.uiStore.isBusy();
    return config;
}); // set giá trị của isLoading thành true

agent.interceptors.response.use(
    async (response) => {
        await sleep(1000);
        store.uiStore.isIdle();
        return response;
    }, // khi api trả về thành công
    async (error) => {
        await sleep(1000);
        store.uiStore.isIdle();

        const { status, data } = error.response;
        switch (status) {
            case 400:
                if (data.errors) {
                    const modalStateErrors = [];

                    for (const key in data.errors) {
                        modalStateErrors.push(data.errors[key]);
                    }

                    throw modalStateErrors.flat();
                } else {
                    toast.error(data);
                }
                break;
            case 401:
                toast.error("Unauthorized");
                break;
            case 404:
                router.navigate("/not-found");
                break;
            case 500:
                router.navigate("/server-error", { state: { error: data } });
                break;
            default:
                break;
        }

        return Promise.reject(error); // reject để nơi gọi có thể catch đc lỗi
    } // khi api trả về lỗi
);

export default agent;
