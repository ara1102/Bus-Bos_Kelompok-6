import dynamic from "next/dynamic";

//Set up leaflet map
const Map = dynamic(() => import('./Map'), {
    ssr: false
});

export default Map