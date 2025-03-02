import api from "../../api";

export const startGame=async (username:string) => {
    const response = await api.post(`/games/start`, { username });
    return response.data;
  }

export  const submitAnswer=async (gameId:string, answer:string,destination:string) => {
    const response = await api.post(`/games/${gameId}/answer`, { answer,destination });
    return response.data;
  }