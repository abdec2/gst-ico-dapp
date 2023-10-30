import HeaderComponent from "./components/Header";
import Presale from "./components/Presale";
import FooterComponent from './components/Footer';
import { useContext, useEffect, useState } from "react";
import { GlobalProvider } from "./context/GlobalContext";

import AlertBox from "./components/AlertBox";

function App() {
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
    }

  }, []);
  return (
    <GlobalProvider>

      <div className="container mx-auto px-10 max-w-7xl">
        <div className="min-h-screen">
          
          <HeaderComponent setError={setError} setErrMsg={setErrMsg}/>
          {/* <ShapeDivider /> */}
          <Presale />
        </div>
      </div>
      {error && (<AlertBox  msg={errMsg}/>)}
      <FooterComponent />
    </GlobalProvider>
  );
}

export default App;
