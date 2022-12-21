/**
 * openLocation
 *
 *
 */
import * as React from 'react';
import {
  View,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MapBox, { MapBoxRef, amapConfig } from '../MapBox';
import { NavigationBar } from '../../index';
import { sSize, sFont } from '../../utils/screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  mapbox: {
    width: '100%',
    height: '100%',
    paddingBottom: sSize(95),
  },
  footerBox: {
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 0,
    width: '100%',
    height: sSize(95),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: sSize(15),
  },
  footerLeft: {
    height: sSize(95),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: sSize(15),
  },
  footerName: {
    fontSize: sFont(17),
    fontWeight: '400',
    color: '#333',
  },
  footerAddress: {
    fontSize: sFont(12),
    fontWeight: '400',
    color: '#555',
    marginTop: sSize(4),
  },
  guideIcon: {
    width: sSize(45),
    height: sSize(45),
    borderRadius: sSize(95),
  },
});

export type openLocationProps = {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
  scale?: number;
  amapConfig?: amapConfig;
  navigationBar?: boolean | object;
  success?: (res: any) => void;
  fail?: (res: any) => void;
  complete?: (res: any) => void;
};

const OpenLocationView = (props: openLocationProps) => {
  const {
    latitude,
    longitude,
    name,
    address,
    scale,
    success,
    // fail,
    complete,
    amapConfig: _amapConfig,
  } = props;
  const mapboxRef = React.createRef<MapBoxRef>();

  // 导航
  const handleNav = () => {
    console.log('导航', props);
    if (latitude && longitude) {
      // let MapLinking = require('react-native-map-linking').default;
      // MapLinking.markLocation({ lat: latitude, lng: longitude }, name, address);
      Linking.openURL(`geo:${latitude}, ${longitude}`);
    }
  };

  // 地图webview消息
  const onMapBoxMessage = (e: { nativeEvent: { data: string } }) => {
    let data = JSON.parse(e.nativeEvent.data);
    console.log('onMapBoxMessage', e.nativeEvent.data, data);
    if (data.type === 'complete') {
      // 地图加载完成
      const res = {
        errMsg: 'openLocation:ok',
      };
      success?.(res);
      complete?.(res);
    }
  };

  return (
    <View style={styles.container}>
      {props?.navigationBar && (
        <NavigationBar
          title="地图"
          // eslint-disable-next-line react-native/no-inline-styles
          titleStyle={{ color: '#333' }}
          statusBarStyle="dark-content"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            backgroundColor: '#ffffff',
            position: 'absolute',
            zIndex: 10,
          }}
          leftView={<></>}
          // @ts-ignore
          {...props?.navigationBar}
        />
      )}
      <MapBox
        ref={mapboxRef}
        style={styles.mapbox}
        longitude={longitude}
        latitude={latitude}
        scale={scale}
        showCenter={false}
        showCenterMarker
        amapConfig={_amapConfig}
        onMessage={onMapBoxMessage}
      />
      <View style={styles.footerBox}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerName}>{name || ''}</Text>
          <Text style={styles.footerAddress}>{address || ''}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.2}
          style={styles.guideIcon}
          onPress={() => {
            handleNav();
          }}
        >
          <Image
            style={styles.guideIcon}
            source={require('./location.png')}
            // mode='aspectFill'
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OpenLocationView;
