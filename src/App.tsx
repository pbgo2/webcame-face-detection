import React from 'react';
import { WebcamFeed } from './components/WebcamFeed';
import { Provider } from 'react-redux';
import { store } from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <div className="container mt-5">
        <h1 className="text-center" style={{color:"#1288f0", fontWeight: "600"}}>Webcam Face Detection</h1>
        <WebcamFeed />
      </div>
    </Provider>
  );
}

export default App;
