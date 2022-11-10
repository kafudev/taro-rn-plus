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
export { checkHotUpdate, checkNativeUpdate, hotUpdate, nativeUpdate };
export default {
  hotUpdate,
  nativeUpdate,
};
