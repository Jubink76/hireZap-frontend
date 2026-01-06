import {toast as toastify} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notify = {
    success : (message)=>toastify.success(message,{position: 'top-right'}),
    error : (message)=>toastify.error(message, {position: 'top-right'}),
    info : (message) =>toastify.info(message,{position:'top-right'}),
    warning : (message) => toastify.warning(message,{position:'top-right'})
};