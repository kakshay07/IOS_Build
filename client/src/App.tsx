import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/Login/Login';
import { RequireAuth } from './components/AuthMiddleware';
import MainLayout from './components/MainLayout/MainLayout';
import Demo from './pages/Demo';
import About from './pages/About';
import Profile from './pages/Profile';
import { useEffect, useRef, useState } from 'react';
import { axios } from './utils/axios';
import Loader from './components/Loader';
import Entity from './pages/Masters/Entity';
import Roles from './pages/Masters/Roles';
import Pages from './pages/Masters/Pages';
import Branch from './pages/Masters/Branch';
import NotFound from './pages/NotFound';
import Users from './pages/Masters/Users';
import UploadImage from './pages/UploadImage';
import ChangePassword from './pages/changePassword';
import Designation from './pages/Masters/Designation';
import {TypeMaster} from './pages/Masters/Type';
import { toastError } from './utils/SweetAlert';
import Home from './pages/Home';
import BarcodeDemo from './pages/BarcodeDemo';
import Vendor from './pages/Masters/Vendor';
import AdditionalFeature from './pages/Masters/AdditionalFeature';
import SendTestEmail from './pages/SendTestEmail';
import MessageTemplates from './pages/Masters/MessageTemplates';

export default function App() {
    const [loading, setloading] = useState(0);
    const { signout } = useAuth();
    const navigate = useNavigate();
    const interceptorsSet = useRef(false);

    useEffect(() => {
        if (!interceptorsSet.current) {
            axios.interceptors.request.use(
                (config) => {
                    setloading(prev => (prev+1));
                    return config;
                },
                (error) => {
                    return Promise.reject(error);
                }
            );

            axios.interceptors.response.use(
                (res) => {
                    setloading(prev => (prev - 1));
                    // console.log(res, 'axios response');
                    return res;
                },
                (error) => {
                    setloading(prev => (prev - 1));
                    if (
                        error.response.status == 500 &&
                        error.response.data.code == 120 &&
                        window.location.pathname != '/login'
                    ) {
                        signout(() => {
                            navigate('/login');
                        });
                        toastError.fire({
                            title:  error.response.data.message,
                        });
                    }
                     else {
                        return Promise.reject(error);
                    }
                }
            );

            interceptorsSet.current = true;
        }
    }, []);

    return (
        <>
            {loading > 0 && <Loader></Loader>}
            {/* <Nav/> */}
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about" element={<About />} />

                <Route element={<MainLayout />}>
                    <Route
                        path="/demo"
                        element={
                            <RequireAuth>
                                <Demo />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <RequireAuth>
                            <Home />
                            </RequireAuth> 
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <RequireAuth>
                                <div>settings</div>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <RequireAuth>
                                <Profile />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/entity"
                        element={
                            <RequireAuth>
                                <Entity />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/roles"
                        element={
                            <RequireAuth>
                                <Roles />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/pages"
                        element={
                            <RequireAuth>
                                <Pages />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/branch"
                        element={
                            <RequireAuth>
                                <Branch />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <RequireAuth>
                                <Users />
                            </RequireAuth>
                        }
                    />
                    <Route path="/uploadImage" element={<UploadImage />} />
                    <Route
                        path="/changePassword"
                        element={
                            <RequireAuth>
                            <ChangePassword />
                            </RequireAuth>
                        }
                    ></Route>

                    <Route
                        path="/designation"
                        element={
                            <RequireAuth>
                                <Designation />
                            </RequireAuth>
                        }
                    ></Route>

                    <Route
                        path="/vendor"
                        element={
                            <RequireAuth>
                                <Vendor/>
                            </RequireAuth>
                        }
                    ></Route>

                    <Route
                        path="/type"
                        element={
                            <RequireAuth>
                                <TypeMaster />
                            </RequireAuth>
                        }
                    ></Route>

                    <Route
                        path="/barcodeDemo"
                        element={
                            // <RequireAuth>
                                <BarcodeDemo />
                            // </RequireAuth>
                        }
                    ></Route>

                    <Route
                        path='/additionalfeature'
                        element={
                            <RequireAuth>
                                <AdditionalFeature />
                            </RequireAuth>
                        }
                    ></Route>
                    <Route 
                        path='/messageTemplates'
                        element={
                            <RequireAuth>
                                <MessageTemplates />
                            </RequireAuth>
                        }
                    ></Route>

                    <Route 
                        path='/sendTestEmail'
                        element={
                            <RequireAuth>
                                <SendTestEmail />
                            </RequireAuth>
                        }
                    ></Route>

                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}
