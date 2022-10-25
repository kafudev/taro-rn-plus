/**
 * Modal
 *
 *
 */
import React from 'react';
import { useState, useEffect, ReactNode } from 'react';
import {
  GestureResponderEvent,
  Modal,
  ModalProps,
  NativeSyntheticEvent,
  StyleProp,
  View,
} from 'react-native';
import Overlay from '../Overlay';

import { ModalContext } from './modalContext';
export { ModalContext };

export interface BaseModalProps extends ModalProps {
  opacity?: number;
  show: boolean;
  setShow: Function;
  containerStyle?: StyleProp<any>;
  onRequestClose?: ((event: NativeSyntheticEvent<any>) => void) | undefined;
  enableTouchThrough: boolean;
  pressBehavior: 'close' | 'none' | 'through' | Function;
  children?: null | ReactNode;
}
const BaseModal = (
  props: BaseModalProps = {
    opacity: 0.35,
    show: false,
    setShow: () => {},
    enableTouchThrough: false,
    pressBehavior: 'none', // 'none' | 'close' | 'through' | () => {}
  }
) => {
  // const context = useContext(ModalContext);
  // console.log('BaseModal context', context);

  const [target, setTarget] = useState<String | null>(null);
  const [isNow, setIsNow] = useState<boolean>(false);
  const [modalProps, setModalProps] = useState<BaseModalProps>({ ...props });

  useEffect(() => {
    console.log('useEffect props', props);
    setModalProps({ ...props });
  }, [props]);

  return (
    <Modal
      transparent={true}
      statusBarTranslucent={true}
      animationType="fade"
      presentationStyle="overFullScreen"
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ margin: 0 }}
      {...modalProps}
      visible={modalProps.show}
      onRequestClose={(e: NativeSyntheticEvent<any>) => {
        if (modalProps.onRequestClose) {
          return modalProps.onRequestClose(e);
        }
        modalProps?.setShow(false);
      }}
    >
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          margin: 0,
          flex: 1,
          backgroundColor: `rgba(0,0,0,${modalProps.opacity})`,
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          ...(modalProps.containerStyle || {}),
        }}
        importantForAccessibility="no-hide-descendants"
        onStartShouldSetResponder={() => {
          if (modalProps.enableTouchThrough) {
            return true;
          }
          return false;
        }}
        onStartShouldSetResponderCapture={() => {
          return false;
        }}
        onMoveShouldSetResponder={() => {
          return false;
        }}
        onMoveShouldSetResponderCapture={() => {
          return false;
        }}
        onResponderTerminationRequest={() => {
          if (isNow === false) {
            return true;
          }
          return false;
        }}
        onLayout={(e: any) => {
          console.log(
            'TouchableHighlight onLayout',
            e.nativeEvent.target,
            e.nativeEvent
          );
          const _target: string = e.nativeEvent.target;
          setTarget(_target);
        }}
        pointerEvents={'auto'}
        onResponderRelease={(e: GestureResponderEvent) => {
          console.log('Main onResponderRelease nativeEvent', e.nativeEvent);
          // 遮罩点击
          if (e.nativeEvent.target === target) {
            setIsNow(true);
            if (modalProps.enableTouchThrough) {
              if (typeof modalProps.pressBehavior === 'function') {
                return modalProps.pressBehavior();
              }
              modalProps.pressBehavior === 'close' && modalProps.setShow(false);
              e.stopPropagation();
              e.preventDefault();
              return true;
            }
          } else {
            // 释放点击事件
            setIsNow(false);
          }
        }}
      >
        <View
          pointerEvents="box-none"
          onStartShouldSetResponder={() => {
            return true;
          }}
          onStartShouldSetResponderCapture={() => {
            return false;
          }}
          // onMoveShouldSetResponder={() => {
          //   return true;
          // }}
          // onMoveShouldSetResponderCapture={() => {
          //   return false;
          // }}
          // onResponderTerminationRequest={() => {
          //   return true;
          // }}
          // onResponderRelease={e => {
          //   console.log('View onResponderRelease nativeEvent', e.nativeEvent);
          // }}
        >
          {modalProps.children}
        </View>
      </View>
    </Modal>
  );
};

BaseModal.open = (
  content: any,
  props: BaseModalProps = {
    show: false,
    setShow: () => {
      Overlay.close();
    },
    enableTouchThrough: false,
    pressBehavior: 'close',
  }
) => {
  const renderChildren = () => {
    return (
      <>
        <BaseModal
          {...props}
          show={true}
          containerStyle={{
            ...props.containerStyle,
          }}
        >
          {content}
        </BaseModal>
      </>
    );
  };
  Overlay.open(renderChildren, props);
};
BaseModal.close = () => {
  Overlay.close();
};
export default BaseModal;
