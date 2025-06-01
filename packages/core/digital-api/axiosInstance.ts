import axios, { type CreateAxiosDefaults } from 'axios';

export const axiosOptions = {
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
} satisfies CreateAxiosDefaults;

export const axiosInstance = axios.create(axiosOptions);
