import * as axios_lib from 'axios';
// import { toastError } from './SweetAlert';
// import { Logout } from '../Components/General/Header';
// import { EntityState } from '../signals/entity';
// import { isLoading } from '../signals/loading';
// import { sessionExpired } from '../signals/session';

// export const baseURL = import.meta.env.PROD ? 'https://act-cao-server.vercel.app'
// : import.meta.env.VITE_NODE_ENV == 'network' ? 'http://192.168.0.106:5000' : 'http://localhost:5000';

export const baseURL = import.meta.env.VITE_BACKEND_URL ;

export const axios = axios_lib.default.create({
  baseURL,
  timeout: 100000,
});

export var globalEntity : number | undefined | null ;
export const setGlobalEntity = (value : number | undefined | null) =>{
  globalEntity = value;
}

export var globalBranch : number | undefined | null ;
export const setglobalBranch = (value : number | undefined | null) =>{
    globalBranch = value;
}

axios.interceptors.request.use((config) => {

if (globalEntity !== null && globalBranch !== null) {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return {
    ...config,
    params: {
      ...config.params,
      entity_id: globalEntity,
      branch_id: globalBranch,
    },
  };
} else {
  return Promise.reject(new Error('globalEntity or globalBranch is null'));
}
});


