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
      
      setShopId(params.get('shop_id'));
      const fetchedShopInfo =  await fetchShopInfo(shopId); // fetchShopInfoを呼び出し json形式で取得
      setShopInfo(fetchedShopInfo);

      alert("name" + shopInfo.name)
      const shareCarousel = await createCarouselMessage(shopInfo);
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
        })
        .catch((error) => {
            alert('Failed to send message', error);
        }
    );
  }

  const createCarouselMessage = async (responseJson) => {
    alert(responseJson.img_url)
    alert(responseJson.name)
    alert(responseJson.access)
    alert(responseJson.shop_id)
    alert(responseJson.affiliate_url)


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


  const getAffiliateUrl = async (shop_id) => {

    const affiliate_url_top = "https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3690883&pid=889260573&vc_url=https%3A%2F%2Fwww.hotpepper.jp%2Fstr"
    const affiliate_url_bottom = "%2F%3Fvos%3Dnhppvccp99002"

    return affiliate_url_top + shop_id + affiliate_url_bottom
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
      return response; // {'id': None, 'shop_id': 'J000748282', 'name': '魚の飯 調布', 'img_url': 'https://imgfp.hotp.jp/IMGH/26/83/P036812683/P036812683_238.jpg', 'access': '駅近好ｱｸｾｽ/2時間飲み放題付きﾌﾟﾗﾝ3500円～', 'affiliate_url': 'https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3690883&pid=889260573&vc_url=https%3A%2F%2Fwww.hotpepper.jp%2FstrJ000748282%2F%3Fvos%3Dnhppvccp99002', 'review_score': 4.3, 'review_quantity': 24}

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
