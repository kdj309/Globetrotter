import api from "../../api";

export const getOptions=async (destinationId:string) => {
    const response = await api.get(`/destinations/${destinationId}/options`);
    return response.data;
  }
export  const getRandomDestinations= async () => {
    const response = await api.get(`/destinations/random`);
    return response.data;
  }
export  const verifyAnswer=async (destinationId:string, answer:string) => {
    const response = await api.get(`/destinations/${destinationId}/verify/${answer}`);
    return response.data;
  }