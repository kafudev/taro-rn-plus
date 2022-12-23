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
// @ts-ignore
import { TopView } from 'teaset';
import { Overlay } from '../Overlay';

const { width, height } = Dimensions.get('screen');

export interface BaseSheetProps extends BottomSheetProps {
  children: null | ReactNode;
  onDismiss?: () => void;
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
      let _backHandler: NativeEventSubscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          console.log('hardwareBackPress');
          bottomSheetRef.current?.close();
          props.onDismiss && props.onDismiss();
          return true;
        }
      );
      setBackHandler(_backHandler);
    }

    return () => {
      if (backHandler) {
        backHandler.remove();
      }
      console.log('remove hardwareBackPress');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        props.onDismiss && props.onDismiss();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
BaseSheet.open = (content: ReactNode, props: BaseSheetProps) => {
  const _props = {
    ...{
      onDismiss: () => {
        BaseSheet.close(key);
      },
    },
    ...props,
  };
  const renderChildren = (
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
        // @ts-ignore
        ...(_props.containerStyle || {}),
      }}
    >
      <BaseSheet
        {..._props}
        snapPoints={_props?.snapPoints || ['40%']}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          position: 'absolute',
          zIndex: 999,
          // @ts-ignore
          ...(_props?.style || {}),
        }}
      >
        {content}
      </BaseSheet>
    </View>
  );
  let key = Overlay.open(renderChildren);
  return key;
};
BaseSheet.close = (key?: number) => {
  if (key) {
    TopView.remove(key);
    return;
  }
  TopView.removeAll();
};
BaseSheet.closeAll = () => {
  TopView.removeAll();
};
export { BaseSheet as Sheet };
