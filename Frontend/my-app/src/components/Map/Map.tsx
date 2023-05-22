import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';

type Coordinate = {
    latitude: number;
    longitude: number;
};

type Option = {
    value: string;
    label: string;
    coordinate: Coordinate;
};

type MapProps = {
    ori: Option;
    dest: Option;
    path1: [[number, number], [number, number]][];
    path2: [[number, number], [number, number]][];
    toggle: {
        isToggled: boolean
        setIsToggled: React.Dispatch<React.SetStateAction<boolean>>
    },
};

const Map = ({ ori, dest, path1, path2, toggle }: MapProps) => {
    let marker1Position: [number, number] = [
        ori.coordinate.latitude,
        ori.coordinate.longitude,
    ];
    let marker2Position: [number, number] = [
        dest.coordinate.latitude,
        dest.coordinate.longitude,
    ];

    const markerIcon1 = new Icon({
        iconUrl: "/ori_icon.svg",
        iconSize: [25, 25],
    });

    const markerIcon2 = new Icon({
        iconUrl: "/dest_icon.svg",
        iconSize: [25, 25],
    });

    const markerIcon3 = new Icon({
        iconUrl: "/point_icon.svg",
        iconSize: [25, 25],
    });

    const position: [number, number] = [-6.17, 106.86];

    const linePositions1 = path1 || [];
    const lines1 = [];
    const linePositions2 = path2 || [];
    const lines2 = [];

    for (let i = 0; i < linePositions1.length; i++) {
        const path = linePositions1[i];
        const line = [];

        for (let j = 0; j < path.length; j += 2) {
            const startPoint = path[j];
            const endPoint = path[j + 1];
            line.push([startPoint, endPoint]);
        }

        lines1.push(line);
    }

    for (let i = 0; i < linePositions2.length; i++) {
        const path = linePositions2[i];
        const line = [];

        for (let j = 0; j < path.length; j += 2) {
            const startPoint = path[j];
            const endPoint = path[j + 1];
            line.push([startPoint, endPoint]);
        }

        lines2.push(line);
    }

    const markers1 = [];

    for (let i = 0; i < lines1.length; i++) {
        const line = lines1[i];

        const startPoint = line[0][0];
        let startMarker = null

        if (startPoint[0] !== marker1Position[0] && startPoint[1] !== marker1Position[1] && startPoint[0] !== marker2Position[0] && startPoint[1] !== marker2Position[1]) {
            startMarker = (
                <Marker position={startPoint} key={`start-${i}`} icon={markerIcon3}>
                    <Popup>Start Point</Popup>
                </Marker>
            );
        }

        const endPoint = line[0][1]
        let endMarker = null

        if (endPoint[0] !== marker1Position[0] && endPoint[1] !== marker1Position[1] && endPoint[0] !== marker2Position[0] && endPoint[1] !== marker2Position[1]) {
            endMarker = (
                <Marker position={endPoint} key={`start-${i}`} icon={markerIcon3}>
                    <Popup>End Point</Popup>
                </Marker>
            );
        }

        markers1.push(startMarker, endMarker);
    }

    const markers2 = [];

    for (let i = 0; i < lines2.length; i++) {
        const line = lines2[i];

        const startPoint = line[0][0];
        let startMarker = null

        if (startPoint[0] !== marker1Position[0] && startPoint[1] !== marker1Position[1] && startPoint[0] !== marker2Position[0] && startPoint[1] !== marker2Position[1]) {
            startMarker = (
                <Marker position={startPoint} key={`start-${i}`} icon={markerIcon3}>
                    <Popup>Start Point</Popup>
                </Marker>
            );
        }

        const endPoint = line[0][1]
        let endMarker = null

        if (endPoint[0] !== marker1Position[0] && endPoint[1] !== marker1Position[1] && endPoint[0] !== marker2Position[0] && endPoint[1] !== marker2Position[1]) {
            endMarker = (
                <Marker position={endPoint} key={`start-${i}`} icon={markerIcon3}>
                    <Popup>End Point</Popup>
                </Marker>
            );
        }

        markers2.push(startMarker, endMarker);
    }

    return (
        <MapContainer className="map" center={position} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={marker1Position} icon={markerIcon1}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            <Marker position={marker2Position} icon={markerIcon2}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>

            {!toggle.isToggled ?
                lines1.map((line, index) => (
                    <Polyline key={index} positions={line} color="red" />
                ))
                : null
            }

            {toggle.isToggled ?
                lines2.map((line, index) => (
                    <Polyline key={index} positions={line} color="blue" />
                ))
                : null
            }

            {!toggle.isToggled ?
                markers1
                : null
            }
            
            {toggle.isToggled ?
                markers2
                : null
            }
            
        </MapContainer>
    );
};

export default Map;