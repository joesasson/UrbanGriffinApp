import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useGame } from '../context/GameContext';
import landmarksData from '../data/landmarks.json';
import { useSpeech } from '../hooks/useSpeech';
import SpeakButton from '../components/SpeakButton';

const MapViewScreen = ({ navigation }: any) => {
  const { gameState, setCurrentLandmark } = useGame();
  const { speak, stop, isSpeaking } = useSpeech();
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<number | null>(null);

  const getCurrentLocation = useCallback(async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.log('Location error:', error);
      // Default to NYC center if location unavailable
      setUserLocation({
        latitude: 40.7128,
        longitude: -74.0060,
      });
    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      getCurrentLocation();
    } else {
      // Default to NYC center if permission denied
      setUserLocation({
        latitude: 40.7128,
        longitude: -74.0060,
      });
    }
  }, [getCurrentLocation]);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  const handleMarkerPress = (landmarkId: number) => {
    setSelectedLandmark(landmarkId);
  };

  const handleStartHunt = () => {
    if (selectedLandmark) {
      const isCompleted = gameState.keysCollected.includes(selectedLandmark);
      
      if (isCompleted) {
        Alert.alert('Already Completed', 'You have already collected the Key from this landmark!');
        return;
      }

      setCurrentLandmark(selectedLandmark);
      navigation.navigate('Challenge1', { landmarkId: selectedLandmark });
    }
  };

  const handleViewDetails = () => {
    if (selectedLandmark) {
      const landmark = landmarksData.landmarks.find(
        (l) => l.landmarkId === selectedLandmark
      );
      if (landmark) {
        const isCompleted = gameState.keysCollected.includes(selectedLandmark);
        const isChallenge1Completed = gameState.completedChallenges[selectedLandmark]?.challenge1 === true;
        const shouldShowLocation = isCompleted || isChallenge1Completed;
        const locationText = shouldShowLocation 
          ? landmark.location.address 
          : 'Location will be revealed after solving the clue';
        
        Alert.alert(
          landmark.name,
          `Location: ${locationText}\n\nStatus: ${
            isCompleted
              ? '✓ Key Collected'
              : 'Available'
          }`
        );
      }
    }
  };

  const selectedLandmarkData = selectedLandmark
    ? landmarksData.landmarks.find((l) => l.landmarkId === selectedLandmark)
    : null;

  const isSelectedCompleted = selectedLandmark
    ? gameState.keysCollected.includes(selectedLandmark)
    : false;

  // NYC region as default
  const mapRegion = {
    latitude: userLocation?.latitude ?? 40.7128,
    longitude: userLocation?.longitude ?? -74.0060,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {landmarksData.landmarks.map((landmark) => {
          const isCompleted = gameState.keysCollected.includes(
            landmark.landmarkId
          );
          const isCurrent = gameState.currentLandmarkId === landmark.landmarkId;
          const isChallenge1Completed = gameState.completedChallenges[landmark.landmarkId]?.challenge1 === true;
          const shouldShowLocation = isCompleted || isChallenge1Completed;

          return (
            <Marker
              key={landmark.landmarkId}
              coordinate={{
                latitude: landmark.location.coordinates.lat,
                longitude: landmark.location.coordinates.lng,
              }}
              title={landmark.name}
              description={shouldShowLocation ? landmark.location.address : 'Location will be revealed after solving the clue'}
              onPress={() => handleMarkerPress(landmark.landmarkId)}
              pinColor={isCompleted ? '#4a8a5a' : isCurrent ? '#d4af37' : '#1a3a52'}
            />
          );
        })}
      </MapView>

      {selectedLandmark && selectedLandmarkData && (
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>
              {selectedLandmarkData.name}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedLandmark(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {(() => {
            const isChallenge1Completed = gameState.completedChallenges[selectedLandmark]?.challenge1 === true;
            const shouldShowLocation = isSelectedCompleted || isChallenge1Completed;
            
            return (
              <Text style={styles.detailsAddress}>
                {shouldShowLocation 
                  ? selectedLandmarkData.location.address 
                  : 'Location will be revealed after solving the clue'}
              </Text>
            );
          })()}

          {isSelectedCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Key Collected</Text>
            </View>
          )}

          <SpeakButton
            text={selectedLandmarkData.name}
            speak={speak}
            stop={stop}
            isSpeaking={isSpeaking}
            style={styles.speakButton}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.detailsButton]}
              onPress={handleViewDetails}
            >
              <Text style={styles.buttonText}>Details</Text>
            </TouchableOpacity>
            {!isSelectedCompleted && (
              <TouchableOpacity
                style={[styles.button, styles.startButton]}
                onPress={handleStartHunt}
              >
                <Text style={styles.buttonText}>Start Hunt</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendCurrent]} />
          <Text style={styles.legendText}>Current</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendAvailable]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendCompleted]} />
          <Text style={styles.legendText}>Completed</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f2537',
  },
  map: {
    flex: 1,
  },
  detailsCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1a3a52',
    borderRadius: 10,
    padding: 20,
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailsTitle: {
    fontSize: 20,
    color: '#d4af37',
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#8c9ba5',
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsAddress: {
    color: '#8c9ba5',
    fontSize: 14,
    marginBottom: 15,
  },
  speakButton: {
    marginBottom: 12,
  },
  completedBadge: {
    backgroundColor: '#2a4a3a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  completedText: {
    color: '#4a8a5a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    marginHorizontal: 5,
  },
  detailsButton: {
    backgroundColor: '#2a3a4a',
    borderColor: '#5a6a7a',
  },
  startButton: {
    backgroundColor: '#2a4a32',
    borderColor: '#4a8a5a',
  },
  buttonText: {
    color: '#d4af37',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  legend: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#1a3a52',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendCurrent: {
    backgroundColor: '#d4af37',
  },
  legendAvailable: {
    backgroundColor: '#1a3a52',
  },
  legendCompleted: {
    backgroundColor: '#4a8a5a',
  },
  legendText: {
    color: '#e8e8e8',
    fontSize: 12,
  },
});

export default MapViewScreen;
