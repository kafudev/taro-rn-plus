/**
 * actionSheet
 *
 *
 */

import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { Overlay } from '../Overlay';

const ActionSheet = () => {
  return (
    <View>
      <Text>弹窗主体内容</Text>
      <Text>-----</Text>
      <Button
        onPress={() => {
          Overlay.close();
        }}
        title="关闭弹窗"
      />
    </View>
  );
};

export default ActionSheet;
