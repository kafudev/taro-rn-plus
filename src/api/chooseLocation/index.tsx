/**
 * chooseLocation
 *
 *
 */
import * as React from 'react';
import { Overlay } from '../../components/Overlay';
import ChooseLocationView from './ChooseLocationView';

export { ChooseLocationView };

export async function chooseLocation(opts: any = {}): Promise<any> {
  const { success, fail, complete } = opts;
  return new Promise((resolve, reject) => {
    Overlay.open(
      <ChooseLocationView
        {...opts}
        fail={(res) => {
          fail?.(res);
          complete?.(res);
          reject(res);
        }}
        success={(res) => {
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
