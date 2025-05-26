import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import useSelectedDate from '@/stores/useSelectedDate';
import MyLocationIcon from '@/assets/svg/MyLocationIcon';
import MyMapPositionIcon from '@/assets/svg/MyMapPositionIcon';

const screen = Dimensions.get('window');

interface locationData {
  id: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

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
    total += R * c;
  }
  return total;
}

export default function MapPage() {
  const { day, month, year } = useSelectedDate();
  const mapRef = useRef<MapView>(null);
  const [path, setPath] = useState<{ latitude: number; longitude: number }[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // 1. 초기 위치 데이터 GET
  const fetchInitialPath = async () => {
    if (!day || !month || !year) return;

    try {
      const res = await fetch(
        `https://api.momenty.co.kr/locations?year=${year}&month=${month}&day=${day}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('초기 위치 데이터 불러오기', res);
      if (!res.ok) throw new Error('위치 데이터를 불러오지 못했습니다.');
      const data: { locations: locationData[] } = await res.json();
      if (data.locations.length > 0) {
        const coords = data.locations.map(({ latitude, longitude }) => ({ latitude, longitude }));
        setPath(coords);
        setDistance(getTotalDistanceFromCoords(coords));
      }
    } catch (err) {
      Alert.alert('위치 정보 불러오기 실패', (err as Error).message);
    }
  };

  // 2. 실시간 위치 추적 및 지도 표시
  useEffect(() => {
    let subscription: Location.LocationSubscription;
    const startLiveTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('실시간 위치 권한이 필요합니다.');
        return;
      }

      const initial = await Location.getCurrentPositionAsync({});
      const start = {
        latitude: initial.coords.latitude,
        longitude: initial.coords.longitude,
      };
      setCurrentLocation(start);
      setPath((prev) => {
        if (prev.length === 0) {
          const updated = [start];
          setDistance(getTotalDistanceFromCoords(updated));
          return updated;
        } else {
          return prev;
        }
      });

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 10,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          const newPosition = { latitude, longitude };
          setCurrentLocation(newPosition);
          setPath((prev) => {
            const updated = [...prev, newPosition];
            setDistance(getTotalDistanceFromCoords(updated));
            return updated;
          });
          mapRef.current?.animateToRegion({
            ...newPosition,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      );
    };

    fetchInitialPath();
    startLiveTracking();

    return () => {
      if (subscription) subscription.remove();
    };
  }, [day, month, year]);

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
      {/* <View style={styles.distanceOverlay}>
        <Text style={styles.distanceText}>
          오늘의 이동 거리 :{' '}
          {distance !== null ? `${(distance / 1000).toFixed(2)} km` : '계산 중...'}
        </Text>
      </View> */}
      <TouchableOpacity style={styles.button} onPress={moveToCurrentLocation}>
        <MyLocationIcon color="#021730" />
      </TouchableOpacity>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation?.latitude || 37.5665,
          longitude: currentLocation?.longitude || 126.978,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {path.length > 0 && (
          <Marker coordinate={path[0]}>
            <View style={styles.startPin}>
              <Text style={styles.startPinText}>S</Text>
            </View>
          </Marker>
        )}
        {path.length > 1 && (
          <Marker coordinate={path[path.length - 1]}>
            <View style={{ backgroundColor: '#FFF1C2', padding: 10, borderRadius: 20 }}>
              <Text style={{ color: '#333' }}>도착 위치</Text>
            </View>
          </Marker>
        )}
        {currentLocation && (
          <Marker coordinate={currentLocation}>
            <View>
              <MyMapPositionIcon color="#1E90FF" />
            </View>
          </Marker>
        )}
        {path.length > 1 && <Polyline coordinates={path} strokeColor="green" strokeWidth={4} />}
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
