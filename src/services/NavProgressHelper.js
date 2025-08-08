import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import './NavProgressStyling.css'
NProgress.configure({ showSpinner: false, minimum: 0.2 });

export const progressBarStart = () => NProgress.start();
export const progressBarStop = () => NProgress.done();