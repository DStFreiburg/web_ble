'use strict';

//BLE
let service        	= 0xBEEF;
let characteristic 	= 0xFEED;
let byteLength		= 20;
//IMU global vars for processing
let rate   = 0;

let poweredOn = false;
let featherCharacteristic = null;
var bluetoothDevice;


function onConnected() {
  document.querySelector('.connect-button').classList.add('hidden');
  document.querySelector('.color-buttons').classList.remove('hidden');
  document.querySelector('.mic-button').classList.remove('hidden');
  document.querySelector('.power-button').classList.remove('hidden');
  poweredOn = true;
}

function connect(){
  //BLE setup. Connect and get service/characteristic notifications
  navigator.bluetooth.requestDevice(
    {
      acceptAllDevices: true,
      optionalServices: optionalServices
      // filters: [{ services: [service] }]
    })
  .then(device => {
    bluetoothDevice = device;
    console.log('> Found ' + device.name);
    console.log('Connecting to GATT Server...');
    bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
    console.log('Connecting to Bluetooth Device...');
    return bluetoothDevice.gatt.connect();
  })
  .then(server => {
    console.log('Getting Service 0xBEEF - Test...');
    return server.getPrimaryService();
  })
  .then(service => {
    console.log('Getting Characteristic 0xFEED - Test...');
    return service.getCharacteristic();
  })
  .then(characteristic => {
    console.log('All ready!');
    featherCharacteristic = characteristic;
    onConnected();
  })
  .then(value => {
      console.log('Value is ' + value.getUint8(0));
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

function reset() {
    let data = new Uint8Array(1);
    return featherCharacteristic.writeValue(data)
      .catch(err => console.log('Error when writing value! ', err));
}

function disconnectButton() {
  if (!bluetoothDevice) {
    return;
  }
  console.log('Disconnecting from Bluetooth Device...');
  if (bluetoothDevice.gatt.connected) {
    bluetoothDevice.gatt.disconnect();
  } else {
    console.log('> Bluetooth Device is already disconnected');
  }
}
