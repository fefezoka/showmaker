import {
  ToastContainer as ToastContainerPrimitive,
  toast as ToastPrimitive,
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastContainer = () => (
  <ToastContainerPrimitive
    position="bottom-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    draggable
    pauseOnHover
    theme="light"
  />
);

export const toast = ToastPrimitive;
