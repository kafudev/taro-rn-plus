/**
 * chooseLocation
 *
 *
 */

import React, { useRef, useEffect, useState } from 'react';
import { View, Button, Platform, Dimensions } from 'react-native';
// @ts-ignore
import { AMapSdk, MapView, MapType } from 'react-native-amap3d';

import Modal from '../../components/Modal';

const { width, height } = Dimensions.get('screen');
const App = () => {
  const refMap = useRef(null);
  const [lng, setLng] = useState(116.37296);
  const [lat, setLat] = useState(39.91095);
  useEffect(() => {
    AMapSdk.init(
      Platform.select({
        android: '29882043e0d079ba281d6444c8c57551',
        ios: 'ed9779f4378a3e32bf282934ea92c20e',
      })
    );
    AMapSdk.getVersion().then((version: any) => {
      console.log('AMapSdk', version);
    });
    return () => {
      refMap.current = null;
    };
  }, []);

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        width: width,
        height: height / 2,
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginTop: 44,
      }}
    >
      <MapView
        ref={refMap}
        mapType={MapType.Standard}
        myLocationEnabled={true}
        compassEnabled={false}
        zoomControlsEnabled={true}
        myLocationButtonEnabled={true}
        rotateGesturesEnabled={false}
        tiltGesturesEnabled={false}
        cameraPosition={{
          latitude: lat,
          longitude: lng,
        }}
        // initialCameraPosition={{
        //   // target: {
        //   //   latitude: lat,
        //   //   longitude: lng,
        //   // },
        //   zoom: 16,
        // }}
        onLoad={() => {
          console.log('onLoad');
        }}
        onPress={(e: { nativeEvent: any }) => {
          console.log('onPress', e.nativeEvent);
        }}
        onCameraIdle={(e: { nativeEvent: any }) => {
          console.log('onCameraIdle', e.nativeEvent);
        }}
        onLocation={(e: {
          nativeEvent: {
            coords: {
              longitude: React.SetStateAction<number>;
              latitude: React.SetStateAction<number>;
            };
          };
        }) => {
          console.log('onLocation', e.nativeEvent);
          e.nativeEvent && setLng(e.nativeEvent.coords.longitude);
          e.nativeEvent && setLat(e.nativeEvent.coords.latitude);
        }}
      />
      <Button title="关闭地图选择" onPress={() => Modal.close()} />
    </View>
  );
};

export default App;
