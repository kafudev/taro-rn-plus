/**
 * Overlay
 *
 *
 */

import React from 'react';
import { View, Platform } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
// @ts-ignore
import { Overlay as TOverlay, TopView, Theme } from 'teaset';

Theme.set({ fitIPhoneX: false, screenColor: 'rgba(0,0,0,0)' });

const RootView = (props: any) => {
  const Wrapper = Platform.OS === 'ios' ? React.Fragment : RootSiblingParent;
  return (
    <Wrapper>
      <TopView>{props?.children}</TopView>
    </Wrapper>
  );
};

export { RootView, RootSiblingParent };

const Overlay = TOverlay;

Overlay.open = (content: any, props: any = {}) => {
  // console.log('Overlay.open', content, props);
  let Wrapper: any = View;
  if (props?.type === 'View') {
    Wrapper = TOverlay.View;
  }
  if (props?.type === 'PopView') {
    Wrapper = TOverlay.PopView;
  }
  if (props?.type === 'PullView') {
    Wrapper = TOverlay.PullView;
  }
  if (props?.type === 'PopoverView') {
    Wrapper = TOverlay.PopoverView;
  }
  const renderChildren = (
    <>
      <Wrapper
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ alignItems: 'center', justifyContent: 'center' }}
        modal={false}
        animated={true}
        overlayOpacity={1}
        onAppearCompleted={() => {
          console.log('onAppearCompleted');
        }}
        onDisappearCompleted={() => {
          console.log('onDisappearCompleted');
        }}
        onCloseRequest={() => {
          // console.log('onCloseRequest', key);
          if (key) {
            Overlay.close(key);
          } else {
            Overlay.close();
          }
        }}
        {...props}
        type={props?._type}
      >
        {content}
      </Wrapper>
    </>
  );
  let key = TOverlay.show(renderChildren);
  return key;
};
Overlay.close = (key?: number) => {
  if (key) {
    TopView.remove(key);
    return;
  }
  TopView.removeAll();
};
Overlay.closeAll = () => {
  TopView.removeAll();
};

export { Overlay };
