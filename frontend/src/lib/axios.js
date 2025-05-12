import axios from "axios";

//here we are creating instance so we can use it entire application
export const axiosInstance = axios.create({
    baseURL : import.meta.env.MODE==="development" ? "http://localhost:5001/api" : "/api",
    withCredentials:true, //this is how we send cookies on evry single request
})

