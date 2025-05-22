import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MyLocationIcon from '@/assets/svg/MyLocationIcon';
import MyMapPositionIcon from '@/assets/svg/MyMapPositionIcon';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export interface CustomHealthValue {
  startDate: string;
  endDate: string;
  value: number | null;
  min?: number;
  max?: number;
}

const screen = Dimensions.get('window');

const mockData = [
  { date: '2025-05-20T09:00:00.000Z', latitude: 37.5665, longitude: 126.978 }, // 서울시청
  { date: '2025-05-20T09:15:00.000Z', latitude: 37.57, longitude: 127.001 }, // 종로5가
  { date: '2025-05-20T09:30:00.000Z', latitude: 37.58, longitude: 127.03 }, // 성신여대
  { date: '2025-05-20T09:45:00.000Z', latitude: 37.55, longitude: 127.04 }, // 건대입구
  { date: '2025-05-20T10:00:00.000Z', latitude: 37.51, longitude: 127.06 }, // 잠실
  { date: '2025-05-20T10:15:00.000Z', latitude: 37.5, longitude: 127.03 }, // 삼성역
  { date: '2025-05-20T10:30:00.000Z', latitude: 37.48, longitude: 127.01 }, // 교대역
];

function getTotalDistanceFromCoords(coords: { latitude: number; longitude: number }[]): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  let total = 0;

  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];

    const R = 6371e3;
    const φ1 = toRad(prev.latitude);
    const φ2 = toRad(curr.latitude);
    const Δφ = toRad(curr.latitude - prev.latitude);
    const Δλ = toRad(curr.longitude - prev.longitude);

    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;
    total += d;
  }

  return total;
}

export default function MapPage() {
  const [path, setPath] = useState<{ latitude: number; longitude: number }[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const coordinates = mockData.map(({ latitude, longitude }) => ({ latitude, longitude }));
    setPath(coordinates);
    setDistance(getTotalDistanceFromCoords(coordinates));

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const location = await Location.getCurrentPositionAsync({});
        const current = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentLocation(current);

        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              ...current,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            500
          );
        }
      })();
    }, [])
  );

  const moveToCurrentLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...currentLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.distanceOverlay}>
        <Text style={styles.distanceText}>
          오늘의 이동 거리 :{' '}
          {distance !== null ? `${(distance / 1000).toFixed(2)} km` : '계산 중...'}
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={moveToCurrentLocation}>
        <MyLocationIcon color="#021730" />
      </TouchableOpacity>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={
          currentLocation
            ? {
                ...currentLocation,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : undefined
        }
        initialRegion={{
          latitude: mockData[0].latitude,
          longitude: mockData[0].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={mockData[0]}>
          <View style={styles.startPin}>
            <Text style={styles.startPinText}>S</Text>
          </View>
        </Marker>
        <Marker coordinate={mockData[mockData.length - 1]}>
          <View style={{ backgroundColor: '#FFF1C2', padding: 10, borderRadius: 20 }}>
            <Text style={{ color: '#333' }}>도착 위치</Text>
          </View>
        </Marker>

        {currentLocation && (
          <Marker coordinate={currentLocation}>
            <View>
              <MyMapPositionIcon color="#1E90FF" />
            </View>
          </Marker>
        )}

        <Polyline coordinates={path} strokeColor="green" strokeWidth={4} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: screen.width,
    height: screen.height,
  },
  distanceOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    zIndex: 10,
  },
  distanceText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  startPin: {
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: '#69B1FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  startPinText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
});
