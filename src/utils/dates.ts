export function calculateEndDate(startDate: string, duration: string): string {
    if (!startDate || !duration) return "";
    const start = new Date(startDate);
    const days = parseInt(duration, 10);
    if (isNaN(days)) return "";
    start.setDate(start.getDate() + days);
    return start.toISOString().split("T")[0];
}