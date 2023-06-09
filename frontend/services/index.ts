import { LoginData } from '@/typing';
import { api, config } from '../config';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { getAccessToken, getRefreshToken, setAccessToken } from '@/store/user';

export const convertToQueryStr = (query: any) => {
  let result = '';
  for (const key in query) {
    result += `&${key}=${query[key]}`;
  }
  return result.replace('&', '?');
};

export const client = axios.create({
  baseURL: config.serverURL,
});

const refresh = async () => {
  const response = await client.post(api.auths + '/refresh', {
    refresh_token: getRefreshToken(),
  });
  const accessToken = response.data.data.access_token;
  setAccessToken(accessToken);
  // client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  return accessToken;
};
client.interceptors.request.use(
  async (config) => {
    let currentDate = new Date();

    let accessToken = getAccessToken();
    if (!accessToken) {
      return config;
    }

    let decodedToken: any = jwt_decode(accessToken);
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      const accessToken = await refresh();
      config.headers['Authorization'] = 'Bearer ' + accessToken;
    } else {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
