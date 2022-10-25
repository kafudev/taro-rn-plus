/**
 * Overlay
 *
 *
 */

import React, { useState, useEffect, ReactChildren, ReactNode } from 'react';
import { DeviceEventEmitter } from 'react-native';

export interface OverlayProviderProps extends ReactChildren {
  children: any;
  content: null | ReactNode;
}

const OverlayProvider = (props: OverlayProviderProps) => {
  // console.log('OverlayProvider props', props);
  const [content, setContent] = useState(props.content);

  useEffect(() => {
    DeviceEventEmitter.addListener('overlayOpen', (_props) => {
      console.log('addListener overlayOpen', _props);
      setContent(_props.content);
    });
    DeviceEventEmitter.addListener('overlayClose', (_props) => {
      console.log('addListener overlayClose', _props);
      setContent(null);
    });
  }, []);

  return (
    <>
      {props.children}
      {content}
    </>
  );
};

export { OverlayProvider };

function Overlay(props: { children: any }) {
  return <>{props.children}</>;
}

Overlay.open = (content: any, props = {}) => {
  DeviceEventEmitter.emit('overlayOpen', { content, ...props });
  console.log('overlay open');
};
Overlay.close = () => {
  DeviceEventEmitter.emit('overlayClose', {});
  console.log('overlay close');
};
export default Overlay;
