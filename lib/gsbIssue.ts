export function issueLabelForDisplay(n: number): string {
  const x = n >= 1000 ? n % 1000 : n;
  return String(x).padStart(3, "0");
}

function parseDrawAt(drawDate: string, drawTime: string | null): Date | null {
  if (!drawDate) return null;
  const time = (drawTime || "22:30:00").slice(0, 8);
  const dt = new Date(`${drawDate}T${time}+08:00`);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export function computeGsbIssueNumber(
  latestIssueNumber: number,
  drawDate: string,
  drawTime: string | null,
  delayMinutes = 30,
  nowMs = Date.now(),
): number {
  const drawAt = parseDrawAt(drawDate, drawTime);
  if (!drawAt) return latestIssueNumber;
  const shouldAdvance = nowMs >= drawAt.getTime() + delayMinutes * 60 * 1000;
  return shouldAdvance ? latestIssueNumber + 1 : latestIssueNumber;
}
