import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const {user , pageAccess} = useAuth();
  const location = useLocation();
  
  if (!user) {
    // setTimeout(() => {
    //   return <Navigate to="/login" state={{ from: location }} replace />;
    // }, 1);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  if(!pageAccess.map(page => {return page.url}).includes(location.pathname) && location.pathname != '/login'){
    setTimeout(() => {
      return <div className="h-[90vh]w-100 flex items-center justify-center py-10">You have no access to this page.</div>
    }, 1);
  } 
    
  return children;

}