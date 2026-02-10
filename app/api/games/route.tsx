import axios from "axios";

const API_KEY = "15c7641dff154a93b46efb7ec93caaa6";
const BASE_URL = "https://api.rawg.io/api";

export const fetchGames = async (params: any = {}) => {
  const response = await axios.get(`${BASE_URL}/games`, {
    params: {
      key: API_KEY,
      ...params,
    },
  });
  return response.data;
};

export const fetchGenres = async () => {
  const response = await axios.get(`${BASE_URL}/genres`, {
    params: {
      key: API_KEY,
    },
  });
  return response.data.results; // خروجی: آرایه ژانرها {id, name, slug}
};
