import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";

import axios from 'axios';

function App() {
  const [error, setError] = useState("");
  const [shopId, setShopId] = useState("");
  const [shopInfo, setShopInfo] = useState(null);

  useEffect(() => {
    initializeLIFF();
  }, []);

  const initializeLIFF = async () => {
    try {
      await liff.init({
        liffId: import.meta.env.VITE_LIFF_ID // ローカルではこっち
      });
      alert("LIFF init succeeded.");
      // LIFF初期化後、URLからshop_idを取得
      const params = new URLSearchParams(window.location.search);
      const shopId = params.get('shop_id');
      setShopId(shopId);
      alert(shopId);
      const responseData = await fetchShopInfo(shopId); // fetchShopInfoを呼び出し
      setShopInfo(responseData);
    } catch (error) {
      alert("LIFF init failed.");
      setError(`${error}`);
      alert(error);
    }
  };
  
  const fetchShopInfo = async (shopId) => {
    try {
      const url = "https://62da9f8e44ec.ngrok.app/shop_info?shop_id=" + shopId;
      const response = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "69420"
        }
      });
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      const data = response.data;
      return data;
    } catch (error) {
      console.error('Error fetching shop info:', error);
      throw error;
    }
  };

  return (
    <>
      <div className="App">
        
        <h1>店舗を共有</h1>
        <p>Shop ID: {shopId}</p>
        {error && (
          <p>
            <code>{error}</code>
          </p>
          
        )}
        {shopInfo && (
          <div>
            <h2>Shop Information</h2>
            {/* <p>Name: {shopInfo.name}</p> */}
            {/* 他の情報を表示 */}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
