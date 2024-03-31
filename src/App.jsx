import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";

import axios from 'axios';

function App() {
  const [error, setError] = useState("");
  const [shopId, setShopId] = useState("");

  useEffect(() => {
    initializeLIFF();
  }, []);

  const initializeLIFF = async () => {
    try {
      await liff.init({
        liffId: import.meta.env.VITE_LIFF_ID // ローカルではこっち
      });
      // LIFF初期化後、URLからshop_idを取得
      const params = new URLSearchParams(window.location.search);
      const shopIdFromParams = params.get('shop_id');
      setShopId(shopIdFromParams); // 
      const shopInfoResponse = await fetchShopInfo(shopIdFromParams); // shopIdを元にDBから店舗情報を取得
      const shareCarousel = await createCarouselMessage(shopInfoResponse); // 店舗情報から共有するカルーセルメッセージを作成
      
      liff.shareTargetPicker([shareCarousel]) // カルーセルメッセージを共有
        .then(() => {
            liff.closeWindow(); // 共有が完了したらウィンドウを閉じる
        })
        .catch((error) => {
            alert('Failed to send message', error);
        }
      );

    } catch (error) {
      alert("LIFF init failed.");
      setError(`${error}`);
      alert(error);
    }
  };

  const createCarouselMessage = async (response) => {
    const responseJson = JSON.parse(response) // 文字列できているresponseをjson形式に
     // カルーセルに表示する 店舗へのアクセス、レビュー、レビュー数 のメッセージ
    const shopOverview = `${responseJson.access}\n☆${responseJson.review_score}\n${responseJson.review_quantity}件のレビューの総評\n`
    alert(shopOverview);
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
            text: shopOverview,
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
                uri: "https://liff.line.me/" + import.meta.env.VITE_LIFF_ID + "/shop_info?shop_id=" + responseJson.shop_id
              }
            ]
          }
        ],
        imageAspectRatio: "rectangle",
        imageSize: "cover"
      }
    }
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
      </div>
    </>
  );
}

export default App;
