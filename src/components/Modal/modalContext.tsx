// modal-context.ts中创建一个context，并设置初始值
import React from 'react';

export const context = {
  show: false,
  opacity: 0.35,
  containerStyle: {},
};

const ModalContext = React.createContext(
  context // 默认值
);

export { ModalContext };
