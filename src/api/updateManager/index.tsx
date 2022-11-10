/**
 * updateManager
 *
 *
 */
// @ts-ignore
import hotUpdate from './hotUpdate.js';
// @ts-ignore
import nativeUpdate from './nativeUpdate.js';

// 热更新检查
const checkHotUpdate = hotUpdate.check;
// 原生更新检查
const checkNativeUpdate = nativeUpdate.check;
export default {
  hotUpdate,
  nativeUpdate,
  checkHotUpdate,
  checkNativeUpdate,
};
