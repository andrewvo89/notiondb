import axiosPackage from 'axios';

let axios = axiosPackage.create({
  baseURL: 'https://api.notion.com/v1',
  headers: {
    'Notion-Version': '2021-05-13',
  },
});

const MAX_CALLS_PER_SECOND = 3;

const BACK_OFF_TIME = 1000 / MAX_CALLS_PER_SECOND;

export { BACK_OFF_TIME };

export default axios;
