import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';

function App() {
  const [usbStatus, setUsbStatus] = useState('Aguardando Pendrive...');
  const [usbConnected, setUsbConnected] = useState(false);

  return (
    <Layout usbStatus={usbStatus} usbConnected={usbConnected}>
      <Dashboard onUsbChange={(connected, status) => {
        setUsbConnected(connected);
        setUsbStatus(status);
      }} />
    </Layout>
  );
}

export default App;
