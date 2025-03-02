import api from "../../api";

export const createChallenge=async (username:string) => {
    const response = await api.get(`/users/${username}/challenge`);
    return response.data;
  }
export  const updateScore=async (username:string, correct:string, destinationId:string) => {
    const response = await api.put(`/users/${username}/score`, {
      correct,
      destinationId
    });
    return response.data;
  }
export  const getProfile=async (username:string) => {
    const response = await api.get(`/users/${username}`);
    return response.data;
}
export const registerUser = async (username:string) => {
    const response = await api.post(`/users`, { username });
    return response.data;
  };