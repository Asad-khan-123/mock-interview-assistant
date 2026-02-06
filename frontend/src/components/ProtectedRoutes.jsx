import {Navigate} from 'react-router-dom';

export default function ProtectedRoutes({children}) {
    const isLoggedIn = window.localStorage.getItem("token");  
    if(!isLoggedIn){
        return <Navigate to="/login" replace />;
    }

    return children;
}