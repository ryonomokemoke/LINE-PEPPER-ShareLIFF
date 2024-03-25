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

  const initializeLIFF = () => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID // ローカルではこっち
      })
      .then(() => {
        alert("LIFF init succeeded.");
        // LIFF初期化後、URLからshop_idを取得
        const params = new URLSearchParams(window.location.search);
        const shopId = params.get('shop_id');
        fetchShopInfo(shopId); // fetchShopInfoを呼び出し
      })
      .catch((error) => {
        alert("LIFF init failed.");
        setError(`${error}`);
        alert(error);
      });
  };
  
  const fetchShopInfo = (shopId) => {

    const url = "https://67f0-110-2-51-27.ngrok-free.app/shop_info?shop_id=" + shopId;
    fetch(url, {
      method: "get",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420"
      })
    })
    .then((response) => response.json())
    .then((data) => alert(data))
    .catch((err) => alert(err));

    axios.get(url, {headers: {
      "ngrok-skip-browser-warning": "69420"
    }})
      .then(response => {
        if (!response.name) {
          alert('Empty response received');
        }
        alert(`get response: ${response.data}`)
        setShopInfo(response); // shopInfoをresponse.dataで更新
      })
      .catch(error => {
        setError(`Error fetching shop info: ${error.message}`);
      });
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
            <p>Name: {shopInfo.name}</p>
            <p>{shopInfo}</p>
            {/* 他の情報を表示 */}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
