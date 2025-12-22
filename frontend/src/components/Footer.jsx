// import React from 'react';
// import { Database, Zap, User, Circle } from 'lucide-react';

// const Footer = ({ bikes = [], currentUser = "yve" }) => {
//     if(!bikes)return null;
//     const totalBikes = bikes.length;
//     const lowBatteryCount = bikes.filter(b => b.batteryLevel < 20).length;

//     return (
//         <footer className="bg-white border-t border-gray-100 px-6 py-2 z-[1001] flex justify-between items-center text-[11px] text-gray-500">
            
//             {/* Infos Flotte & Status */}
//             <div className="flex items-center gap-5">
//                 <div className="flex items-center gap-2">
//                     <Circle size={8} className="fill-green-500 text-green-500 animate-pulse" />
//                     <span className="font-medium">PostgreSQL Live</span>
//                 </div>
                
//                 <div className="flex gap-4 border-l pl-5 border-gray-100">
//                     <div className="flex items-center gap-1.5">
//                         <Database size={13} />
//                         <span>Flotte: <b className="text-gray-800">{totalBikes}</b></span>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                         <Zap size={13} className={lowBatteryCount > 0 ? "text-amber-500" : ""} />
//                         <span>Alertes: <b className={lowBatteryCount > 0 ? "text-red-600" : "text-gray-800"}>{lowBatteryCount}</b></span>
//                     </div>
//                 </div>
//             </div>

//             {/* User & Copyright */}
//             <div className="flex items-center gap-5">
//                 <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
//                     <User size={12} />
//                     <span className="font-medium text-gray-700">{currentUser}</span>
//                 </div>
//                 <div className="font-medium">
//                     EcoTrack YDE <span className="text-red-500">🇨🇲</span> © 2025
//                 </div>
//             </div>
//         </footer>
//     );
// };

// export default Footer;

import React from 'react';
import { Database, Zap, User, Circle, Phone, Facebook, Github } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';


const Footer = ({ bikes = [], currentUser = "yve" }) => {
    const totalBikes = bikes.length;
    const lowBatteryCount = bikes.filter(b => b.batteryLevel < 20).length;

    return (
        <footer className="bg-white border-t border-gray-200 px-6 py-3 z-[1001] flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            
            {/* --- GAUCHE : STATS & STATUS --- */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <Circle size={8} className="fill-green-500 text-green-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">Serveur Live</span>
                </div>
                
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <Database size={14} className="text-gray-400" />
                        <span className="text-[12px]">Flotte: <b className="text-gray-800">{totalBikes}</b></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Zap size={14} className={lowBatteryCount > 0 ? "text-amber-500" : "text-gray-400"} />
                        <span className="text-[12px] text-gray-500">Alertes: <b className={lowBatteryCount > 0 ? "text-red-600" : "text-gray-800"}>{lowBatteryCount}</b></span>
                    </div>
                </div>
            </div>

            {/* --- CENTRE : CONTACTS & RÉSEAUX --- */}
            <div className="flex items-center gap-3">
                <a href="tel:+237694637342" className="p-2 bg-gray-50 hover:bg-green-100 text-gray-600 hover:text-green-700 rounded-full transition-all border border-gray-100" title="Appeler">
                    <Phone size={16} />
                </a>
            
                {/* <a href="https://facebook.com/tonprofil" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 hover:bg-blue-100 text-gray-600 hover:text-blue-700 rounded-full transition-all border border-gray-100" title="Facebook">
                    <Facebook size={16} />
                    
                </a> */}

                {/* <a href="https://wa.me/237655443322" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp size={24} color="#25D366" />
                </a> */}

                <a href="https://github.com/docteur-yvelab" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 hover:bg-gray-200 text-gray-600 hover:text-black rounded-full transition-all border border-gray-100" title="GitHub">
                    <Github size={16} />
                </a>
            </div>

            {/* --- DROITE : USER & COPYRIGHT --- */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-500 text-[12px]">
                    <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
                        <User size={12} />
                        <span className="font-semibold text-gray-700">{currentUser}</span>
                    </div>
                    <span className="hidden sm:inline">|</span>
                    <span className="font-medium text-gray-400">
                        EcoTrack YDE <span className="text-red-500">🇨🇲</span> © 2025
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;