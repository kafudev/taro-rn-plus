/* eslint-disable react-native/no-inline-styles */
/**
 * Example
 *
 *
 */

import React from 'react';
import { StatusBar, Button, View } from 'react-native';
import {
  Modal,
  Sheet,
  Toast,
  RootView,
  TopView,
  chooseLocation,
  openLocation,
  getLocation,
  choosePoi,
  Map,
} from 'taro-rn-plus';
StatusBar.setBackgroundColor('rgba(0,0,0,0.3)');
// StatusBar.setTranslucent(true);
// StatusBar.setHidden(false);

Map.setConfig({
  key: 'c6ebbd3113639d2a1c35ba50bef274f7',
  securityJsCode: 'f5e062627795929af202b259c058c905',
});

const App = () => {
  return (
    <RootView>
      <TopView>
        <View
          style={{
            marginTop: 28,
            width: '100%',
            height: '100%',
            backgroundColor: '#fefefe',
          }}
        >
          <View style={{ marginTop: 20 }}>
            <Button
              title="Toast"
              onPress={() => {
                console.log('Toast');
                Toast.text('Toast');
              }}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Button
              title="chooseLocation"
              onPress={() => {
                console.log('chooseLocation');
                chooseLocation({
                  // latitude: '40.113257',
                  // longitude: '116.611279',
                }).then((res) => {
                  console.log('chooseLocation then', res);
                });
              }}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Button
              title="choosePoi"
              onPress={() => {
                console.log('choosePoi');
                choosePoi({
                  // latitude: '40.113257',
                  // longitude: '116.611279',
                }).then((res) => {
                  console.log('choosePoi then', res);
                });
              }}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Button
              title="getLocation"
              onPress={() => {
                console.log('getLocation');
                getLocation({}).then((res) => {
                  console.log('getLocation then', res);
                });
              }}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Button
              title="openLocation"
              onPress={() => {
                console.log('openLocation');
                openLocation({
                  latitude: '40.113257',
                  longitude: '116.611279',
                  name: '金通数字科创园',
                  address: '拱墅区新汇路180号',
                }).then((res) => {
                  console.log('openLocation then', res);
                });
              }}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Button
              title="Map"
              onPress={() => {
                console.log('Map');
                Modal.open(
                  <Map
                    style={{
                      width: 200,
                      height: 200,
                      backgroundColor: '#f60',
                    }}
                    latitude="40.113257"
                    longitude="116.611279"
                  />,
                  { modal: false }
                );
              }}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Button
              title="Modal"
              onPress={() => {
                console.log('Modal');
                Modal.open(
                  <View
                    style={{
                      width: 200,
                      height: 200,
                      backgroundColor: '#f60',
                    }}
                  />,
                  { modal: false }
                );
              }}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Button
              title="Sheet"
              onPress={() => {
                console.log('Sheet');
                Sheet.open(<View />, {});
              }}
            />
          </View>
        </View>
      </TopView>
    </RootView>
  );
};

export default App;
