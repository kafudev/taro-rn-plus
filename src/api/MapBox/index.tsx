/**
 * openLocation
 *
 *
 */
import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { sSize } from '../../utils/screen';

export type amapConfig = {
  key: string;
  serviceHost?: string;
  securityJsCode?: string;
  version?: string | number;
  plugins?: string[];
};

export type MapBoxProps = {
  latitude: number;
  longitude: number;
  scale?: number;
  amapConfig?: amapConfig;
  style?: any;
  showCenter?: boolean; // 呈现地图中心点
  showCenterMarker?: boolean; // 显示地图中心点marker
  onMessage?: (res: any) => void;
};

export type MapBoxRef = {
  /**
   * 获取定位
   * @returns
   */
  getCurrentPosition: () => void;
  /**
   * 搜索周边POI
   * @param keyword 关键词
   * @param page 页码
   * @param radius 周边半径
   * @returns
   */
  getPlaceSearch: (
    keyword: string,
    center?: [number, number],
    radius?: number,
    page?: number,
    pageSize?: number
  ) => void;
  /**
   * 移动地图到指定位置
   * @param longitude 经度
   * @param latitude 纬度
   * @returns
   */
  moveTo: (longitude: number, latitude: number) => void;
  /**
   * 设置地图中心点到指定位置
   * @param longitude 经度
   * @param latitude 纬度
   * @returns
   */
  setCenter: (longitude: number, latitude: number) => void;
  webviewRef: any;
};

/**
 * 全局设置高德地图配置
 * @param config 高德地图配置
 */
export const setConfig = (config: amapConfig) => {
  // @ts-ignore
  global.__amap_config = config || {};
  // @ts-ignore
  console.log('MapBox amapConfig', global.__amap_config);
};

const styles = StyleSheet.create({
  mapbox: {
    width: '100%',
    height: '100%',
  },
  centerMarker: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -sSize(24),
    marginTop: -sSize(48),
    width: sSize(48),
    height: sSize(48),
    zIndex: 999,
  },
});

const MapBox = React.forwardRef((props: MapBoxProps, ref) => {
  const {
    latitude,
    longitude,
    scale = 18,
    style,
    showCenter,
    showCenterMarker,
    amapConfig: _amapConfig,
    onMessage,
  } = props;
  // 高德地图配置
  let amapConfig = Object.assign(
    {},
    // @ts-ignore
    global.__amap_config || {
      key: '',
      securityJsCode: '',
    },
    _amapConfig || {}
  );

  if (!amapConfig?.key || !amapConfig?.securityJsCode) {
    console.warn(
      'MapBox use 高德地图Amap js-web key.\n' +
        'MapBox key or securityJsCode  is undefined.\n' +
        'MapBox.setConfig({"key":"","securityJsCode":""}) to set amapConfig.'
    );
  }

  const webviewRef = React.useRef<WebView>(null);

  // 转发ref
  React.useImperativeHandle(ref, () => ({
    getCurrentPosition,
    getPlaceSearch,
    moveTo,
    setCenter,
    webviewRef, // 地图webview
  }));

  // 地图webview消息
  const onWebViewMessage = (event: any) => {
    // console.log('MapBox onWebViewMessage', event.nativeEvent.data);
    let data: any = {};
    try {
      data = JSON.parse(event.nativeEvent.data);
    } catch (e) {
      console.log('onWebViewMessage parse error', e);
    }
    if (
      data?.event &&
      (data?.event === 'getCurrentPosition' ||
        data?.event === 'watchPosition' ||
        data?.event === 'clearWatch')
    ) {
      let Geolocation = require('@react-native-community/geolocation').default;
      if (data?.event === 'getCurrentPosition') {
        Geolocation.getCurrentPosition(
          (position: any) => {
            console.log('Geolocation.getCurrentPosition', position);
            webviewRef?.current?.postMessage(
              JSON.stringify({ event: 'currentPosition', data: position })
            );
          },
          (error: any) => {
            console.log('Geolocation.getCurrentPosition error:', error);
            webviewRef?.current?.postMessage(
              JSON.stringify({ event: 'currentPositionError', data: error })
            );
          },
          data.options
        );
      } else if (data?.event === 'watchPosition') {
        Geolocation.watchPosition(
          (position: any) => {
            console.log('Geolocation.watchPosition', position);
            webviewRef?.current?.postMessage(
              JSON.stringify({ event: 'watchPosition', data: position })
            );
          },
          (error: any) => {
            console.log('Geolocation.watchPosition error:', error);
            webviewRef?.current?.postMessage(
              JSON.stringify({ event: 'watchPositionError', data: error })
            );
          },
          data?.options
        );
      } else if (data?.event === 'clearWatch') {
        Geolocation.clearWatch(data?.watchID);
      }
    }
    onMessage && onMessage(event);
  };

  // 获取定位
  const getCurrentPosition = () => {
    let str = `
      getCurrentPosition();
    `;
    // @ts-ignore
    webviewRef?.current?.injectJavaScript(str);
  };

  // 搜索POI
  const getPlaceSearch = (
    keyword: string = '',
    center: [number, number] = [longitude, latitude],
    radius: number = 200,
    page: number = 1,
    pageSize: number = 10
  ) => {
    if (!center) {
      center = [longitude, latitude];
    }
    // console.log("getPlaceSearch", keyword, center, radius, page, pageSize);
    let str = `
      getPlaceSearch("${keyword}", [${center}], ${radius}, ${page}, ${pageSize});
      `;
    // @ts-ignore
    webviewRef?.current?.injectJavaScript(str);
  };

  // 移动点
  const moveTo = (_longitude: number, _latitude: number) => {
    let str = `
        map.off('moveend', moveEndFun); // 移除地图移动事件
        map.panTo([${_longitude}, ${_latitude}]);
        map.on('moveend', moveEndFun); // 添加地图移动事件
        `;
    // @ts-ignore
    webviewRef?.current?.injectJavaScript(str);
  };

  // 设置地图到中心点
  const setCenter = (_longitude: number, _latitude: number) => {
    let str = `
          map.off('moveend', moveEndFun); // 移除地图移动事件
          map.setCenter([${_longitude}, ${_latitude}], true);
          `;
    // @ts-ignore
    webviewRef?.current?.injectJavaScript(str);
    setTimeout(() => {
      str = `
          map.off('moveend', moveEndFun); // 移除地图移动事件
          map.on('moveend', moveEndFun); // 添加地图移动事件
        `;
      // @ts-ignore
      webviewRef?.current?.injectJavaScript(str);
    }, 500);
  };

  const injectedJS = () => {
    let str = `
      true; // note: this is required, or you'll sometimes get silent failures
    `;
    // 注入定位功能
    str += getGeoLocationJS();
    return str;
  };

  // 注入定位功能到js
  const getGeoLocationJS = () => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const getCurrentPosition = `
      navigator.geolocation.getCurrentPosition = (success, error, options) => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'getCurrentPosition', options: options }));
        // android监听需要用document
        document.addEventListener('message', (e) => {
          let eventData = {}
          try {
            eventData = JSON.parse(e.data);
          } catch (e) {}
          if (eventData.event === 'currentPosition') {
            success(eventData.data);
          } else if (eventData.event === 'currentPositionError') {
            error(eventData.data);
          }
        });
        window.addEventListener('message', (e) => {
          let eventData = {}
          try {
            eventData = JSON.parse(e.data);
          } catch (e) {}
          if (eventData.event === 'currentPosition') {
            success(eventData.data);
          } else if (eventData.event === 'currentPositionError') {
            error(eventData.data);
          }
        });
      };
      true;
    `;
    const watchPosition = `
      navigator.geolocation.watchPosition = (success, error, options) => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'watchPosition', options: options }));
        // android监听需要用document
        document.addEventListener('message', (e) => {
          let eventData = {}
          try {
            eventData = JSON.parse(e.data);
          } catch (e) {}
          if (eventData.event === 'watchPosition') {
            success(eventData.data);
          } else if (eventData.event === 'watchPositionError') {
            error(eventData.data);
          }
        });
        window.addEventListener('message', (e) => {
          let eventData = {}
          try {
            eventData = JSON.parse(e.data);
          } catch (e) {}
          if (eventData.event === 'watchPosition') {
            success(eventData.data);
          } else if (eventData.event === 'watchPositionError') {
            error(eventData.data);
          }
        });
      };
      true;
    `;
    const clearWatch = `
      navigator.geolocation.clearWatch = (watchID) => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'clearWatch', watchID: watchID }));
      };
      true;
    `;
    return `
      (function() {
        ${getCurrentPosition}
        ${watchPosition}
        ${clearWatch}
      })();
      true; // note: this is required, or you'll sometimes get silent failures
    `;
  };
  const mapHtml = `<!DOCTYPE html>
  <html lang="zh" style="height: 100%;padding:0;margin:0;">
    <head>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <meta
        content="width=device-width,initial-scale=1,user-scalable=yes"
        name="viewport"
      />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-touch-fullscreen" content="yes" />
      <meta name="format-detection" content="telephone=no,address=no" />
      <meta name="apple-mobile-web-app-status-bar-style" content="white" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <title>地图</title>
      <style>
        .amap-copyright{
          display: none !important;
        }
      </style>
    </head>
    <body style="display: flex;width: 100%;height: 100%;padding:0;margin:0;">
      <div id="container" style="flex:1;width:100%; height: 100%"></div>
      <script type="text/javascript">
        window._AMapSecurityConfig = {
            // serviceHost: "${amapConfig?.serviceHost || ''}",
            securityJsCode: "${amapConfig?.securityJsCode || ''}",
        }
      </script>
      <script src="https://webapi.amap.com/maps?v=2.0&key=${
        amapConfig?.key || ''
      }"></script>
      <script type="text/javascript">
        // 地图初始化应该在地图容器div已经添加到DOM树之后
        var geolocation;
        var placeSearch;
        // 创建一个 Marker 实例：
        var map = new AMap.Map('container', {
          zoom:${scale || 16},//级别
          center: [${longitude}, ${latitude}],//中心点坐标
        });
        //添加点标记，并使用自己的icon
        let marker= new AMap.Marker({
            position:  [${longitude}, ${latitude}],//位置
            offset: new AMap.Pixel(-15, -35),
            icon: new AMap.Icon({
              image:'https://flatoss.oss-cn-shanghai.aliyuncs.com/test/20220226/1645848205223_mapAddress.png',
              imageSize: new AMap.Size(30, 33)//图标大小
            })
        });
        let showCenterMarker = ${showCenterMarker || false} || false
        if(showCenterMarker){
          map.add(marker)
        }
        map.plugin(["AMap.ToolBar","AMap.Scale", 'AMap.Geolocation', 'AMap.PlaceSearch'],function(){
            // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
            map.addControl(new AMap.ToolBar({position:"RB", offset: [20,80]}));

            // 比例尺，显示当前地图中心的比例尺
            map.addControl(new AMap.Scale());

            // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
            geolocation = new AMap.Geolocation({
              position:"RB",
              offset: [20,20],
              useNative: false,
              zoomToAccuracy: true,
              enableHighAccuracy: true, // 进行浏览器原生定位的时候是否尝试获取较高精度，可能影响定位效率，默认为false
              noIpLocate: 0, // 是否禁用IP精确定位，默认为0，0:都用 1:手机上不用 2:PC上不用 3:都不用
              noGeoLocation: 0, // 是否禁用浏览器原生定位，默认为0，0:都用 1:手机上不用 2:PC上不用 3:都不用
            })
            map.addControl(geolocation);

            // 插件加载完成
            let dd = {
              type: 'plugin_loaded',
            }
            window.ReactNativeWebView.postMessage(JSON.stringify(dd))
        });

        // 地图移动事件
        let moveEndFun = (e) => {
          // 获取地图中心点
          currentCenter = map.getCenter()
          this.center = [currentCenter.lng, currentCenter.lat]
          let dd = {
            type: 'moveend',
            longitude: currentCenter.lng,
            latitude: currentCenter.lat,
            tt: e.type,
          }
          window?.ReactNativeWebView?.postMessage(JSON.stringify(dd))
        }
        // 绑定事件移动地图事件
        map.on('moveend', moveEndFun)

        // 地图加载完成事件
        let completeFun = (e) => {
          // 获取地图中心点
          currentCenter = map.getCenter()
          this.center = [currentCenter.lng, currentCenter.lat]
          let dd = {
            type: 'complete',
            longitude: currentCenter.lng,
            latitude: currentCenter.lat,
          }
          window?.ReactNativeWebView?.postMessage(JSON.stringify(dd))
        }
        // 绑定事件移动地图事件
        map.on('complete', completeFun)

        // 定位方法
        function getCurrentPosition() {
          if(geolocation) {
            geolocation.getCurrentPosition(function(status,result){
              console.log('getCurrentPosition',status, result)
              if(status=='complete'){
                  // onComplete(result)
                  let dd = {
                    type: 'geolocation_complete',
                    status: status,
                    result: result,
                  }
                  window?.ReactNativeWebView?.postMessage(JSON.stringify(dd))
              } else {
                  // onError(result)
                  let dd = {
                    type: 'geolocation_error',
                    status: status,
                    result: result,
                  }
                  window?.ReactNativeWebView?.postMessage(JSON.stringify(dd))
              }
            });
          }
        }

        // 根据关键字搜索附近地点
        function getPlaceSearch(keyword='', center=[], radius = 2000, page = 1, pageSize = 10) {
          let PlaceSearchOptions = {
            city: "全国", //兴趣点城市
            type: '',
            // type: '汽车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|地名地址信息', // 兴趣点类别
            pageSize: pageSize, //每页结果数,默认10
            pageIndex: page, //请求页码，默认1
            extensions: "base", //返回信息详略，默认为base（基本信息）,
            autoFitView: false, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
          };
          placeSearch = new AMap.PlaceSearch(PlaceSearchOptions); //构造PlaceSearch类
          if(placeSearch) {
            //根据地图中心点查附近地点
            placeSearch.searchNearBy(keyword, center, radius, (status, result) => {
              console.log(status, result)
              if (status == 'complete') {
                // this.lists = result.poiList.pois //将查询到的地点赋值
                // console.log(result.poiList.pois)
                let dd = {
                  type: 'placeSearch_complete',
                  status: status,
                  result: result,
                }
                window?.ReactNativeWebView?.postMessage(JSON.stringify(dd))
              } else {
                let dd = {
                  type: 'placeSearch_error',
                  status: status,
                  result: result,
                }
                window?.ReactNativeWebView?.postMessage(JSON.stringify(dd))
              }
            })
          }
        }

      </script>
    </body>
  </html>
  `;

  // console.log(mapHtml)
  return (
    <View style={{ ...styles.mapbox, ...style }}>
      {/* @ts-ignore */}
      <WebView
        ref={webviewRef}
        style={Object.assign({
          height: '100%',
          width: '100%',
        })}
        source={{
          html: mapHtml,
        }}
        mixedContentMode="always"
        androidHardwareAccelerationDisabled
        originWhitelist={['*']}
        androidLayerType="hardware"
        scalesPageToFit={false}
        geolocationEnabled={true}
        javaScriptEnabled={true}
        // geolocationEnabled
        nestedScrollEnabled
        onMessage={onWebViewMessage}
        injectedJavaScript={injectedJS()}
        //   injectedJavaScript={`
        //    document.documentElement.style.padding = 0;
        //    document.documentElement.style.margin = 0;
        //    document.body.style.padding = 0;
        //    document.body.style.margin = 0;
        //    window.ReactNativeWebView.postMessage(document.body.scrollHeight);
        //    true;
        //  `}
      />
      {showCenter ? (
        <Image
          style={styles.centerMarker}
          source={require('./center.png')}
          // mode='aspectFill'
        />
      ) : null}
    </View>
  );
});

// @ts-ignore
MapBox.setConfig = setConfig;
export default MapBox;
