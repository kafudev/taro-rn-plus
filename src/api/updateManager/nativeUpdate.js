import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
const nativeUpdate = {
  updateText: '正在检测更新',
  // 检查更新
  check: function ({ app_key, channel_key, versionNumber }) {
    // 忽略开发模式
    if (global.__DEV__) {
      return true;
    }

    // todo: 检查更新
  },
};

export default nativeUpdate;
