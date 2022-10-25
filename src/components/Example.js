/* eslint-disable react-native/no-inline-styles */
/**
 * Example
 *
 *
 */

import React from 'react';
import { SafeAreaView, StatusBar, Button, View } from 'react-native';
import { OverlayProvider } from './Overlay';
import Modal from './Modal';
import Sheet from './Sheet';
import ChooseLocation from '../api/chooseLocation';
import ChoosePoi from '../api/choosePoi';
import ActionSheet from './Sheet/actionSheet';
StatusBar.setBackgroundColor('rgba(0,0,0,0.3)');
// StatusBar.setTranslucent(true);
// StatusBar.setHidden(false);

const App = () => {
  return (
    <SafeAreaView>
      <OverlayProvider>
        <View style={{ marginTop: 200 }}>
          <Button
            title="chooseLocation"
            onPress={() => {
              console.log('chooseLocation');
              Modal.open(<ChooseLocation />, {
                enableTouchThrough: false,
                containerStyle: {
                  justifyContent: 'flex-start',
                },
              });
            }}
          />
          <View style={{ marginTop: 20 }}>
            <Button
              title="choosePoi"
              onPress={() => {
                console.log('choosePoi');
                Modal.open(<ChoosePoi />, {
                  enableTouchThrough: true,
                });
              }}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Button
              title="sheet"
              onPress={() => {
                console.log('sheet');
                Sheet.open(<ActionSheet />, {
                  enableTouchThrough: true,
                });
              }}
            />
          </View>
        </View>
      </OverlayProvider>
    </SafeAreaView>
  );
};

export default App;
