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
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ModalIndicator as TModal, TopView } from 'teaset';
import { Overlay } from '../Overlay';

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
const BaseModal = (props: BaseModalProps) => {
  // const context = useContext(ModalContext);
  // console.log('BaseModal context', context);

  const [target, setTarget] = useState<String | null>(null);
  const [isNow, setIsNow] = useState<boolean>(false);
  const [modalProps, setModalProps] = useState<BaseModalProps>({
    ...{
      opacity: 0.35,
      show: false,
      enableTouchThrough: false,
      pressBehavior: 'none', // 'none' | 'close' | 'through' | () => {}
    },
    ...props,
  });

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

BaseModal.open = (content: any, props: any) => {
  const _props = {
    ...{
      type: 'View',
      modal: false, // 默认模态，不允许点击遮罩关闭
      animated: true,
      _type: 'zoomIn',
      overlayOpacity: 0.4,
      overlayPointerEvents: 'auto',
      autoKeyboardInsets: false,
      style: { alignItems: 'center', justifyContent: 'center' },
      onCloseRequest: () => {
        // console.log('onCloseRequest', key);
        if (props?.modal !== true) {
          if (key) {
            BaseModal.close(key);
          } else {
            BaseModal.close();
          }
          return;
        }
      },
    },
    ...props,
  };
  // !暂不使用原生Modal，会与兼容性问题
  // const renderChildren = (
  //   <>
  //     <BaseModal
  //       show={true}
  //       containerStyle={{
  //         ..._props.containerStyle,
  //       }}
  //       setShow={() => {
  //         if (key) {
  //           BaseModal.close();
  //         } else {
  //           BaseModal.closeAll();
  //         }
  //       }}
  //       enableTouchThrough={false}
  //       pressBehavior="close"
  //     >
  //       {content}
  //     </BaseModal>
  //   </>
  // );
  const renderChildren = <>{content}</>;
  let key = Overlay.open(renderChildren, _props);
  return key;
};
BaseModal.close = (key?: number) => {
  if (key) {
    TopView.remove(key);
    return;
  }
  TopView.removeAll();
};
BaseModal.closeAll = () => {
  TopView.removeAll();
};
export { BaseModal as Modal };
