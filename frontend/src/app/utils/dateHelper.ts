export const getVietnamTime = (utcDateString: string): Date => {
    // ❌ bỏ cộng +7
    return new Date(utcDateString);
};