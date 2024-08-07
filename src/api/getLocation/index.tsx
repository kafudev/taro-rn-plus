/**
 * getLocation
 *
 *
 */
// import { PermissionsAndroid, Platform } from 'react-native';
import { wgs84_gcj02 } from './cover';
export type getLocationProps = {
  altitude?: string;
  highAccuracyExpireTime?: number;
  maximumAge?: number;
  isHighAccuracy?: boolean;
  needFullAccuracy?: boolean;
  type?: 'wgs84' | 'gcj02';
  success?: (res: any) => void;
  fail?: (res: any) => void;
  complete?: (res: any) => void;
};

export async function getLocation(opts: getLocationProps = {}): Promise<any> {
  const Geolocation = require('@react-native-community/geolocation').default;
  const {
    type = 'wgs84',
    isHighAccuracy = false,
    highAccuracyExpireTime = 10000,
    maximumAge = 5000,
    success,
    fail,
    complete,
  } = opts;

  try {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
      locationProvider: 'android', // 'auto' | 'playServices' | 'android'
    });
    return Geolocation.requestAuthorization(
      () => {
        console.log('Geolocation.requestAuthorization success');
        return Geolocation.getCurrentPosition(
          (position: any) => {
            console.log('Geolocation.getCurrentPosition success', position);
            const {
              latitude: _latitude,
              longitude: _longitude,
              altitude,
              accuracy,
              speed,
            } = position?.coords;
            let latitude = _latitude;
            let longitude = _longitude;
            // wgs84 转 gcj02
            if (type === 'gcj02') {
              const [gcj02Lng, gcj02Lat] = wgs84_gcj02(_longitude, _latitude);
              console.log('wgs84 转 gcj02', gcj02Lng, gcj02Lat);
              latitude = gcj02Lat;
              longitude = gcj02Lng;
            }
            const res = {
              latitude,
              longitude,
              speed: speed ?? 0,
              altitude: altitude ?? 0,
              accuracy,
              verticalAccuracy: 0,
              horizontalAccuracy: 0,
              errMsg: 'getLocation:ok',
            };
            success?.(res);
            complete?.(res);
            console.log('resolve');
            return Promise.resolve(res);
          },
          (err: any) => {
            console.log('Geolocation.getCurrentPosition err', err);
            let errMsg = 'getLocation:fail!';
            if (err?.message) {
              errMsg = 'getLocation:' + err.message;
            }
            const res = {
              errMsg,
              err,
            };
            fail?.(res);
            complete?.(res);
            console.log('reject');
            return Promise.reject(res);
          },
          {
            // 当 maximumAge 为 0 时，如果不设置 timeout 或 timeout 太少可能会超时
            timeout: highAccuracyExpireTime || 5000,
            // maximumAge 设置为 0 则会获取当前位置，而不是获取一个前不久缓存的位置
            maximumAge: maximumAge,
            enableHighAccuracy: isHighAccuracy,
          }
        );
      },
      (error: {
        code: number;
        message: string;
        PERMISSION_DENIED: number;
        POSITION_UNAVAILABLE: number;
        TIMEOUT: number;
      }) => {
        console.log('Geolocation.requestAuthorization error', error);
        const res = { errMsg: 'Permissions denied!' };
        fail?.(res);
        complete?.(res);
        return Promise.reject(res);
      }
    );
    // if (Platform.OS === 'ios') {
    //   console.log('ios定位权限被允许');
    // } else {
    //   const permissions = [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
    //   // @ts-ignore
    //   let granteds = await PermissionsAndroid.requestMultiple(permissions);
    //   if (granteds) {
    //     if (granteds['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {
    //       // 定位权限被允许
    //       console.log('android定位权限被允许');
    //     } else {
    //       // 定位权限被拒绝
    //       console.log('android定位权限被拒绝');
    //       const res = { errMsg: 'Permissions denied!' };
    //       fail?.(res);
    //       complete?.(res);
    //       return Promise.reject(res);
    //     }
    //   }
    // }
  } catch (err) {
    let errMsg = 'getLocation:catch fail!';
    const res = {
      errMsg,
      err,
    };
    fail?.(res);
    complete?.(res);
    return Promise.reject(res);
  }
}
