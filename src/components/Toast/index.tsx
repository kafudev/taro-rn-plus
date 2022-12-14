/**
 * Toast
 *
 *
 */
import React from 'react';
import { ActivityIndicator } from 'react-native';
// @ts-ignore
import { Toast as TToast, Theme } from 'teaset';

export interface ToastProps {
  text: string | Element;
  type: 'message' | 'success' | 'fail' | 'smile' | 'sad' | 'stop' | 'info';
  position: 'top' | 'bottom' | 'center';
  duration: 'short' | 'long';
  icon: string | Element;
}
// Toast提示
const Toast = {
  // 显示
  show: (
    porps: ToastProps = {
      text: '',
      type: 'message',
      position: 'bottom',
      duration: 'short',
      icon: '',
    }
  ) => {
    let text = porps.text;
    let duration = porps.duration;
    let icon = porps.icon;
    let position = porps.position;
    if (!text) {
      return;
    }
    let xpp: any = {
      text,
      position,
      duration,
    };
    if (icon) {
      xpp.icon = icon;
    }
    TToast.show(xpp);
  },
  // 文字
  text: function (
    text: string | Element = '',
    props: ToastProps = {
      text: '',
      type: 'message',
      position: 'bottom',
      duration: 'short',
      icon: '',
    }
  ) {
    if (!text) {
      return;
    }
    return this.show({ ...props, text: text });
  },
  // 成功
  success: function (str = '操作成功') {
    return TToast.success(str);
  },
  // 警告
  warn: function (str = '操作异常') {
    return TToast.stop(str);
  },
  // 错误
  error: function (str = '操作错误') {
    return TToast.fail(str);
  },
  // 错误
  fail: function (str = '操作错误') {
    return TToast.fail(str);
  },
  // 取消
  cancel: function (str = '取消操作') {
    return TToast.info(str);
  },
  // 加载中
  loading: function (str = '') {
    return TToast.show({
      text: str,
      icon: <ActivityIndicator size="large" color={Theme.toastIconTintColor} />,
      position: 'center',
      duration: 10000,
    });
  },
  // 关闭
  close: function (key?: number) {
    TToast.hide(key);
  },
  // 关闭
  hide: function (key?: number) {
    TToast.hide(key);
  },
};
export { Toast };
