import codePush from 'react-native-code-push';
import Toast from '../../components/Toast';
const hotUpdate = {
  updateText: '正在检测更新',
  showLog: true,
  // 检查更新
  check: function ({ codepush_key, showLog }) {
    // 忽略开发模式
    if (global.__DEV__) {
      return true;
    }
    this.showLog = showLog;
    console.log('codePush check', this.updateText);
    // this.showLog && Toast.text(this.updateText)
    const codepushKey = codepush_key;
    codePush
      .checkForUpdate(codepushKey)
      .then((updateText) => {
        console.log('codePush check', updateText);
        if (!updateText) {
          this.updateText = '当前是最新配置';
          // this.showLog && Toast.text(this.updateText)
        } else {
          codePush
            .sync(
              {
                deploymentKey: codepushKey,
                installMode: codePush.InstallMode.IMMEDIATE,
              },
              this.codePushStatusDidChange.bind(this),
              this.codePushDownloadDidProgress.bind(this)
            )
            .catch((e) => {
              console.log('codePush check e', e);
            });
        }
      })
      .catch((err) => {
        console.log('codePush check error', err);
      });
    codePush.notifyAppReady();
  },

  // 处理状态
  codePushStatusDidChange: function (status) {
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.updateText = '正在检查新配置';
        return;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        this.updateText = '正在安装新配置';
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        this.updateText = '将重新打开应用';
        break;
    }
    console.log('codePush codePushStatusDidChange', status, this.updateText);
    this.showLog && Toast.text(this.updateText);
  },

  // 下载进度
  codePushDownloadDidProgress: function (progress) {
    this.updateText = `正在更新配置${(
      (progress.receivedBytes / progress.totalBytes) *
      100
    ).toFixed(2)}%`;
    this.showLog && Toast.text(this.updateText);
  },
};

export default hotUpdate;
