const Footer = () => {
  return (
    <footer className="shadow dark:bg-gray-900 p-5">
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© {new Date().getFullYear()} <a href="https://arisecraft.com/" target="_block" className="hover:underline">Arisecraft Technologies Pvt Ltd</a>. All Rights Reserved.</span>
    </footer>
  )
}

export default Footer