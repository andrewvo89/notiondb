import { AxiosInstance } from 'axios';

let axios: AxiosInstance | undefined;

function setAxiosInstance(instance: AxiosInstance): void {
  axios = instance;
}

function getAxiosInstance(): AxiosInstance {
  if (!axios) {
    throw new Error('Axios instance has not been instantiated yet');
  }
  return axios;
}

export { getAxiosInstance, setAxiosInstance };
