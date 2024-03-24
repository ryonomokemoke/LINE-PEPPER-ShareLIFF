// HTTPリクエストを送信する関数を定義
const fetchQueries = async () => {
    try {
      // HTTP GETリクエストを送信し、レスポンスを受け取る
      const response = await axios.get('http://localhost:ポート番号/user_query');
      // レスポンスデータをステートに保存
      setResponseData(response.data);
    } catch (error) {
      // エラーが発生した場合はコンソールにログを出力
      console.error('Error fetching data:', error);
    }
};