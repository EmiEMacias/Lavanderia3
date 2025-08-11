import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
export const request = axios.create({
baseURL:"https://tx4rvp61-5000.usw3.devtunnels.ms/"
})

request.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default request;