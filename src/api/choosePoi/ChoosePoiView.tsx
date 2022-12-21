/**
 * choosePoi
 *
 *
 */
import * as React from 'react';
import type { amapConfig } from '../MapBox';
import ChooseLocationView from '../chooseLocation/ChooseLocationView';

export type choosePoiProps = {
  latitude: number;
  longitude: number;
  name?: string;
  scale?: number;
  amapConfig?: amapConfig;
  success?: (res: any) => void;
  fail?: (res: any) => void;
  complete?: (res: any) => void;
};

const ChoosePoiView = (props: choosePoiProps) => {
  const { success, complete } = props;

  // 返回
  const handleBack = (_res: any) => {
    console.log('返回choosePoi');
    const res = {
      errMsg: 'choosePoi:cancel',
    };
    success?.(res);
    complete?.(res);
  };

  // 确认
  const handleConfirm = (_res: any) => {
    console.log('确认choosePoi');
    if (_res?.errMsg === 'chooseLocation:cancel') {
      handleBack(_res);
      return;
    }
    if (_res) {
      const res = {
        name: _res.name,
        address: _res.address,
        latitude: _res.latitude,
        longitude: _res.longitude,
        errMsg: 'choosePoi:ok',
      };
      success?.(res);
      complete?.(res);
    }
  };

  return <ChooseLocationView type="POI" {...props} success={handleConfirm} />;
};

export default ChoosePoiView;
