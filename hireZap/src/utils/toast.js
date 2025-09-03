import {toast as toastify} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notify = {
    success : (message)=>toastify.success(message,{position: 'top-right'}),
    error : (message)=>toastify.error(message, {position: 'top-right'})
};