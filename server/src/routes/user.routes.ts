import { Router, Response } from 'express';
import { User } from '../models/user.models';
import { AuthenticatedRequest, authMiddleware } from '../middlewares/auth.middlewares';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import multer from 'multer';
export const userRouter = Router();
const upload = multer();

interface FileMetaData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

userRouter.post(
    '/login',
    asyncHandler(async (req, res) => {
        const { user_name, password } = req.body;
        const response = await User.login({ user_name, password });
        if (response.msg) {
            res.json(new ApiResponse(401, {}, response.msg));
        } else {
            res.json(new ApiResponse(200, response));
        }
    })
); 

userRouter.post('/check-active-session',
  asyncHandler(async (req, res) => {
    const { user_name} = req.body;
    const hasActiveSession = await User.checkSession({ user_name});
    if (hasActiveSession) {
      res.json({ hasActiveSession: true });
    } else {
      res.json({ hasActiveSession: false });
    }
})
);

userRouter.post('/force-logout',
  asyncHandler(async (req, res) => {
    const { user_name} = req.body;
    const logout = await User.forceLogout({ user_name });
    if (logout) {
      res.json(new ApiResponse(200,{},'success'));
    } else {
      res.json(new ApiResponse(400,{}));
    }
})
);

userRouter.post('/logout',
  asyncHandler(async (req, res) => {
    const { user_name,entity_id} = req.body;
    const logout = await User.Logout({ user_name,entity_id:entity_id });
    if (logout) {
      res.json(new ApiResponse(200,{},'success'));
    } else {
      res.json(new ApiResponse(400,{}));
    }
})
);

userRouter.use(authMiddleware);

userRouter.get(
  '/',
  asyncHandler(
      async (
      req: AuthenticatedRequest<
        unknown,
        unknown,
        unknown,
        { entity_id: string; branch_id: number; user_name?: string; limit?: number; page?:number;role_id?:number }
      >,
      res: Response
    ) => {
      const data = await User.getUserByEntityAndBranch(
        req.query.entity_id,
        req.query.branch_id,
        req.query.user_name,
        req.query.page ,
        req.query.limit,
        req.query.role_id ,
        req.user
      );
      res.json(new ApiResponse(200 , data.data));
    }
  )
  
);

userRouter.post('/',
  upload.fields([{ name: 'ProfileImg' }]),
   asyncHandler(async (req: AuthenticatedRequest<
  unknown,
  unknown,
  {
    data:{
    user_name : string,
    role_id : number,
    user_password : string,
    full_name:string,
    desig_id:number,

  }
    
  },
  {entity_id:number , branch_id:number}
  
>, res: Response) => {
  const files = req.files as {ProfileImg?: FileMetaData[]};
  const profileImg = files.ProfileImg?.[0];
  // const key_data = JSON.parse(String(req.body.data));
  const {entity_id , branch_id} = req.query;
  const cr_by=req.user.user_id;
  const {user_name , role_id , user_password,full_name, desig_id} =JSON.parse(String( req.body.data));

  const data = await User.addUser({user_name , role_id , user_password ,full_name, entity_id : Number(entity_id) , branch_id  : Number(branch_id) , desig_id,imageFile:profileImg,cr_by:cr_by});
  if(data){
    res.json(new ApiResponse(200 , {} , 'User added successfully'));
  }else{
    res.json(new ApiResponse(400 , {} , 'User name already exists'));
  }
}));

userRouter.put('/',
  upload.fields([{ name: 'ProfileImg' }]), asyncHandler(async (req: AuthenticatedRequest<
  unknown,
  unknown,

 { 
  data:{
    user_name : string,
    role_id : number,
    user_password : string,
    full_name:string,
    desig_id:number,
    user_id:number,
    user_active: 0 | 1

  }}
    ,
  {entity_id:number , branch_id:number}
  >, res: Response) => {
    const files = req.files as {ProfileImg?: FileMetaData[]};
    const profileImg = files.ProfileImg?.[0];
  const {user_name , role_id,full_name,user_id,desig_id,user_active,user_password} = JSON.parse(String( req.body.data));
  const {entity_id,branch_id} = req.query;
  const mo_by=req.user.user_id;
  await User.updateUser({user_name , role_id ,full_name, entity_id : Number(entity_id),user_id,user_active,desig_id,mo_by:mo_by,user_password:user_password ,branch_id,imageFile:profileImg});
  res.json(new ApiResponse(200,{}, 'Updated successfully'))
}));

userRouter.put('/changePassword', asyncHandler(async (req: AuthenticatedRequest<
  unknown, unknown, {user_password : string} , {entity_id : number , branch_id : number}>, res: Response) => {
  const{user_password}=req.body;
  const {entity_id,branch_id}=req.query;
  const {user_name} = req.user;
  const data = await User.changePassword({entity_id:Number(entity_id),user_name,user_password,branch_id : Number(branch_id)});
  if(data){
    res.json(new ApiResponse(200,{}, ' Password updated successfully'));
  }else {
    throw new Error('Failed to update')
  }
}));

// 

// userRouter.post('/profileImg',upload.fields([{ name: 'ProfileImg' }]),
// { data:{
//   user_name : string,
//   role_id : number,
//   user_password : string,
//   full_name:string,
//   desig_id:number,
//   user_id:number,
//   user_active: 0 | 1

// }}
// )


userRouter.post(
  '/profileImg',
  upload.fields([{ name: "ProfileImg" }]),
  asyncHandler(
    async (
      req: AuthenticatedRequest<
        unknown,
        unknown,
        {
          data: {
            user_name: string;
            user_id: number;
            entity_id: number;
            branch_id: number;
            oldImgUrl: string;
          };
        },
        { entity_id: number; branch_id: number }
      >,
      res: Response
    ) => {
      const files = req.files as { ProfileImg?: FileMetaData[] };
      const profileImg = files.ProfileImg?.[0] ?? req.body.data.oldImgUrl;

      const { user_name, entity_id, branch_id, oldImgUrl } = JSON.parse(
        String(req.body.data)
      );
      const user_id = req.user.user_id;
      const mo_by = req.user.user_id;
      const data = await User.updateProfileImage({
        user_name,
        entity_id,
        branch_id,
        user_id,
        oldImgUrl,
        mo_by: mo_by,
        imageFile: profileImg,
      });
      res.json(new ApiResponse(200, data.imageFileKey, "Profile image updated successfully"));
    }
  )
);



userRouter.get(
  '/getalluserslogintime',
  asyncHandler(
    async (
      req: AuthenticatedRequest<
        unknown,
        unknown,
        unknown,
        { entity_id: number; user_id: string; limit: number; page: number }
      >,
      res: Response
    ) => {
      const data = await User.getAllUsersloginTime(
        req.query.entity_id,
        req.query.user_id,
        req.query.page,
        req.query.limit,
      );
      res.json(new ApiResponse(200 , data.data));
    }
  )
  
);