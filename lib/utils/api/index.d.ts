declare let axios: import("axios").AxiosInstance;
declare const BACK_OFF_TIME: number;
declare const MAX_RETRIES = 5;
export { BACK_OFF_TIME, MAX_RETRIES };
export default axios;
