import { useEffect, useState, ReactNode, createContext, useContext, Dispatch, SetStateAction } from 'react';
import { LocalStorage } from '../utils';
import { setGlobalEntity, setglobalBranch } from '../utils/axios';
import { getBranchByEntity, requestHandler } from '../utils/api';

class userType {
  user_id: number | null = null;
  user_name: string = '';
  full_name: string = '';
  role_name: string = '';
  is_superadmin: 0 | 1 = 0;
  is_admin: 0 | 1 = 0;
  is_staff: 0 | 1 = 0;
  branch_id: number | null = null;
  entity_id: number | null = null;
  additional_info: 0 | 1 = 0;
  imageFile:string | null = null;
  s3_cloudfront_url: string | null = null;
  entityImage:string | null = null;
  self_all: string | null = null;
  level: number | null = null;
  is_external: 0 | 1 = 0;
}

interface AuthContextType {
  user: userType | null;
  signin: (user: userDetails, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
  pageAccess: pageAccessType[];
  branchAccess: branchAccessType[];
  token: string;
  currentBranch: number | null;
  setcurrentBranch: Dispatch<SetStateAction<number | null>>;
  currentEntity: number | null;
  setccurrentEntity: Dispatch<SetStateAction<number | null>>;
  setUser: Dispatch<SetStateAction<userType | null>>;
  setpageAccess: Dispatch<SetStateAction<pageAccessType[]>>;
  setbranchAccess: Dispatch<SetStateAction<branchAccessType[]>>;
  settoken: Dispatch<SetStateAction<string>>;
}

class extraActionsType {
  action_id:number = 0;
  action_name:string ='';
  action_desc:string ='';

}

class pageAccessType {
  url: string = '';
  access_to_add: 0 | 1 = 0;
  access_to_update: 0 | 1 = 0;
  access_to_delete: 0 | 1 = 0;
  access_to_export: 0 | 1 = 0;
  extra_actions:extraActionsType[]=[]
}

class branchAccessType {
  branch_id: number | null = null;
  name: string = '';
  is_active?: 0 | 1
}

export class userDetails {
  user: userType = new userType();
  pageAccess: pageAccessType[] = [];
  branchAccess: branchAccessType[] = [];
  token: string = '';
}

let AuthContext = createContext<AuthContextType>({
  user: new userType(),
  signin: () => { },
  signout: () => { },
  pageAccess: [],
  branchAccess: [],
  token: '',
  currentBranch: null,
  setcurrentBranch: () => { },
  currentEntity: null,
  setccurrentEntity: () => { },
  setUser: () => { },
  setpageAccess: () => { },
  setbranchAccess: () => { },
  settoken: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  let [user, setUser] = useState<userType | null>(null);
  let [pageAccess, setpageAccess] = useState<pageAccessType[]>([]);
  let [branchAccess, setbranchAccess] = useState<branchAccessType[]>([]);
  let [token, settoken] = useState<string>('');
  const [currentBranch, setcurrentBranch] = useState<number | null>(null)
  const [currentEntity, setccurrentEntity] = useState<number | null>(null)
  const [render, setrender] = useState(true)


  let signin = (userDetails: userDetails, callback: VoidFunction) => {
    setUser(userDetails.user);
    setpageAccess(userDetails.pageAccess);
    setbranchAccess(userDetails.branchAccess);
    settoken(userDetails.token);
    setcurrentBranch(userDetails.user.branch_id);
    setccurrentEntity(userDetails.user.entity_id);

    LocalStorage.clear();
    LocalStorage.set('users', userDetails.user);
    LocalStorage.set('pageAccess', userDetails.pageAccess);
    LocalStorage.set('branchAccess', userDetails.branchAccess);
    localStorage.setItem('token', userDetails.token);

    callback();
  };

  const signout = (callback: VoidFunction) => {
    // console.log('signout');
    LocalStorage.clear();
    setGlobalEntity(null);
    setglobalBranch(null);
    setUser(null);
    setpageAccess([]);
    setbranchAccess([]);
    setcurrentBranch(null)
    setccurrentEntity(null)
    settoken('');
    callback();
  };

  useEffect(() => {
    if (LocalStorage.get('users') && LocalStorage.get('pageAccess') && LocalStorage.get('branchAccess') && localStorage.getItem('token')) {
      setUser(LocalStorage.get('users'));
      setpageAccess(LocalStorage.get('pageAccess'));
      setbranchAccess(LocalStorage.get('branchAccess'));
      settoken(localStorage.getItem('token') || '');
      setcurrentBranch(LocalStorage.get('users').branch_id)
      setccurrentEntity(LocalStorage.get('users').entity_id)
    }
  }, [])

  useEffect(() => {
    setrender(false);
    setTimeout(() => {
      setrender(true)
    }, 1);
  }, [currentBranch, currentEntity]);

  useEffect(() => {
    setglobalBranch(currentBranch);
  }, [currentBranch])

  useEffect(() => {
    setGlobalEntity(currentEntity);
  }, [currentEntity])

  useEffect(() => {
    requestHandler(
      async () => {
        return await getBranchByEntity();
      },
      (data) => {
        if (data.success) {
          setbranchAccess(data.data)
        }
      },
      (errorMessage) => {
        console.log(errorMessage);
        
      }
    );
  }, [currentEntity])

  useEffect(() => {
    if (user?.entity_id)
      setGlobalEntity(user.entity_id)
  }, [user])

  // useEffect(() => {
  //   if(user == null){
  //     signout(()=>{navigate('/login')})
  //   }
  // },[user])


  let value = { user, signin, signout, pageAccess, branchAccess, token, currentBranch, setcurrentBranch, currentEntity, setccurrentEntity, setUser, setpageAccess, setbranchAccess, settoken };

  return (
    <AuthContext.Provider value={value}>{render && children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// const fakeAuthProvider = {
//     isAuthenticated: false,

//     login(callback: VoidFunction) {
//         fakeAuthProvider.isAuthenticated = true;
//         setTimeout(callback, 100); // fake async
//     },

//     signout(callback: VoidFunction) {
//         fakeAuthProvider.isAuthenticated = false;
//         setTimeout(callback, 100);
//     },
// };

// export { fakeAuthProvider };


// data
// .filter((roles) => role.role_name !== 'super Admin')
// .map(role)=>
//   { return <option value={role.role_id}>{role.role_name}</option> }