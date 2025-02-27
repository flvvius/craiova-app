"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { dayStyle } from "../../styles/dayMapStyle";
import { nightStyle } from "../../styles/nightMapStyle";

interface MapProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
}

export function Map({ center, zoom }: MapProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultCenter = center ?? { lat: 44.316, lng: 23.796 };
  const defaultZoom = zoom ?? 13;

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  const mapStyle = isDarkMode ? nightStyle : [];

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      key={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={defaultCenter}
        zoom={defaultZoom}
        options={{
          styles: mapStyle,
        }}
      >
        <Marker position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
}
