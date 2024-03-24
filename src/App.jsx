import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";

import Form from './components/Form';

function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [shopId, setShopId] = useState("");

  useEffect(() => {
    initializeLIFF();
  }, []);

  const initializeLIFF = () => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID // ローカルではこっち
      })
      .then(() => {
        setMessage("LIFF init succeeded.");
        // LIFF初期化後、URLからshop_idを取得
        const params = new URLSearchParams(window.location.search);
        const shopIdParam = params.get('shop_id');
        setShopId(shopIdParam);
      })
      .catch((error) => {
        setMessage("LIFF init failed.");
        setError(`${error}`);
        alert(error);
      });
  };


  const fetchShopInfo = (shopId) => {
    fetch(`https://example.com/shop_info?shop_id=${shopId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setShopInfo(data);
      })
      .catch(error => {
        setError(`Error fetching shop info: ${error}`);
      });
  };

  return (
    <div className="App">
      
      <h1>店舗を共有</h1>
      {error && (
        <p>
          <code>{error}</code>
        </p>
        
      )}
      {shopId && (
        <p>Shop ID: {shopId}</p>
      )}
      {
        <p>test</p>
      }
      {shopInfo && (
        <div>
          <h2>Shop Information</h2>
          <p>Name: {shopInfo.name}</p>
          <p>Address: {shopInfo.address}</p>
          {/* 他の情報を表示 */}
        </div>
      )}
    </div>
  );
}

export default App;
