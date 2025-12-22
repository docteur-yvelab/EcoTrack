// // v1 avec ajout d'un velo !!!
// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import axios from 'axios';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { PlusCircle, X, Camera } from 'lucide-react'; // Icônes sympas

// const createBikeIcon = (color) => {
//     return new L.Icon({
//         iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
//         shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
//         iconSize: [25, 41],
//         iconAnchor: [12, 41],
//         popupAnchor: [1, -34],
//         shadowSize: [41, 41]
//     });
// };

// const BikeMap = () => {
//     const [bikes, setBikes] = useState([]);
//     const [filterLowBattery, setFilterLowBattery] = useState(false);
//     const [map, setMap] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
    
//     // État pour le formulaire d'ajout
//     const [showForm, setShowForm] = useState(false);
//     const [newBike, setNewBike] = useState({
//         serialNumber: '',
//         model: '',
//         batteryLevel: 100,
//         status: 'AVAILABLE',
//         latitude: 3.848,
//         longitude: 11.502,
//         imageUrl: '' // Nouveau champ image
//     });

//     useEffect(() => {
//         fetchBikes();
//     }, []);

//     const fetchBikes = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get('http://localhost:8081/api/bikes');
//             setBikes(Array.isArray(res.data) ? res.data : []);
//             setError(null);
//         } catch (err) {
//             setError(err.message || 'Impossible de charger les vélos');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddBike = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.post('http://localhost:8081/api/bikes', newBike);
//             setBikes([...bikes, res.data]);
//             setShowForm(false);
//             setNewBike({ serialNumber: '', model: '', batteryLevel: 100, status: 'AVAILABLE', latitude: 3.848, longitude: 11.502, imageUrl: '' });
//         } catch (err) {
//             alert("Erreur lors de l'ajout du vélo");
//         }
//     };

//     const displayedBikes = filterLowBattery 
//         ? bikes.filter(b => b.batteryLevel < 20) 
//         : bikes;

//     const centerOnBike = (lat, lng) => {
//         if (map) map.flyTo([lat, lng], 16);
//     };

//     if (error) {
//         return (
//             <div className="p-6 text-red-600 flex flex-col items-center justify-center h-screen">
//                 <h2 className="text-2xl font-bold"> Erreur de connexion</h2>
//                 <p className="mb-4">{error}</p>
//                 <button onClick={fetchBikes} className="px-6 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition">
//                     Réessayer
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="h-screen w-full flex flex-col font-sans overflow-hidden bg-gray-100">
//             {/* HEADER MODERNE */}
//             <header className="bg-green-900 text-white p-4 shadow-xl z-20 flex justify-between items-center">
//                 <div className="flex items-center gap-3">
//                     <h1 className="text-xl font-black tracking-tighter uppercase">EcoTrack YDE 🇨🇲</h1>
//                     {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
//                 </div>
//                 <button 
//                     onClick={() => setShowForm(true)}
//                     className="bg-white text-green-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-green-100 transition transform hover:scale-105"
//                 >
//                     <PlusCircle size={20} /> Nouveau Vélo
//                 </button>
//             </header>

//             <div className="flex flex-grow h-full relative">
//                 {/* FORMULAIRE MODAL */}
//                 {showForm && (
//                     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
//                         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
//                             <div className="bg-green-800 p-4 text-white flex justify-between items-center">
//                                 <h2 className="font-bold text-lg text-white">Enregistrer un vélo à Yaoundé</h2>
//                                 <button onClick={() => setShowForm(false)} className="hover:bg-green-700 rounded-full p-1"><X size={24} /></button>
//                             </div>
//                             <form onSubmit={handleAddBike} className="p-6 space-y-4">
//                                 <input required placeholder="Numéro de série" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
//                                     onChange={e => setNewBike({...newBike, serialNumber: e.target.value})} />
//                                 <input required placeholder="Modèle" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
//                                     onChange={e => setNewBike({...newBike, model: e.target.value})} />
//                                 <input placeholder="URL de l'image (optionnel)" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
//                                     onChange={e => setNewBike({...newBike, imageUrl: e.target.value})} />
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <input type="number" step="any" placeholder="Latitude" className="border p-3 rounded-lg" 
//                                         onChange={e => setNewBike({...newBike, latitude: parseFloat(e.target.value)})} />
//                                     <input type="number" step="any" placeholder="Longitude" className="border p-3 rounded-lg" 
//                                         onChange={e => setNewBike({...newBike, longitude: parseFloat(e.target.value)})} />
//                                 </div>
//                                 <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg transition shadow-lg">
//                                     Confirmer l'ajout
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 )}

//                 {/* SIDEBAR */}
//                 <div className="w-80 bg-white border-r shadow-2xl flex flex-col overflow-y-auto">
//                     <div className="p-4 border-b bg-gray-50 sticky top-0 z-20">
//                         <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-200 rounded-lg transition">
//                             <input type="checkbox" checked={filterLowBattery} onChange={() => setFilterLowBattery(!filterLowBattery)} className="w-5 h-5 accent-red-600" />
//                             <span className="text-sm font-bold text-gray-700 uppercase">Alertes Batteries</span>
//                         </label>
//                     </div>
//                     <div className="flex-grow">
//                         {displayedBikes.map(bike => (
//                             <div key={bike.id} onClick={() => centerOnBike(bike.latitude, bike.longitude)} className="p-4 border-b hover:bg-green-50 cursor-pointer transition flex gap-3">
//                                 {bike.imageUrl ? (
//                                     <img src={bike.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-gray-200" alt="bike" />
//                                 ) : (
//                                     <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400"><Camera size={20}/></div>
//                                 )}
//                                 <div className="flex-grow">
//                                     <div className="flex justify-between items-center">
//                                         <span className="font-bold text-gray-900">{bike.serialNumber}</span>
//                                         <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${bike.batteryLevel < 20 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
//                                             {bike.batteryLevel}%
//                                         </span>
//                                     </div>
//                                     <p className="text-[11px] text-gray-500 font-medium">{bike.model}</p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* MAP */}
//                 <div className="flex-grow relative z-0">
//                     <MapContainer center={[3.8480, 11.5021]} zoom={13} className="h-full w-full" ref={setMap}>
//                         <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
//                         {displayedBikes.map(bike => (
//                             <Marker key={bike.id} position={[bike.latitude, bike.longitude]} icon={createBikeIcon(bike.batteryLevel < 20 ? 'red' : 'green')}>
//                                 <Popup>
//                                     <div className="w-40">
//                                         {bike.imageUrl && <img src={bike.imageUrl} className="w-full h-24 object-cover rounded-md mb-2" alt="velo" />}
//                                         <p className="font-bold text-green-900 m-0">{bike.model}</p>
//                                         <p className="text-xs text-gray-600 mb-1 italic">{bike.serialNumber}</p>
//                                         <div className="h-1.5 w-full bg-gray-200 rounded-full mt-2">
//                                             <div className={`h-full rounded-full ${bike.batteryLevel < 20 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${bike.batteryLevel}%`}}></div>
//                                         </div>
//                                         <p className="text-[10px] text-right mt-1 font-bold">{bike.batteryLevel}% Batterie</p>
//                                     </div>
//                                 </Popup>
//                             </Marker>
//                         ))}
//                     </MapContainer>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BikeMap;


// v2 ajout de la fonction supprimer

// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import axios from 'axios';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { PlusCircle, X, Camera, Trash2, Battery, MapPin } from 'lucide-react';

// // Configuration des icônes de marqueurs colorés
// const createBikeIcon = (color) => {
//     return new L.Icon({
//         iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
//         shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
//         iconSize: [25, 41],
//         iconAnchor: [12, 41],
//         popupAnchor: [1, -34],
//         shadowSize: [41, 41]
//     });
// };

// const BikeMap = () => {
//     const [bikes, setBikes] = useState([]);
//     const [filterLowBattery, setFilterLowBattery] = useState(false);
//     const [map, setMap] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // État pour le nouveau vélo
//     const [newBike, setNewBike] = useState({
//         serialNumber: '',
//         model: '',
//         batteryLevel: 100,
//         status: 'AVAILABLE',
//         latitude: 3.848,
//         longitude: 11.502,
//         imageUrl: ''
//     });

//     const API_URL = 'http://localhost:8081/api/bikes';

//     useEffect(() => {
//         fetchBikes();
//     }, []);

//     const fetchBikes = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get(API_URL);
//             setBikes(Array.isArray(res.data) ? res.data : []);
//             setError(null);
//         } catch (err) {
//             setError("Erreur de connexion au serveur backend (port 8081)");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddBike = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.post(API_URL, newBike);
//             setBikes([...bikes, res.data]);
//             setShowForm(false);
//             setNewBike({ serialNumber: '', model: '', batteryLevel: 100, status: 'AVAILABLE', latitude: 3.848, longitude: 11.502, imageUrl: '' });
//         } catch (err) {
//             alert("Erreur lors de l'ajout du vélo");
//         }
//     };

//     const handleDelete = async (e, id) => {
//         e.stopPropagation();
//         if (window.confirm("Voulez-vous vraiment supprimer ce vélo de la flotte ?")) {
//             try {
//                 await axios.delete(`${API_URL}/${id}`);
//                 setBikes(bikes.filter(b => b.id !== id));
//             } catch (err) {
//                 alert("Erreur lors de la suppression");
//             }
//         }
//     };

//     const displayedBikes = filterLowBattery 
//         ? bikes.filter(b => b.batteryLevel < 20) 
//         : bikes;

//     const centerOnBike = (lat, lng) => {
//         if (map) map.flyTo([lat, lng], 17);
//     };

//     if (error) {
//         return (
//             <div className="h-screen flex flex-col items-center justify-center bg-red-50 p-4">
//                 <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
//                     <h2 className="text-2xl font-bold text-red-600 mb-2">⚠️ Erreur</h2>
//                     <p className="text-gray-600 mb-6">{error}</p>
//                     <button onClick={fetchBikes} className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition">Réessayer</button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="h-screen w-full flex flex-col font-sans overflow-hidden bg-gray-50">
//             {/* --- HEADER --- */}
//             <header className="bg-green-900 text-white p-4 shadow-lg z-[1001] flex justify-between items-center">
//                 <div className="flex items-center gap-3">
//                     <div className="bg-white p-1.5 rounded-lg">
//                         <MapPin className="text-green-900" size={24} />
//                     </div>
//                     <h1 className="text-xl font-black tracking-tight uppercase">EcoTrack Yaoundé 🇨🇲</h1>
//                 </div>
//                 <button 
//                     onClick={() => setShowForm(true)}
//                     className="bg-green-500 hover:bg-green-400 text-white px-5 py-2 rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-md"
//                 >
//                     <PlusCircle size={20} /> Nouveau Vélo
//                 </button>
//             </header>

//             <div className="flex flex-grow h-full relative">
//                 {/* --- MODAL FORMULAIRE D'AJOUT --- */}
//                 {showForm && (
//                     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
//                         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
//                             <div className="bg-green-800 p-4 text-white flex justify-between items-center">
//                                 <h2 className="font-bold text-lg">Enregistrer un nouveau vélo</h2>
//                                 <button onClick={() => setShowForm(false)} className="hover:bg-green-700 rounded-full p-1"><X size={24} /></button>
//                             </div>
//                             <form onSubmit={handleAddBike} className="p-6 space-y-4">
//                                 <div>
//                                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Identification</label>
//                                     <input required placeholder="Numéro de série (ex: YDE-102)" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
//                                         onChange={e => setNewBike({...newBike, serialNumber: e.target.value})} />
//                                 </div>
//                                 <input required placeholder="Modèle du vélo" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
//                                     onChange={e => setNewBike({...newBike, model: e.target.value})} />
                                
//                                 <div>
//                                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Média</label>
//                                     <input placeholder="URL de l'image (https://...)" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
//                                         onChange={e => setNewBike({...newBike, imageUrl: e.target.value})} />
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Latitude</label>
//                                         <input type="number" step="any" placeholder="3.84..." className="w-full border p-3 rounded-lg" 
//                                             onChange={e => setNewBike({...newBike, latitude: parseFloat(e.target.value)})} required />
//                                     </div>
//                                     <div>
//                                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Longitude</label>
//                                         <input type="number" step="any" placeholder="11.50..." className="w-full border p-3 rounded-lg" 
//                                             onChange={e => setNewBike({...newBike, longitude: parseFloat(e.target.value)})} required />
//                                     </div>
//                                 </div>
//                                 <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl transition shadow-lg mt-2">
//                                     Confirmer l'enregistrement
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 )}

//                 {/* --- SIDEBAR --- */}
//                 <aside className="w-80 bg-white border-r shadow-2xl flex flex-col z-10">
//                     <div className="p-5 border-b bg-gray-50">
//                         <label className="flex items-center justify-between bg-white p-3 rounded-xl border cursor-pointer hover:shadow-md transition">
//                             <span className="text-sm font-bold text-gray-700 italic">⚠️ Alertes Batteries</span>
//                             <input type="checkbox" checked={filterLowBattery} onChange={() => setFilterLowBattery(!filterLowBattery)} className="w-5 h-5 accent-red-600" />
//                         </label>
//                     </div>
//                     <div className="flex-grow overflow-y-auto">
//                         {displayedBikes.length === 0 ? (
//                             <div className="p-10 text-center text-gray-400">
//                                 <p className="italic">Aucun vélo trouvé</p>
//                             </div>
//                         ) : (
//                             displayedBikes.map(bike => (
//                                 <div key={bike.id} onClick={() => centerOnBike(bike.latitude, bike.longitude)} className="p-4 border-b hover:bg-green-50 cursor-pointer transition flex gap-3 group">
//                                     <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border">
//                                         {bike.imageUrl ? (
//                                             <img src={bike.imageUrl} className="w-full h-full object-cover" alt="bike" />
//                                         ) : (
//                                             <div className="w-full h-full flex items-center justify-center text-gray-300"><Camera size={20}/></div>
//                                         )}
//                                     </div>
//                                     <div className="flex-grow min-w-0">
//                                         <div className="flex justify-between items-start">
//                                             <h4 className="font-bold text-gray-900 truncate">{bike.serialNumber}</h4>
//                                             <button onClick={(e) => handleDelete(e, bike.id)} className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         </div>
//                                         <p className="text-[11px] text-gray-500 truncate mb-1">{bike.model}</p>
//                                         <div className="flex items-center gap-1">
//                                             <div className={`h-1.5 flex-grow rounded-full bg-gray-200`}>
//                                                 <div className={`h-full rounded-full ${bike.batteryLevel < 20 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${bike.batteryLevel}%`}}></div>
//                                             </div>
//                                             <span className="text-[10px] font-bold text-gray-600">{bike.batteryLevel}%</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </aside>

//                 {/* --- CARTE --- */}
//                 <main className="flex-grow relative z-0">
//                     <MapContainer center={[3.8480, 11.5021]} zoom={13} className="h-full w-full" ref={setMap}>
//                         <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
//                         {displayedBikes.map(bike => (
//                             <Marker key={bike.id} position={[bike.latitude, bike.longitude]} icon={createBikeIcon(bike.batteryLevel < 20 ? 'red' : 'green')}>
//                                 <Popup>
//                                     <div className="w-48 font-sans">
//                                         {bike.imageUrl && <img src={bike.imageUrl} className="w-full h-28 object-cover rounded-lg mb-2 shadow-sm" alt="velo" />}
//                                         <div className="flex justify-between items-start mb-1">
//                                             <h3 className="font-bold text-gray-900 m-0">{bike.model}</h3>
//                                             <span className={`text-[10px] px-2 py-0.5 rounded text-white font-bold ${bike.batteryLevel < 20 ? 'bg-red-500' : 'bg-green-500'}`}>
//                                                 {bike.batteryLevel}%
//                                             </span>
//                                         </div>
//                                         <p className="text-xs text-gray-500 mb-2 font-mono">{bike.serialNumber}</p>
                                        
//                                         <div className="flex gap-2 pt-2 border-t">
//                                             <button 
//                                                 onClick={(e) => handleDelete(e, bike.id)} 
//                                                 className="flex-grow flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] py-1.5 rounded transition font-bold"
//                                             >
//                                                 <Trash2 size={12} /> Supprimer
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </Popup>
//                             </Marker>
//                         ))}
//                     </MapContainer>
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default BikeMap;


// v3 ajout image !!!

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PlusCircle, X, Camera, Trash2, MapPin, UploadCloud } from 'lucide-react';


const username = 'yve';
const password = 'ecotrack237';
const authHeader = 'Basic ' + btoa(`${username}:${password}`);

// Configure Axios pour envoyer le header partout
axios.defaults.headers.common['Authorization'] = authHeader;

// Configuration des icônes de marqueurs colorés
const createBikeIcon = (color) => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

const BikeMap = () => {
    const [bikes, setBikes] = useState([]);
    const [filterLowBattery, setFilterLowBattery] = useState(false);
    const [map, setMap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    // États pour l'upload
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // État pour le nouveau vélo
    const [newBike, setNewBike] = useState({
        serialNumber: '',
        model: '',
        batteryLevel: 100,
        status: 'AVAILABLE',
        latitude: 3.848,
        longitude: 11.502,
        imageUrl: ''
    });

    const API_URL = 'http://localhost:8081/api/bikes';

    useEffect(() => {
        fetchBikes();
    }, []);

    const fetchBikes = async () => {
        try {
            setLoading(true);
            const res = await axios.get(API_URL);
            setBikes(Array.isArray(res.data) ? res.data : []);
            setError(null);
        } catch (err) {
            setError("Erreur de connexion au serveur backend (port 8081)");
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    const handleAddBike = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let finalImageUrl = newBike.imageUrl;

            // 1. Upload de l'image si un fichier est sélectionné
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalImageUrl = uploadRes.data;
            }

            // 2. Enregistrement du vélo 
            const res = await axios.post(API_URL, { ...newBike, imageUrl: finalImageUrl });
            
            setBikes([...bikes, res.data]);
            setShowForm(false);
            setSelectedFile(null);
            setNewBike({ serialNumber: '', model: '', batteryLevel: 100, status: 'AVAILABLE', latitude: 3.848, longitude: 11.502, imageUrl: '' });
        } catch (err) {
            alert("Erreur lors de l'ajout du vélo ou de l'image");
            console.log(err);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Voulez-vous vraiment supprimer ce vélo ?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                setBikes(bikes.filter(b => b.id !== id));
            } catch (err) {
                alert("Erreur lors de la suppression");
                console.log(err);
            }
        }
    };

    const displayedBikes = filterLowBattery 
        ? bikes.filter(b => b.batteryLevel < 20) 
        : bikes;

    const centerOnBike = (lat, lng) => {
        if (map) map.flyTo([lat, lng], 17);
    };

    return (
        <div className="h-screen w-full flex flex-col font-sans overflow-hidden bg-gray-50">

            {/* --- HEADER --- */}
            <header className="bg-green-900 text-white p-4 shadow-lg z-[1001] flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-lg text-green-900"><MapPin size={24} /></div>
                    <h1 className="text-xl font-black uppercase tracking-tight">EcoTrack YDE 🇨🇲</h1>
                </div>
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-green-500 hover:bg-green-400 text-white px-5 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-md"
                >
                    <PlusCircle size={20} /> Nouveau Vélo
                </button>
            </header>

            <div className="flex flex-grow h-full relative">

                {/* --- FORMULAIRE D'AJOUT --- */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden overflow-y-auto max-h-[90vh]">
                            <div className="bg-green-800 p-4 text-white flex justify-between items-center">
                                <h2 className="font-bold text-lg">Nouveau vélo à Yaoundé</h2>
                                <button onClick={() => setShowForm(false)} className="hover:bg-green-700 rounded-full p-1"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleAddBike} className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Numéro de série</label>
                                    <input required placeholder="ex: YDE-102" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500" 
                                        onChange={e => setNewBike({...newBike, serialNumber: e.target.value})} />
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Modèle</label>
                                    <input required placeholder="Modèle du vélo" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500" 
                                        onChange={e => setNewBike({...newBike, model: e.target.value})} />
                                </div>

                                {/* SECTION UPLOAD IMAGE */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Photo du vélo</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*"
                                            onChange={(e) => setSelectedFile(e.target.files[0])} />
                                        <div className="flex flex-col items-center gap-2">
                                            <UploadCloud className="text-gray-400" size={32} />
                                            <span className="text-sm text-gray-600">
                                                {selectedFile ? selectedFile.name : "Cliquez pour choisir un fichier"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" step="any" placeholder="Latitude" className="border p-3 rounded-lg" 
                                        onChange={e => setNewBike({...newBike, latitude: parseFloat(e.target.value)})} required />
                                    <input type="number" step="any" placeholder="Longitude" className="border p-3 rounded-lg" 
                                        onChange={e => setNewBike({...newBike, longitude: parseFloat(e.target.value)})} required />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={uploading}
                                    className={`w-full ${uploading ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-800'} text-white font-bold py-4 rounded-xl shadow-lg transition-all`}
                                >
                                    {uploading ? "Chargement de l'image..." : "Enregistrer le vélo"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- SIDEBAR --- */}
                <aside className="w-80 bg-white border-r shadow-2xl flex flex-col z-10 overflow-hidden">
                    <div className="p-5 border-b bg-gray-50">
                        <label className="flex items-center justify-between bg-white p-3 rounded-xl border cursor-pointer hover:shadow-sm">
                            <span className="text-sm font-bold text-gray-700">Batteries faibles</span>
                            <input type="checkbox" checked={filterLowBattery} onChange={() => setFilterLowBattery(!filterLowBattery)} className="w-5 h-5 accent-red-600" />
                        </label>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {displayedBikes.map(bike => (
                            <div key={bike.id} onClick={() => centerOnBike(bike.latitude, bike.longitude)} className="p-4 border-b hover:bg-green-50 cursor-pointer transition flex gap-3 group">
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border">
                                    {bike.imageUrl ? (
                                        <img src={bike.imageUrl} className="w-full h-full object-cover" alt="bike" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><Camera size={20}/></div>
                                    )}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-900 truncate">{bike.serialNumber}</h4>
                                        <button onClick={(e) => handleDelete(e, bike.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-gray-500 truncate">{bike.model}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className="h-1.5 flex-grow rounded-full bg-gray-100">
                                            <div className={`h-full rounded-full ${bike.batteryLevel < 20 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${bike.batteryLevel}%`}}></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-600">{bike.batteryLevel}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* --- MAP --- */}
                <main className="flex-grow relative">
                    <MapContainer center={[3.8480, 11.5021]} zoom={13} className="h-full w-full" ref={setMap}>
                        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" attribution='&copy; OSM contributors' />
                        {displayedBikes.map(bike => (
                            <Marker key={bike.id} position={[bike.latitude, bike.longitude]} icon={createBikeIcon(bike.batteryLevel < 20 ? 'red' : 'green')}>
                                <Popup>
                                    <div className="w-48 font-sans">
                                        {bike.imageUrl && <img src={bike.imageUrl} className="w-full h-28 object-cover rounded-lg mb-2 shadow-sm" alt="velo" />}
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900 m-0">{bike.model}</h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded text-white font-bold ${bike.batteryLevel < 20 ? 'bg-red-500' : 'bg-green-500'}`}>
                                                {bike.batteryLevel}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2 font-mono">{bike.serialNumber}</p>
                                        <button 
                                            onClick={(e) => handleDelete(e, bike.id)} 
                                            className="w-full flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] py-1.5 rounded transition font-bold border-t border-red-100"
                                        >
                                            <Trash2 size={12} /> Supprimer du système
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </main>
            </div>
        </div>
    );
};

export default BikeMap;
