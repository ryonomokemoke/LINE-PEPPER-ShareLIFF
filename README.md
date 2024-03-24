# SendSearchQuery とは

検索フォームを備えたLiffアプリです。
入力した条件をLinePepperBotが認識できる形で送信されます。

# 使用方法
Lineトーク画面でliffURLを開きます

# 内部の挙動
liffURL -> netlify にリダイレクト。

# 変更の反映
git push -u origin head すると、自動でnetlifyが読みに行ってビルドし始めます。　