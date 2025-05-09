# React + TypeScript + Vite

https://viidhjarta.github.io/setlistconverter/

https://github.com/user-attachments/assets/e890f234-f97e-4d17-816c-8b606cf17326

# SetlistConverter

SetlistConverterは、セットリスト投稿サイト（SetlistFM、LiveFans）からSpotifyプレイリストを自動生成するWebアプリケーションです。

## 開発背景

様々なアーティストのライブに参加する機会が多く，特に普段あまり聴かないアーティストのライブ前には，セットリストを使って予習をする必要性を感じていました．そこで，セットリスト情報を簡単にSpotifyプレイリストに変換できるツールがあれば便利だと考え，本アプリケーションを開発しました．

## 主な機能
- セットリスト投稿サイトのURLからプレイリスト生成
  - SetlistFM
  - LiveFans（国内アーティスト向け）
- アーティスト名からセットリスト検索
- プレイリスト編集機能
  - 間違えている曲の置き換え
  - プレイリストの再生成

## 使用技術

### フロントエンド
- React
- TypeScript
- Vite
- Yamada UI
- Tailwind CSS

### バックエンド
- TypeScript
- Hono
- Puppeteer(LiveFansのスクレイピング)

### その他
- Spotify Web API
- SetlistFM API
- GitHub Pages（フロントエンドのホスティング）
- AWS Lambda
- AWS SAM (サーバレス環境のCLIでの構築)
- AWS CDK（コードでのインフラ管理）

## アーキテクチャ

- フロントエンド：GitHub Pagesでホスティング
- バックエンドAPI：AWS Lambdaを用いたサーバーレス構成
  - SetlistFM：公式APIを使用してセットリスト情報を取得
  - LiveFans：Puppeteerを使用してセットリスト情報をスクレイピング

## 今後の展望

1. 機能の拡張
   - 過去の特定期間のセットリスト検索
   - アーティストの関連情報表示
   - プレイリストの共有機能

2. ユーザー体験の向上
   - 楽曲のマッチング精度の向上
   - より直感的なUI/UXの実現
   - レスポンス速度の改善

## ライセンス

[MIT License](LICENSE)
