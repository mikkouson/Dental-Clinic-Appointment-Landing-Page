// Maps.tsx
import React, { useRef, useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Autocomplete,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  TrafficLayer,
} from "@react-google-maps/api";
import useGoogleMapsLoader from "./hooks/useGoogleMapsLoader";

// Inline type definitions for Address and Branch
interface Address {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
}

interface Branch {
  id: number;
  name: string;
  address: string;
  addr: number;
  addresses: Address;
  preferred?: boolean; // Optional preferred flag
}

type MapsProps = {
  field: {
    name: string;
    onChange: (value: any) => void;
    onBlur: () => void;
    value: {
      address?: string;
      latitude?: number;
      longitude?: number;
      id?: number;
    };
  };
  onNearestBranchChange?: (branch: Branch | null) => void;
  selectedBranch?: Branch | null;
  branches: Branch[]; // Now includes 'preferred' flag
};

const Maps = ({
  field,
  onNearestBranchChange,
  selectedBranch,
  branches,
}: MapsProps) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded, loadError } = useGoogleMapsLoader();

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [nearestBranch, setNearestBranch] = useState<Branch | null>(null);

  const { address = "", latitude, longitude } = field.value || {};

  const updateAddressAndFetch = (latLng: google.maps.LatLngLiteral) => {
    updateAddress(latLng);
    const nearest = calculateNearestBranch(latLng.lat, latLng.lng);
    setNearestBranch(nearest);
    if (onNearestBranchChange) {
      onNearestBranchChange(nearest);
    }
    if (nearest) {
      fetchDirections(latLng.lat, latLng.lng, {
        lat: nearest.addresses.latitude,
        lng: nearest.addresses.longitude,
      });
    }
  };

  const updateAddress = (latLng: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder();
    const latLngObj = new google.maps.LatLng(latLng.lat, latLng.lng);

    geocoder.geocode({ location: latLngObj }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        const formattedAddress = results[0].formatted_address || "";

        field.onChange({
          address: formattedAddress,
          latitude: latLng.lat,
          longitude: latLng.lng,
          id: field.value?.id,
        });
      } else {
        console.error("Geocoding failed due to:", status);
      }
    });
  };

  const handlePlacesChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const latLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        updateAddressAndFetch(latLng);
      }
    } else {
      console.error("Autocomplete is not initialized");
    }
  };

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      updateAddressAndFetch(newPosition);
    }
  };

  const haversineDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateNearestBranch = useCallback(
    (userLat: number, userLng: number) => {
      let nearest = branches[0];
      let minDistance = Number.MAX_VALUE;

      branches.forEach((branch) => {
        const distance = haversineDistance(
          userLat,
          userLng,
          branch.addresses.latitude,
          branch.addresses.longitude
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearest = branch;
        }
      });

      return nearest;
    },
    [branches]
  );

  const fetchDirections = useCallback(
    (
      userLat: number,
      userLng: number,
      destination: { lat: number; lng: number }
    ) => {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: { lat: userLat, lng: userLng },
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          } else {
            console.error("Directions request failed due to:", status);
            setDirections(null);
          }
        }
      );
    },
    []
  );

  // Update directions when selectedBranch or nearestBranch changes
  useEffect(() => {
    if (!latitude || !longitude) return;

    if (selectedBranch) {
      fetchDirections(latitude, longitude, {
        lat: selectedBranch.addresses.latitude,
        lng: selectedBranch.addresses.longitude,
      });
    } else if (nearestBranch) {
      fetchDirections(latitude, longitude, {
        lat: nearestBranch.addresses.latitude,
        lng: nearestBranch.addresses.longitude,
      });
    }
  }, [selectedBranch, nearestBranch, latitude, longitude, fetchDirections]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <div className="mb-4">
      <Autocomplete
        options={{ componentRestrictions: { country: "PH" } }}
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlacesChanged}
      >
        <Input
          placeholder="Enter your address"
          value={address}
          onChange={(e) =>
            field.onChange({ ...field.value, address: e.target.value })
          }
        />
      </Autocomplete>

      <div className="relative h-96 mt-4">
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={
            latitude && longitude
              ? { lat: latitude, lng: longitude }
              : { lat: 13.960027, lng: 121.165852 } // Default center
          }
          zoom={10}
        >
          {latitude && longitude && (
            <Marker
              position={{ lat: latitude, lng: longitude }}
              draggable
              onDragEnd={handleMarkerDragEnd}
              title="Your address is here"
              zIndex={999} // Ensure this marker is on top
              options={{
                label: {
                  text: "Your address",
                  fontWeight: "bold",
                  fontSize: "14px",
                },
                icon: {
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  labelOrigin: new google.maps.Point(15, -10),
                },
              }}
            />
          )}

          {branches.map((branch) => (
            <Marker
              key={branch.id}
              position={{
                lat: branch.addresses.latitude,
                lng: branch.addresses.longitude,
              }}
              title={branch.name}
              zIndex={1} // Ensure branch markers are behind
              options={{
                label: {
                  text: branch.name,
                  fontWeight: "bold",
                  fontSize: "14px",
                },
                icon: {
                  url: branch.preferred
                    ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png" // Preferred branch marker color
                    : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Regular branch marker color
                  labelOrigin: new google.maps.Point(15, -10),
                },
              }}
              onClick={() =>
                alert(`${branch.name}\n${branch.addresses.address}`)
              }
            />
          ))}

          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: "#ff1100", // Set the line color to red
                  strokeWeight: 4,
                },
              }}
            />
          )}

          <TrafficLayer />
        </GoogleMap>
      </div>
      {latitude && longitude && (
        <div className="mt-4">
          {nearestBranch && (
            <div className="mt-2">
              <p>
                <strong>Nearest Branch:</strong> {nearestBranch.name}
              </p>
              <p>
                <strong>Address:</strong> {nearestBranch.addresses.address}
              </p>
            </div>
          )}
          {directions && directions.routes[0].legs[0].duration && (
            <div className="mt-2">
              <p>
                <strong>Estimated Travel Time:</strong>{" "}
                {directions.routes[0].legs[0].duration.text}
              </p>
              <p>
                <strong>Distance:</strong>{" "}
                {directions.routes[0].legs[0].distance.text}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Maps;
