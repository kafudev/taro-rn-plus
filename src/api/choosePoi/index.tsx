/**
 * choosePoi
 *
 *
 */
import * as React from 'react';
import { View, Button } from 'react-native';
import Modal from '../../components/Modal';

const ChoosePoi = () => {
  return (
    <View>
      <Button
        onPress={() => {
          // navigation.navigate('Index');
          // alert('choosePoi');
          Modal.close();
        }}
        title="choosePoi"
      />
    </View>
  );
};

export default ChoosePoi;
