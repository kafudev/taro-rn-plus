/**
 * Sheet
 *
 *
 */

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import {
  View,
  BackHandler,
  Dimensions,
  NativeEventSubscription,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetProps,
} from '@gorhom/bottom-sheet';

import { Overlay } from '../Overlay';

const { width, height } = Dimensions.get('screen');

export interface BaseSheetProps extends BottomSheetProps {
  children: null | ReactNode;
}
const BaseSheet = (props: BaseSheetProps) => {
  const [sheetProps, setSheetProps] = useState({ ...props });
  const [backHandler, setBackHandler] = useState<NativeEventSubscription>();

  useEffect(() => {
    console.log('useEffect props', props);
    setSheetProps({ ...props });
  }, [props]);

  useEffect(() => {
    if (!backHandler) {
      const _backHandler: NativeEventSubscription =
        BackHandler.addEventListener('hardwareBackPress', () => {
          console.log('hardwareBackPress');
          bottomSheetRef.current?.close();
          BaseSheet.close();
          return true;
        });
      setBackHandler(_backHandler);
    }

    return () => {
      if (backHandler) {
        backHandler.remove();
      }
      console.log('remove hardwareBackPress');
    };
  }, [backHandler]);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  // 面板可伸缩的高度
  const snapPoints = useMemo(() => ['40%', '50%'], []);
  // callbacks
  const handleSheetChanges = useCallback(
    (index) => {
      console.log('handleSheetChanges', index);
      if (index === -1) {
        if (backHandler) {
          backHandler.remove();
        }
        BaseSheet.close();
      }
    },
    [backHandler]
  );

  // 打开底部弹窗
  // bottomSheetRef.current?.present();

  // 关闭底部弹窗
  // bottomSheetRef.current?.close();

  // renders
  const renderBackdrop = React.useCallback(
    (_props) => (
      <BottomSheetBackdrop
        opacity={0.35}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={'close'}
        {..._props}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      {...sheetProps}
      snapPoints={sheetProps?.snapPoints || snapPoints}
    >
      {sheetProps?.children}
    </BottomSheet>
  );
};
BaseSheet.open = (content: ReactNode, props: any) => {
  const _props = {
    ...{},
    ...props,
  };
  const renderChildren = () => {
    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          margin: 0,
          position: 'absolute',
          zIndex: 99999,
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          flex: 1,
          width: width,
          height: height,
          backgroundColor: 'rgba(0,0,0,0)',
          justifyContent: 'flex-end',
          ...(_props.containerStyle || {}),
        }}
      >
        <BaseSheet
          snapPoints={undefined}
          {..._props}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            position: 'absolute',
            zIndex: 99999,
            ...(_props.style || {}),
          }}
        >
          {content}
        </BaseSheet>
      </View>
    );
  };
  Overlay.open(renderChildren);
};
BaseSheet.close = () => {
  Overlay.close();
};
export { BaseSheet as Sheet };
