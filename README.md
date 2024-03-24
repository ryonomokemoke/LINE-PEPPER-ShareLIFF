# ShareLIFF とは

カルーセルメッセージを共有するLiffアプリです。
1. liffUrlの?shop_id=*** で仕込まれた値を取得
2. バックエンドのDBから店舗情報取得
3. カルーセルメッセージ作成
4. カルーセルメッセージ共有

# 内部の挙動
liffURL -> netlify にリダイレクト。

# 変更の反映
git push -u origin head すると、自動でnetlifyが読みに行ってビルドし始めます。　