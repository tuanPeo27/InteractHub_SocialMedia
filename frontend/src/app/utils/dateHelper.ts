/**
 * Chuyển đổi thời gian UTC sang giờ Việt Nam (UTC+7)
 * Trừ 7 giờ từ thời gian UTC
 */
export const getVietnamTime = (utcDateString: string): Date => {
    const utcDate = new Date(utcDateString);
    const vietnamDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
    return vietnamDate;
};
