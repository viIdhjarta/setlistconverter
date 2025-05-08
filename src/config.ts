// 環境に応じたAPI URLの設定

// 開発環境かどうかを判定
const isDevelopment = import.meta.env.MODE === 'development';

// APIのベースURL
export const API_BASE_URL = isDevelopment
  ? 'http://localhost:3030'
  : 'https://0gri69uq0g.execute-api.ap-northeast-1.amazonaws.com/prod';

// APIエンドポイント
export const API_ENDPOINTS = {
  // アーティスト検索
  ARTIST_SEARCH: `${API_BASE_URL}/api/artist/search`,


  // SetlistFM
  SETLISTFM: (setlistId: string) => `${API_BASE_URL}/api/setlistfm/${setlistId}`,
  SETLISTFM_SEARCH: (artistName: string) => `${API_BASE_URL}/api/fetch-html/setlistfm?artist=${artistName}`,

  // LiveFans
  LIVEFANS: (setlistId: string) => `${API_BASE_URL}/api/livefans/${setlistId}`,
  LIVEFANS_SEARCH: (artistName: string) => `${API_BASE_URL}/api/fetch-html/livefans?artist=${artistName}`,
}; 