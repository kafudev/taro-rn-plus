/**
 * choosePoi
 *
 *
 */
import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import type { amapConfig } from '../../api/MapBox';
import MapBox, { MapBoxRef } from '../../api/MapBox';
// import { sSize } from '../../utils/screen';

const styles = StyleSheet.create({
  mapbox: {
    width: '100%',
    height: '100%',
  },
});
export type MapProps = {
  latitude: number;
  longitude: number;
  scale?: number;
  minScale?: number;
  maxScale?: number;
  markers?: any[];
  covers?: any[];
  polyline?: any[];
  circles?: any[];
  controls?: any[];
  includePoints?: any[];
  polygons?: any[];
  showLocation?: boolean;
  showCompass?: boolean;
  showScale?: boolean;
  enableOverlooking?: boolean;
  enableZoom?: boolean;
  enableScroll?: boolean;
  enableRotate?: boolean;
  enableSatellite?: boolean;
  enableTraffic?: boolean;
  includePadding?: any;
  groundOverlays?: any[];
  tileOverlay?: any[];
  enablePoi?: boolean;
  enableBuilding?: boolean;
  enable3D?: boolean;
  onTap?: (e: any) => void;
  onMarkerTap?: (e: any) => void;
  onLabelTap?: (e: any) => void;
  onControlTap?: (e: any) => void;
  onCalloutTap?: (e: any) => void;
  onUpdated?: (e: any) => void;
  onRegionChange?: (e: any) => void;
  onPoiTap?: (e: any) => void;
  onCallOutTap?: (e: any) => void;
  onAnchorPointTap?: (e: any) => void;
  onPanelTap?: (e: any) => void;
  onInitComplete?: (e: any) => void;
  style?: StyleSheet.NamedStyles<ViewStyle>;
  amapConfig?: amapConfig;
};

/**
 * 全局设置高德地图配置
 * @param config 高德地图配置
 */
export const setConfig = (config: amapConfig) => {
  // @ts-ignore
  MapBox.setConfig(config);
};

const Map = (props: MapProps) => {
  const {
    latitude,
    longitude,
    scale = 16,
    style,
    amapConfig: _amapConfig,
    ..._extProps
  } = props;
  const mapboxRef = React.createRef<MapBoxRef>();

  // 地图webview消息
  const onMapBoxMessage = (e: { nativeEvent: { data: string } }) => {
    let data = JSON.parse(e.nativeEvent.data);
    console.log('onMapBoxMessage', e.nativeEvent.data, data);
    if (data.type === 'complete') {
      // 地图加载完成
      props?.onInitComplete?.(data);
    }
    if (data.type === 'moveend') {
      // 地图移动结束
      props?.onRegionChange?.(data);
    }
  };
  return (
    <MapBox
      ref={mapboxRef}
      style={{ ...styles.mapbox, ...style }}
      longitude={longitude}
      latitude={latitude}
      scale={scale}
      showCenter={false}
      showCenterMarker={false}
      amapConfig={_amapConfig}
      onMessage={onMapBoxMessage}
      {..._extProps}
    />
  );
};

Map.setConfig = setConfig;
export { Map };
