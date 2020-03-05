import axios from "axios";

const userService = {};
const baseUrl = "https://localhost:8080/users";

userService.signup = (user) => {
    return axios.post(`${baseUrl}/signup`, user);
};



export default userService;
