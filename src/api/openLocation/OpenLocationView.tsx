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
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import MapBox, { MapBoxRef, amapConfig } from '../MapBox';
import { Overlay } from '../../components/Overlay';
import { sSize, sFont } from '../../utils/screen';
import { gcj02_wgs84 } from '../getLocation/cover';

let screenW = Dimensions.get('screen').width;
let screenH = Dimensions.get('screen').height;
// 兼容横竖屏
if (screenW > screenH) {
  screenW = Dimensions.get('screen').height;
  screenH = Dimensions.get('screen').width;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  headerBox: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: sSize(80),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: sSize(15),
    paddingRight: sSize(15),
    paddingBottom: sSize(5),
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    // backgroundColor: "#f60",
    zIndex: 2,
  },
  headerLeftBtn: {
    fontSize: sFont(15),
    fontWeight: '400',
    color: '#fff',
    paddingLeft: sSize(10),
    paddingRight: sSize(10),
    paddingBottom: sSize(5),
    paddingTop: sSize(5),
    borderRadius: sSize(5),
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
    flex: 1,
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
    marginTop: sSize(6),
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
      // 转换成gps经纬度
      const [gLng, gLat] = gcj02_wgs84(longitude, latitude);
      console.log('gcj02 转 wgs84', longitude, latitude, gLng, gLat);
      // let MapLinking = require('react-native-map-linking').default;
      // MapLinking.markLocation({ lat: latitude, lng: longitude }, name, address);
      if (Platform.OS === 'ios') {
        // ios 使用apple地图
        Linking.openURL(
          `http://maps.apple.com/?ll=${latitude},${longitude}&q=${name || ''}`
        );
      } else {
        Linking.openURL(`geo:${gLat},${gLng}?q=${name || ''}`);
      }
    }
  };

  // 返回
  const handleBack = () => {
    console.log('返回openLocation');
    const res = {
      errMsg: 'openLocation:cancel',
    };
    success?.(res);
    complete?.(res);
    Overlay.close();
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
        <View style={styles.headerBox}>
          <TouchableOpacity
            activeOpacity={0.2}
            onPress={() => {
              handleBack();
            }}
          >
            <Text style={styles.headerLeftBtn}>关闭</Text>
          </TouchableOpacity>
        </View>
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
