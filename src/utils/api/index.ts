import axiosPackage from 'axios';

/** Create base settings for Axios */
const axios = axiosPackage.create({
  baseURL: 'https://api.notion.com/v1',
  headers: {
    'Notion-Version': '2021-05-13',
  },
});

/**
 * Rate Limits
 * Rate-limited requests will return a "rate_limited" error code (HTTP response status 429).
 * The rate limit for incoming requests is an average of 3 requests per second.
 * Some bursts beyond the average rate are allowed.
 * https://developers.notion.com/reference/errors
 */
const MAX_CALLS_PER_SECOND = 3;

/** Amount of time to wait before trying the failed API call again. */
const BACK_OFF_TIME = 1000 / MAX_CALLS_PER_SECOND;

/** Maximum amount of tries for an API action before throwing an error. */
const MAX_RETRIES = 5;

export { axios, BACK_OFF_TIME, MAX_RETRIES };
