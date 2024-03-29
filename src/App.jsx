import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";

import axios from 'axios';

function App() {
  const [error, setError] = useState("");
  const [shopId, setShopId] = useState("");
  const [responseDataView, setResponseDataView] = useState(null);
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
      const shopId1 = params.get('shop_id');
      setShopId(shopId1);
      const shopInfo1 = await fetchShopInfo(shopId1); // fetchShopInfoを呼び出し json形式で取得
      alert("shopInfo1" + shopInfo1);
      setShopInfo(shopInfo1);
      alert("shopInfo: " + shopInfo);
      const shareCarousel = await createCarouselMessage(shopInfo1);
      shareMessage(shareCarousel);


    } catch (error) {
      alert("LIFF init failed.");
      setError(`${error}`);
      alert(error);
    }
  };

  const shareMessage = async (message) => {
    liff.shareTargetPicker([message])
        .then(() => {
            // 共有が完了したらウィンドウを閉じる
            // liff.closeWindow();
            console.log("")
        })
        .catch((error) => {
            alert('Failed to send message', error);
        }
    );
  }

  const createCarouselMessage = async (responseJson) => {
    alert(responseJson.img_url)
    // alert(responseJson.name)
    // alert(responseJson.access)
    // alert(responseJson.shop_id)
    // alert(responseJson.shop_id)


    // カルーセルメッセージの内容を設定
    const carouselMessage = {
      type: "template",
      altText: "こちらのお店はどうでしょう",
      template: {
        type: "carousel",
        columns: [
          {
            thumbnailImageUrl: responseJson.img_url,
            title: responseJson.name,
            text: responseJson.access,
            defaultAction: {
              type: "uri",
              label: "店舗URL",
              uri: responseJson.affiliate_url
            },
            actions: [
              {
                type: "uri",
                label: "詳しく見る",
                uri: responseJson.affiliate_url
              },
              {
                type: "uri",
                label: "このお店を共有する",
                uri: "https://liff.line.me/2000472699-9WJ36mXE" + "?" + responseJson.shop_id
              }
            ]
          }
        ],
        imageAspectRatio: "rectangle",
        imageSize: "cover"
      }
    }
    alert(carouselMessage)
    return carouselMessage
  }
  

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
      alert("reesponse.data: " + response.data)
      return response.data; // {'id': None, 'shop_id': 'J001089684', 'name': 'まぐろ一代 エキュート上野店', 'img_url': 'https://imgfp.hotp.jp/IMGH/83/20/P041798320/P041798320_238.jpg', 'access': ' JR東日本 山手線 上野駅 構内 3F  上野駅から125m', 'affiliate_url': 'https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3690883&pid=889260573&vc_url=https%3A%2F%2Fwww.hotpepper.jp%2FstrJ001089684%2F%3Fvos%3Dnhppvccp99002', 'review_score': None, 'review_quantity': None}

    } catch (error) {
      alert('Error fetching shop info:', error);
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
            <pre>{JSON.stringify(shopInfo, null, 2)}</pre>
            <p>Name: {shopInfo.name}</p>
            {/* 他の情報を表示 */}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
