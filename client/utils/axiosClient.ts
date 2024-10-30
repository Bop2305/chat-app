import axios from "axios";

const baseURL = process.env.API_URL ?? "http://localhost:8000";

const axiosClient = axios.create({
  baseURL,
  headers: {
    Accept: "*",
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    /* ---- 'Accept': 'application/json',
    'Authorization': this.token, ---- */
    config.headers["Accept"] = "application/json";

    let token = localStorage.getItem("token");
    token = "Bearer " + token;

    config.headers.Authorization = token;

    return config;
  },
  (error) => {
    console.log("Request error: ", error);
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    console.log("Intercepting the response before sending it", response);
    return response;
  },
  (error) => {
    console.log("Answer Error: ", error.response);

    if (error.response.status == 401) {
      // console.log('Make a new request for the refresh route!')
      // axios.post('http://localhost:8000/api/refresh')
      //   .then(response => {
      //     console.log('Refresh success! ')
      //     console.log(response)
      //     localStorage.setItem("token", response.data)
      //     window.location.reload()
      //   })
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    }
    // return Promise.reject(error);
    return error.response;
  },
);

export default axiosClient;
