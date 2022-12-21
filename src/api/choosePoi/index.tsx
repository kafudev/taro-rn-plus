/**
 * choosePoi
 *
 *
 */
import * as React from 'react';
import { Overlay } from '../../components/Overlay';
import ChoosePoiView from './ChoosePoiView';

export { ChoosePoiView };

export async function choosePoi(opts: any = {}): Promise<any> {
  const { success, fail, complete } = opts;
  return new Promise((resolve, reject) => {
    Overlay.open(
      <ChoosePoiView
        {...opts}
        fail={(res) => {
          console.log('choosePoi fail', res);
          fail?.(res);
          complete?.(res);
          reject(res);
        }}
        success={(res) => {
          console.log('choosePoi success', res);
          success?.(res);
          complete?.(res);
          Overlay.close();
          resolve(res);
        }}
      />,
      {
        type: 'View',
        modal: true,
        animated: true,
        overlayOpacity: 0,
        overlayPointerEvents: 'auto',
        autoKeyboardInsets: false,
      }
    );
  });
}
