import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'notifications.json');

type RecordEntry = { type: string; reference: string; messageId: string | null; timestamp: string };

function readAll(): RecordEntry[] {
  try {
    const raw = fs.readFileSync(FILE, 'utf8');
    return JSON.parse(raw) as RecordEntry[];
  } catch {
    return [];
  }
}

function writeAll(entries: RecordEntry[]) {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(entries, null, 2));
}

export function alreadyNotified(type: string, reference: string): boolean {
  return readAll().some((e) => e.type === type && e.reference === reference);
}

export function recordNotification(entry: RecordEntry) {
  const all = readAll();
  if (!all.some((e) => e.type === entry.type && e.reference === entry.reference)) {
    all.push(entry);
    writeAll(all);
  }
}
