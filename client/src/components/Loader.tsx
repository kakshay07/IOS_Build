const Loader = () => {
    return (
        <div className="fixed top-0 z-50 left-0 flex items-center justify-center bg-slate-300 w-full h-full bg-transparent backdrop-blur-sm backdrop-brightness-[95%] ">
            <div className="flex gap-2 z-50">
                <div className="z-50 w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
                <div className="z-50 w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
                <div className="z-50 w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
            </div>
        </div>
    );
};

export default Loader;
