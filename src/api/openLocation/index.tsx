/**
 * openLocation
 *
 *
 */
import * as React from 'react';
import { Overlay } from '../../components/Overlay';
import OpenLocationView from './OpenLocationView';

export { OpenLocationView };

export async function openLocation(opts: any = {}): Promise<any> {
  const { success, fail, complete } = opts;
  return new Promise((resolve, reject) => {
    Overlay.open(
      <OpenLocationView
        navigationBar={true}
        {...opts}
        fail={(res) => {
          fail?.(res);
          complete?.(res);
          reject(res);
        }}
        success={(res) => {
          success?.(res);
          complete?.(res);
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
