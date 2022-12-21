/**
 * chooseLocation
 *
 *
 */
import * as React from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StyleSheet,
  UIManager,
  Dimensions,
} from 'react-native';
import MapBox, { MapBoxRef, amapConfig } from '../MapBox';
import { sSize, sFont } from '../../utils/screen';

const screenH = Dimensions.get('screen').height;

const upHeight = sSize((screenH / 5) * 3 - sSize(0));
const downHeight = sSize(screenH - ((screenH / 5) * 3 - sSize(0)));
const poiHeight = sSize(screenH - sSize(88));

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
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
  headerRightBtn: {
    fontSize: sFont(14),
    fontWeight: '400',
    color: '#fff',
    backgroundColor: 'rgba(0, 190, 2, 1)',
    paddingLeft: sSize(10),
    paddingRight: sSize(10),
    paddingBottom: sSize(5),
    paddingTop: sSize(5),
    borderRadius: sSize(5),
  },
  mapbox: {
    width: '100%',
    height: upHeight,
    top: 0,
    left: 0,
    zIndex: 1,
  },

  addressBox: {
    width: '100%',
    height: downHeight,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    zIndex: 2,
    borderTopRightRadius: sSize(10),
    borderTopStartRadius: sSize(10),
  },
  inputBox: {
    marginTop: sSize(10),
    marginLeft: sSize(10),
    marginRight: sSize(10),
    marginBottom: sSize(10),
    zIndex: 1,
    width: 'auto',
    height: sSize(40),
    backgroundColor: '#f1f1f1',
    borderRadius: sSize(10),
    paddingLeft: sSize(10),
    paddingRight: sSize(10),
  },
  input: {
    height: '100%',
    width: '100%',
    textAlign: 'center',
  },
  scrollAddress: {
    width: '100%',
    height: '100%',
    // height: sSize(150),
    paddingBottom: sSize(10),
  },
  addressItemTouch: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: sSize(64),
  },
  addressItem: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: sSize(8),
    paddingBottom: sSize(8),
    paddingLeft: sSize(5),
    paddingRight: sSize(5),
    width: '100%',
    height: '100%',
    marginTop: sSize(5),
    marginBottom: sSize(5),
    marginLeft: sSize(10),
    marginRight: sSize(10),
  },
  addressName: {
    color: '#000',
    fontSize: sFont(16),
  },
  addressText: {
    fontSize: sFont(13),
    fontWeight: '400',
    color: '#a0a0a0',
    marginTop: sSize(2),
    opacity: 1,
    flexDirection: 'row',
  },
  addressRight: {
    position: 'absolute',
    width: sSize(24),
    height: sSize(24),
    right: sSize(0),
    marginTop: sSize(15),
    marginRight: sSize(20),
  },
});

export type chooseLocationProps = {
  latitude: number;
  longitude: number;
  name?: string;
  scale?: number;
  type: 'LOCATION' | 'POI';
  amapConfig?: amapConfig;
  success?: (res: any) => void;
  fail?: (res: any) => void;
  complete?: (res: any) => void;
};

const ChooseLocationView = (props: chooseLocationProps) => {
  const {
    latitude,
    longitude,
    scale,
    success,
    // fail,
    complete,
    amapConfig: _amapConfig,
  } = props;
  const mapboxRef = React.createRef<MapBoxRef>();
  const scrollViewRef = React.useRef<any>(null);

  const [first, setFirst] = React.useState<boolean>(true); // 默认初始化
  const [list, setList] = React.useState<any>([]);
  const [page, setPage] = React.useState<number>(1);
  const [address, setAddress] = React.useState<any>(null);
  const [keyword, setKeyword] = React.useState<string>('');
  const [focus, setFocus] = React.useState<boolean>(false);
  const [scroll, setScroll] = React.useState<boolean>(false);

  // 关键词输入
  const onChangeText = (text: string) => {
    setPage(1);
    // 清空选择
    setAddress(null);
    setKeyword(text);
    // 触发搜索
    handleSearch(text, [longitude, latitude], 1);
  };

  // 搜索
  const handleSearch = (
    _keyword: string,
    _center: [number, number],
    _page: number,
    _pageSize: number = 20
  ) => {
    console.log('搜索', _keyword);
    if (_page === 1) {
      // 滑动到头部
      scrollViewRef?.current.scrollTo({ x: 0, y: 0, animated: true });
    }
    if (latitude && longitude) {
      mapboxRef.current?.getPlaceSearch(
        _keyword,
        _center,
        50000,
        _page,
        _pageSize
      );
    }
  };

  // 返回
  const handleBack = () => {
    console.log('返回chooseLocation');
    const res = {
      errMsg: 'chooseLocation:cancel',
    };
    success?.(res);
    complete?.(res);
  };

  // 确认
  const handleConfirm = () => {
    console.log('确认chooseLocation');
    if (address) {
      const res = {
        name: address.name,
        address: address.address,
        latitude: address.latitude,
        longitude: address.longitude,
        errMsg: 'chooseLocation:ok',
      };
      success?.(res);
      complete?.(res);
    }
  };

  // 选中
  const handleSelect = (item: { longitude: number; latitude: number }) => {
    console.log('选中', item);
    setPage(1);
    // 地图移动到对应的点
    mapboxRef.current?.setCenter(item.longitude, item.latitude);
    setAddress(item);
  };

  // 地图webview消息
  const onMapBoxMessage = (e: { nativeEvent: { data: string } }) => {
    let data = JSON.parse(e.nativeEvent.data);
    // console.log('onMapBoxMessage', e.nativeEvent.data, data);
    if (data.type === 'complete') {
      // 地图加载完成
      let _longitude = data.longitude;
      let _latitude = data.latitude;
      setPage(1);
      handleSearch(keyword, [_longitude, _latitude], 1, 30);
    }
    if (data.type === 'moveend') {
      // 地图移动结束
      let _longitude = data.longitude;
      let _latitude = data.latitude;
      setPage(1);
      handleSearch(keyword, [_longitude, _latitude], 1);
    }
    if (data.type === 'placeSearch_complete' && data.status === 'complete') {
      // 搜索结果
      let _list = data.result?.poiList?.pois || [];
      _list.map((item: any) => {
        item.name = item.name;
        item.address = item.address;
        item.distance = item.distance;
        // 格式化距离
        if (item.distance > 1000) {
          item.distance_name = (item.distance / 1000).toFixed(2) + 'km';
        } else {
          item.distance_name = item.distance + 'm';
        }

        item.longitude = item.location?.[0];
        item.latitude = item.location?.[1];
        return item;
      });
      if (page === 1) {
        setList(_list);
      } else {
        setList([...list, ..._list]);
      }

      // !如果是第一次加载，且有数据，就定位到第一个
      if (first && _list.length > 0) {
        setFirst(false);
        setAddress(_list[0]);
      }
    }

    if (data.type === 'placeSearch_error' && data.status === 'no_data') {
      // 无数据
      setPage(1);
      // 清空选择
      setAddress(null);
      setList([]);
    }
  };

  // 滑动
  const onScroll = (event: {
    nativeEvent: {
      contentOffset: { y: any };
      contentSize: { height: any };
      layoutMeasurement: { height: any };
    };
  }) => {
    // console.log('滑动', event.nativeEvent);
    // 判断是否触底
    let _contentOffsetY = event.nativeEvent.contentOffset.y;
    let _contentSizeHeight = event.nativeEvent.contentSize.height;
    let _layoutMeasurementHeight = event.nativeEvent.layoutMeasurement.height;
    // console.log(
    //   '滑动',
    //   _contentOffsetY,
    //   _layoutMeasurementHeight,
    //   _contentSizeHeight
    // );
    // 判断是否触顶
    if (_contentOffsetY <= 0) {
      console.log('滑动触顶');
      setScroll(false);
      return;
    }
    // 判断是否触底
    if (
      _contentOffsetY + _layoutMeasurementHeight >=
      _contentSizeHeight - sSize(220)
    ) {
      console.log('滑动触底');
      // 触发搜索
      setPage(page + 1);
      handleSearch(keyword, [longitude, latitude], page + 1);
      return;
    }
    setScroll(true);
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <TouchableOpacity
          activeOpacity={0.2}
          onPress={() => {
            handleBack();
          }}
        >
          <Text style={styles.headerLeftBtn}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.2}
          onPress={() => {
            handleConfirm();
          }}
        >
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              ...styles.headerRightBtn,
              backgroundColor: address ? 'rgba(0, 190, 2, 1)' : '#aaa',
            }}
          >
            完成
          </Text>
        </TouchableOpacity>
      </View>
      <MapBox
        ref={mapboxRef}
        // @ts-ignore
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          ...styles.mapbox,
          height: props?.type === 'POI' ? 0 : !scroll ? upHeight : downHeight,
          display: props?.type === 'POI' ? 'none' : 'flex',
        }}
        longitude={longitude}
        latitude={latitude}
        scale={scale}
        showCenter
        showCenterMarker={false}
        amapConfig={_amapConfig}
        onMessage={onMapBoxMessage}
      />
      <View
        style={{
          ...styles.addressBox,
          height:
            props?.type === 'POI' ? poiHeight : scroll ? upHeight : downHeight,
          marginTop: props?.type === 'POI' ? sSize(88) : sSize(10),
        }}
      >
        <View style={styles.inputBox}>
          <TextInput
            placeholder="搜索地点"
            returnKeyType="search"
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              ...styles.input,
              textAlign: keyword || focus ? 'left' : 'center',
            }}
            onChangeText={(text) => {
              onChangeText(text);
            }}
            onFocus={() => {
              setFocus(true);
              setScroll(true);
            }}
            onBlur={() => {
              setFocus(false);
            }}
            value={keyword}
          />
        </View>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollAddress}
          onScrollEndDrag={onScroll}
        >
          {list.map((item: any, index: React.Key | null | undefined) => {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.2}
                style={styles.addressItemTouch}
                onPress={() => {
                  handleSelect(item);
                }}
              >
                <View style={styles.addressItem}>
                  <Text style={styles.addressName}>{item?.name}</Text>
                  <Text style={styles.addressText}>
                    {item?.distance_name} | {item?.address}
                  </Text>
                  {address?.name === item?.name ? (
                    <Image
                      style={styles.addressRight}
                      source={require('./ok.png')}
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default ChooseLocationView;
