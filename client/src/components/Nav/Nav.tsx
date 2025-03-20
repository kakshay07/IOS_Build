import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Nav.css";
import profileImg from "../../../public/profile.png";
import { GetEntity, requestHandler } from "../../utils/api";
import { toastError } from "../../utils/SweetAlert";
import { useEffect, useState } from "react";
import { axios, baseURL } from "../../utils/axios";
import { entityModel } from "../../pages/Masters/Entity";
// import { useNotification } from "../../contexts/NotificationContext";

const navLinks = [
  {
    group: "SA Masters",
    url: "/",
    links: [
      { name: "Entity", url: "/entity" , icon : 'fa-solid fa-building'},
      { name: "Pages", url: "/pages" , icon : 'fa-regular fa-copy'},
      { name: "Branch", url: "/branch" , icon : 'fa-solid fa-sitemap'},
      { name: "Additional Features", url: "/additionalfeature" , icon : 'fa-regular fa-comment-dots'},

    ],
    icon : 'fa-solid fa-user-lock'
  },
  {
    group: "Masters",
    url: "/",
    links: [
      { name: "Branch", url: "/branch" , icon : 'fa-solid fa-sitemap'},
      { name: "Roles", url: "/roles" , icon : 'fa-solid fa-universal-access'},
      { name: "Designation", url: "/designation" , icon : 'fa-solid fa-user-tie'},
      { name: "Users", url: "/users" , icon : 'fa-solid fa-users'},
      { name: "Measurement", url: "/type" , icon : 'fa-solid fa-weight-scale'},
      { name: "Vendor", url: "/vendor" , icon : 'fa-solid fa-shop'},
    ],
    icon : 'fa-solid fa-database'
  },
  {
    group: "Entry",
    url: "/",
    links: [
      { name: "Barcode Demo", url: "/barcodeDemo" , icon : 'fa-solid fa-barcode'},
      // { name :'Send Test Email' ,url : '/sendTestEmail' ,icon :'fa-regular fa-envelope'},
    ],
    icon : 'fa-solid fa-pen-to-square'
  },
  {
    group: "Reports",
    url: "/",
    links: [

    ],
    icon : 'fa-solid fa-chart-line'
  },
  {
    group: "Task Masters",
    url: "/",
    links: [
      
    ],
    icon : 'fa-solid fa-bars-progress'
  },
];

function Nav() {
  const {
    user,
    signout,
    pageAccess,
    branchAccess,
    currentBranch,
    setcurrentBranch,
    currentEntity,
    setccurrentEntity,
  } = useAuth();
  const navigate = useNavigate();
  const [entities, setentities] = useState<entityModel[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  // const { notificationCount,notificationCount1,notificationCount2, dueDateCount } = useNotification();


  function getAllEntity() {
    return requestHandler(
      async () => {
        return await GetEntity();
      },
      (data) => {
        setentities(data.data);
      },
      (errorMessage) => {
        toastError.fire({ title: errorMessage });
      }
    );
  }


  useEffect(() => {
    getAllEntity();
  }, []);

  const hasAccess = (url:string) => {
    // Check if the main link url matches
    if (pageAccess.some((page) => page.url === url)) {
        return true;
    }
    for (const page of pageAccess) {
        for (const link of navLinks) {
            if (link.url === url) {
                if (link.links.some((subLinks) => subLinks.url === page.url)) {
                    return true;
                }
            }
        }
    }

    return false;
};

  if (!user) {
    // return <p>You are not logged in.</p>;
    return;
  }

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = () => {
    setMenuOpen(false); 
  };

  const checkboxes = document.querySelectorAll(".showDrop") as NodeListOf<HTMLInputElement>;
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  return (
    <>
      <header className="mainHeader">
        <div className="flex items-center left">
          <Link  to="">
            <h1 className="text-2xl font-semibold">
            <div className="h-12">
            {user.entityImage?.length ? (
                <img
                  src={`${user?.s3_cloudfront_url}/${user?.entityImage}`}
                  width={65}
                  height={50}
                  className="object-cover w-full h-full"
                  alt="Preview"
                />
              ) : 'ACT'}
            </div>
            </h1>
          </Link>
        </div>
        <div className="flex justify-end right">
          {/* <div className="relative flex items-center text-white transition-all duration-300 rounded-full cursor-pointer hover:shadow-lg hover:scale-105" role="alert">
            <button type="button" title="Open tasks count" className="relative flex items-center justify-center w-12 h-12 transition duration-300 rounded-full hover:bg-white/10 focus:outline-none" onClick={() => navigate(`${user.is_admin == 1?'/customertaskaction':'/staffcustomertaskaction'}`)}>
              <i className="text-xl fa-solid fa-bell"style={{color:"white" }}></i>
              <span className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full shadow-md">{notificationCount}</span>
            </button>
          </div>
          <div className="relative flex items-center text-white transition-all duration-300 rounded-full cursor-pointer hover:shadow-lg hover:scale-105" role="alert">
            <button type="button" title="Pending invoice count" className="relative flex items-center justify-center w-12 h-12 transition duration-300 rounded-full hover:bg-white/10 focus:outline-none" onClick={() => navigate(`${user.is_admin == 1?'/customertaskaction':'/staffcustomertaskaction'}`)}>
              <i className="text-xl fa-solid fa-bell"style={{color:"gold" }}></i>
              <span className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full shadow-md">{notificationCount1}</span>
            </button>
          </div>
          <div className="relative flex items-center text-white transition-all duration-300 rounded-full cursor-pointer hover:shadow-lg hover:scale-105" role="alert">
            <button type="button" title="Pending payment count" className="relative flex items-center justify-center w-12 h-12 transition duration-300 rounded-full hover:bg-white/10 focus:outline-none" onClick={() => navigate(`${user.is_admin == 1?'/customertaskaction':'/staffcustomertaskaction'}`)}>
              <i className="text-xl fa-solid fa-bell"style={{color:"#7E60BF" }}></i>
              <span className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full shadow-md">{notificationCount2}</span>
            </button>
          </div>
          <div className="relative flex items-center text-white transition-all duration-300 rounded-full cursor-pointer hover:shadow-lg hover:scale-105" role="alert">
            <button type="button" title="Due date count" className="relative flex items-center justify-center w-12 h-12 transition duration-300 rounded-full hover:bg-white/10 focus:outline-none" onClick={() => navigate(`${user.is_admin == 1?'/customertaskaction':'/staffcustomertaskaction'}`)}>
              <i className="text-xl fa-solid fa-bell"style={{color:"rgb(243 116 116)" }}></i>
              <span className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full shadow-md">{dueDateCount}</span>
            </button>
          </div>

          <div className="mx-5 border border-gray-600"></div> */}

          {/* <PageSearchComponent pages={pageAccess?.map(_=>(_.url))} /> */}
          {user.is_admin || user.is_superadmin ? (
            <>
              {user.is_superadmin ? (
                <div className="relative flex flex-row items-center mr-3">
                  <select
                    title="Entity"
                    value={currentEntity ? currentEntity : ""}
                    onChange={(e) => {
                      setccurrentEntity(Number(e.target.value));
                    }}
                    className="h-full pl-3 pr-16 text-gray-400 rounded appearance-none bg-slate-700"
                  >
                    <option value="">Select Entity</option>
                    {entities.map((entity, index) => (
                      <option key={index} value={entity.entity_id?.toString()}>
                        {entity.name}
                      </option>
                    ))}
                  </select>
                  <i className="absolute text-2xl text-gray-500 fa-solid fa-building right-3"></i>
                </div>
              ) : (
                ""
              )}
              <div className="relative flex flex-row items-center mobile-branch-selector">
                <select
                  title="Branch"
                  value={currentBranch ? currentBranch : ""}
                  onChange={(e) => {
                    setcurrentBranch(Number(e.currentTarget.value));
                  }}
                  className="h-full pl-3 pr-16 text-gray-400 rounded appearance-none bg-slate-700"
                >
                  <option value="">Select Branch</option>
                  {branchAccess.filter(_=>_.is_active==1).map((branch, index) => (
                    <option key={index} value={branch.branch_id?.toString()}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                <i className="absolute text-2xl text-gray-500 fa-solid fa-sitemap right-3"></i>
              </div>

              <div className="mx-5 border border-gray-600"></div>
            </>
          ) : (
            ""
          )}

          <div className="profile_wrapper">
            <div className="profile_picture">
            <Link className="link" to="/changePassword">
              <img 
              // src={profileImg} 
              className=" rounded-full w-12 h-10"
              // width={50}
              // height={50}
              src={user.imageFile ? `${user.s3_cloudfront_url}/${user.imageFile}` :profileImg} 
              alt=""
               />
               </Link>
            </div>
            <div className="name_wrapper">
              <div className="flex flex-wrap items-center name">
                <div className="w-full pl-1 text-start">{user.user_name} </div>
                <p className="flex items-center text-[9px] font-light px-1 py-0 rounded-full text-blue-300 border border-blue-300 h-[15px] mt-1">
                  {user.role_name}
                </p>
              </div>
            </div>
            <div className="dropDownToggle">
              <i className="fa-solid fa-angle-down"></i>
              <ul className="profileDropdownMenu">
                <li>
                  <Link className="link" to="/changePassword">
                    {/* <i className="mr-3 fa-solid fa-key"></i> */}
                    <i className="mr-3 fa-regular fa-user"></i>
                    {/* Change Password */}
                    Profile 
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      axios
                      .post(baseURL+'/user/logout', { user_name: user.user_name,entity_id:user.entity_id })
                      .then((response) => {
                        if (response.status === 200) {
                          signout(() => navigate("/login"));
                        } else {
                          alert('Logout failed');
                        }
                      })
                      .catch((err) => {
                        alert(`Logout failed: ${err.message}`);
                      });
                    }}
                    className="link"
                  >
                    <i className="mr-2 fa-solid fa-arrow-right-from-bracket"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      <nav>
        <div className="main_wrapper">
          <div className="wrapper">
            <div className="logo">
            <Link  to="">
              <h1 className=" text-2xl  w-12 font-semibold text-blue-500">
                {/*    ADD LOGO  HERE FOR SMALL SCREENS*/}
                {/* <img  src={logo} alt="" /> */}
                <div className="overflow-hidden flex items-center justify-center ">
                {user.entityImage?.length ? (
                <img
                  src={`${user?.s3_cloudfront_url}/${user?.entityImage}`}
                  width={65}
                  height={50}
                  className="object-cover w-full h-full"
                  alt="Preview"
                />
              ) : 'ACT'}
              </div>
              </h1>
              </Link>
            </div>
            <input title="z" type="radio" name="slider" id="menu-btn" checked={menuOpen} // Bind to menuOpen state
              onChange={handleMenuToggle}/>
            <input title="z" type="radio" name="slider" id="close-btn" checked={!menuOpen} // Bind to menuOpen state
              onChange={handleMenuToggle}/>

            <ul className="nav-links">
              <label htmlFor="close-btn" className="btn close-btn">
                <i className="fas fa-times"></i>
              </label>
                <div className="mx-8 flex flex-wrap lg:hidden">
                  <div className="mr-6">
                    <img className=" rounded-full w-12 h-12" src={user.imageFile ? `${user.s3_cloudfront_url}/${user.imageFile}` :profileImg} alt="" />
                  </div>
                  <div>
                    <div className="text-start text-white font-semibold mt-[10px] leading-3">{user.user_name}</div>
                    <p className=" mt-[10px] text-blue-300 border border-blue-300 leading-3  px-[6px] py-[4px] rounded-full text-sm">
                      {user.role_name}
                    </p>
                  </div>
                  <hr className="w-full mt-4 border-blue-900 border" />
                </div>
              {navLinks
                .filter((_) =>
                  user.is_superadmin == 1 ? true : _.group != "SA Masters"
                )
                .filter((group) =>
                  group.links.some((subLink) => hasAccess(subLink.url))
                )
                .map((link, index) => (
                  <li key={index}>
                    {hasAccess(link.url) && (
                      <>
                        {link.group && (
                          <Link onClick={(e)=> {e.preventDefault();handleMenuItemClick();}} to={link.url} className="desktop-item">
                            <i className={`${link.icon} mr-2`}></i>
                            {link.group}
                            <i className="fa-solid fa-caret-down"></i>
                          </Link>
                        )}
                        <input
                          type="checkbox"
                          className="showDrop"
                          id={`showDrop${index}`}
                        />
                        <label
                          htmlFor={`showDrop${index}`}
                          className="mobile-item"
                        >
                          {link.group}
                          <i className="fa-solid fa-caret-down"></i>
                        </label>
                        <ul className="drop-menu">
                          {link.links
                            .filter((subLinks) => hasAccess(subLinks.url))
                            .map((subLinks, index2) => (
                              <li key={index2}>
                                {hasAccess(subLinks.url) && (
                                  <Link to={subLinks.url}  onClick={handleMenuItemClick}>
                                    <i className={`${subLinks.icon} mr-4`}></i>
                                    {subLinks.name}
                                  </Link>
                                )}
                              </li>
                            ))}
                        </ul>
                      </>
                    )}
                  </li>
                ))}
              {/* mobile menu for logout */}
              <li>
                <input
                  type="checkbox"
                  className="showDrop"
                  id="showProfileDrop"
                  
                />
                <label htmlFor="showProfileDrop" className="mobile-item" >
                My Profile
                  <i className="fa-solid fa-caret-down"></i>
                </label>
                <ul className="drop-menu profileDropdownMenu">
                  <li>
                    <Link className="link" to="/changePassword" onClick={handleMenuItemClick}>
                      {/* Change Password
                       */}
                  <i className="fa-solid fa-user mr-2"></i>
                  Profile 
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        axios
                        .post(baseURL+'/user/logout', { user_name: user.user_name,entity_id:user.entity_id })
                        .then((response) => {
                          if (response.status === 200) {
                            // alert('Logout successful');
                            signout(() => navigate("/login"));
                          } else {
                            alert('Logout failed');
                          }
                        })
                        .catch((err) => {
                          alert(`Logout failed: ${err.message}`);
                        });
                      }}
                      className="ml-5 text-red-500 link "
                    >
                 <i className=" text-red-500 mr-2 fa-solid fa-power-off"></i>

                      Logout
                    </button>
                  </li>
             
                </ul>
              </li>
              <li>
                <>
                  {user.is_superadmin  ? (
                    <div className="flex flex-row relative items-center  w-full lg:hidden">
                      <select
                        title="Entity"
                        value={currentEntity ? currentEntity : ""}
                        onChange={(e) => {
                          setccurrentEntity(Number(e.target.value));
                        }}
                        className="appearance-none rounded pl-3 pr-16 h-full bg-slate-700 text-gray-400 w-fit"
                      >
                        <option value="">Select Entity</option>
                        {entities.map((entity, index) => (
                          <option key={index} value={entity.entity_id?.toString()}>
                            {entity.name}
                          </option>
                        ))}
                      </select>
                      {/* <i className="fa-solid fa-building text-gray-500 absolute text-2xl right-3"></i> */}
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex flex-row relative items-center mt-3 w-full  lg:hidden">
                  <select
                  title="Branch"
                  value={currentBranch ? currentBranch : ""}
                  onChange={(e) => {
                    setcurrentBranch(Number(e.currentTarget.value));
                  }}
                  className="h-full pl-3 pr-16 text-gray-400 rounded appearance-none bg-slate-700"
                >
                  <option value="">Select branch</option>
                  {branchAccess.filter(_=>_.is_active==1).map((branch, index) => (
                    <option key={index} value={branch.branch_id?.toString()}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                    {/* <i className="fa-solid fa-sitemap text-gray-500 absolute text-2xl right-3"></i> */}
                  </div>
                </>
              </li>
            </ul>
            <label htmlFor="menu-btn" className="btn menu-btn">
              <i className="fas fa-bars"></i>
            </label>
          </div>
        </div>
      </nav>
    </>
  );
}

// class searchpages {
//   allPages : string[] = [];
//   filteredPages : string[] = [];
// }



export default Nav;
