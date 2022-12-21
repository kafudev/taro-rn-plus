/**
 * 屏幕工具类 以及一些常用的工具类封装
 * ui设计基准,iphone 6 2倍图
 * width:750px
 * height:1334px
 * @2x
 */
import { PixelRatio, Dimensions, Platform } from 'react-native';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
const fontScale = PixelRatio.getFontScale();
// let pixelRatio = PixelRatio.get();
// 以iphone6为基准,如果以其他尺寸为基准的话,请修改下面的defaultWidth和defaultHeight为对应尺寸即可. 以下为1倍图时
// 像素密度
const DEFAULT_DENSITY = 2;
const defaultWidth = 375; // 750/2
const defaultHeight = 667; // 1334/2
// px转换成dp
const w2 = defaultWidth / DEFAULT_DENSITY;
// px转换成dp
const h2 = defaultHeight / DEFAULT_DENSITY;

// 缩放比例
const _scaleWidth = screenW / defaultWidth;
const _scaleHeight = screenH / defaultHeight;

// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;

// 屏幕
const screen = {
  width: screenW,
  height: screenH,
  /**
   * 屏幕适配,缩放size , 默认根据宽度适配，纵向也可以使用此方法
   * 横向的尺寸直接使用此方法
   * 如：width ,paddingHorizontal ,paddingLeft ,paddingRight ,marginHorizontal ,marginLeft ,marginRight
   * @param size 设计图的尺寸
   * @returns {number}
   */
  sSize: function (size: number) {
    return size * _scaleWidth;
  },
  /**
   * 屏幕适配 , 纵向的尺寸使用此方法应该会更趋近于设计稿
   * 如：height ,paddingVertical ,paddingTop ,paddingBottom ,marginVertical ,marginTop ,marginBottom
   * @param size 设计图的尺寸
   * @returns {number}
   */
  scaleHeight: function (size: number) {
    return size * _scaleHeight;
  },
  // 最初版本尺寸适配方案 也许你会更喜欢这个
  // sSize: function (size) {
  //   let scaleWidth = screenW / w2;
  //   let scaleHeight = screenH / h2;
  //   let scale = Math.min(scaleWidth, scaleHeight);
  //   size = Math.round((size * scale + 0.5));
  //   return size / DEFAULT_DENSITY;
  // },
  /**
   * 设置字体的size（单位px）
   * @param size 传入设计稿上的px , alfffflowFontScaling 是否根据设备文字缩放比例调整，默认不会
   * @returns {Number} 返回实际sp
   */
  sFont: function (size: number, allowFontScaling = false) {
    const scale = Math.min(_scaleWidth, _scaleHeight);
    const fontSize = allowFontScaling ? 1 : fontScale;
    return (size * scale) / fontSize;
  },
  sFont2: function (size: number) {
    const scaleWidth = screenW / w2;
    const scaleHeight = screenH / h2;
    const scale = Math.min(scaleWidth, scaleHeight);
    size = Math.round(size * scale + 0.5);

    return (size / DEFAULT_DENSITY) * fontScale;
  },
  /**
   * 判断是否为iphoneX
   * @returns {boolean}
   */
  isIphoneX: function () {
    return (
      Platform.OS === 'ios' &&
      ((screenH === X_HEIGHT && screenW === X_WIDTH) ||
        (screenH === X_WIDTH && screenW === X_HEIGHT))
    );
  },
  /**
   * 根据是否是iPhoneX返回不同的样式
   * @param iphoneXStyle
   * @param iosStyle
   * @param androidStyle
   * @returns {*}
   */
  ifIphoneX: function (iphoneXStyle: any, iosStyle = {}, androidStyle: any) {
    if (this.isIphoneX()) {
      return iphoneXStyle;
    } else if (Platform.OS === 'ios') {
      return iosStyle;
    } else {
      if (androidStyle) {
        return androidStyle;
      }
      return iosStyle;
    }
  },
};

export const sSize = screen.sSize;
export const sFont = screen.sFont;
export default screen;
