## 專案介紹
使用者可以依短、中、長期查看自己在 Spotify 收聽的歌曲排行前10名  
使用者可以建立一個點歌本，將連結分享給其他人後，他人就可以在無需登入 Spotify 的情況下新增歌曲至點歌本

## 前置作業
### 環境需求
1. Node.js v14.16.0
2. MySQL:
  * connection:
    * hostname: 127.0.0.1
    * username: root
    * password: password
  * database: spotify_statistic
### 至 Spotify for developers 註冊 app
  請至[這裡](https://developer.spotify.com/dashboard/)建立一個 app 取得 client ID 及 secret  
  並於 Redirect URIs 欄位新增網址 http://localhost:3000/auth/spotify/callback

## 安裝執行步驟
1. 請確認已完成前置作業
2. 下載專案
```
git clone https://github.com/smile19439/spotify-statistic.git
```
3. 切換至專案資料夾
```
cd spotify-statistic
```
4. 安裝套件
```
npm install
```
5. 建立資料庫 Schema
```
npx sequelize db:migrate
```
6. 建立.env檔案，並依.envexample格式填入所需參數
```
touch .env
```
7. 啟動
```
npm run dev
```
8. 輸入此路徑開始使用: http://localhost:3000
