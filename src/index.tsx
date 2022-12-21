import MapBox from './api/MapBox';
import { openLocation, OpenLocationView } from './api/openLocation/index';
import { chooseLocation, ChooseLocationView } from './api/chooseLocation/index';
import { choosePoi, ChoosePoiView } from './api/choosePoi/index';
import { updateManager } from './api/updateManager/index';

export { openLocation, OpenLocationView };
export { chooseLocation, ChooseLocationView };
export { choosePoi, ChoosePoiView };
export { updateManager };
export { MapBox };

export { Modal } from './components/Modal';
export { Sheet } from './components/Sheet';
export { Toast } from './components/Toast';
export { Overlay, RootView, RootSiblingParent } from './components/Overlay';
// @ts-ignore
export { TopView, NavigationBar } from 'teaset';

// 返回sSize, sFont
export { sSize, sFont } from './utils/screen';

// 如果是Taro, 则需要将chooseLocation, choosePoi, openLocation, updateManager添加到Taro的api中
if (process.env.TARO_ENV === 'rn') {
  const Taro = require('@tarojs/taro').default;
  if (Taro) {
    Taro.openLocation = openLocation;
    Taro.chooseLocation = chooseLocation;
    Taro.choosePoi = choosePoi;
    Taro.updateManager = updateManager;
  }
  // Taro.api = {
  //   ...Taro.api,
  //   openLocation,
  //   chooseLocation,
  //   choosePoi,
  //   updateManager,
  // };
}
