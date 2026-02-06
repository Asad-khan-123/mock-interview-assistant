import {Navigate} from 'react-router-dom';

export default function PublicRoute({children}) {
  const token = window.localStorage.getItem("token");

  if(token){
      return <Navigate to="/" replace />;
  }
  return children;
}