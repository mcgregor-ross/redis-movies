import axios from "axios";
import queryString from "query-string";

import apiConfig from "./apiConfig";

axios.defaults.headers.post["Content-Type"] = "application/json";

const axiosClient = axios.create({
    baseURL: apiConfig.baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
    paramsSerializer: (params) => queryString.stringify({ ...params, api_key: apiConfig.apiKey }),
});

const javaAxiosClient = axios.create({
    baseURL: apiConfig.javaServiceUrl,
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    },
    paramsSerializer: (params) => queryString.stringify({ ...params }),
});

axiosClient.interceptors.request.use(async (config) => {
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }

        return response;
    },
    (error) => {
        throw error;
    }
);

// export default axiosClient;
export { axiosClient, javaAxiosClient };
