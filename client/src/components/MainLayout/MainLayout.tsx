import { Outlet } from 'react-router-dom';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

const MainLayout = () => {
    
    return (
      <div>
        <Nav />
        <div className='min-h-[80vh]'>
          <Outlet />
        </div>
        <Footer/>
      </div>
    );
}

export default MainLayout;