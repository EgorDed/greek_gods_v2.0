import React from 'react';

const Header = () => {
    return (
        <header className="h-[100px] w-full fixed top-0 left-0 z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-md flex items-center px-8">
            <h1 className="text-white text-2xl font-bold tracking-widest uppercase">
                Greek Gods Graph
            </h1>
        </header>
    )
}

export default Header;