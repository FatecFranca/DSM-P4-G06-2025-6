import axios from "axios";

const api = axios.create({
  baseURL: "http://20.57.55.218:5000/smartlocker/api/v1",
});
  
export default api; 
