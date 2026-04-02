import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const CurrentLocation = forwardRef(({ onLocationFetched }, ref) => {

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This App needs to access your location',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS handles permissions automatically
  };

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.blessshipping.com/maps/reverse?lat=${lat}&lon=${lng}&format=jsonv2`
      );
      const data = await response.json();
      if (data && data.display_name) {
        const formattedAddress = data.display_name;
        if (onLocationFetched) {
          onLocationFetched({
            latitude: lat,
            longitude: lng,
            address: formattedAddress,
          });
        }
        return { latitude: lat, longitude: lng, address: formattedAddress };
      } else {
        return { error: 'Address not found' };
      }
    } catch (error) {
      console.log("Geocode error:", error);
      return { error: 'Failed to fetch address' };
    }
  };

  const fetchLocation = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      return { error: 'Permission denied' };
    }

    return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
  async (position) => {
    const { latitude, longitude } = position.coords;
    const result = await getAddressFromCoords(latitude, longitude);
    resolve(result);
  },
  (error) => {
    console.log("Location error:", error);
    resolve({ error: error.message });
  },
  { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 }
);

    });
  };

  // Expose the function to parent
  useImperativeHandle(ref, () => ({
    fetchLocation,
  }));

  // Don't render anything
  return null;
});

export default CurrentLocation;
