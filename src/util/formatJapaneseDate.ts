// 日付変換関数を追加
export const formatJapaneseDate = (dateStr: string): string => {
    // dateStrは （DD-MM-YYYY） 形式
    if (!dateStr) return '';

    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month - 1, day);

    // 曜日の配列
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];

    // 日本語形式に整形
    return `${year}年${month}月${day}日（${weekday}）`;
};