import fs from 'fs';
import path from 'path';

export function resolveClientBuildDir(): string {
  const candidates: Array<string | undefined> = [
    process.env.CLIENT_BUILD_PATH,
    path.resolve(__dirname, '..', 'client', 'build'),
    path.resolve(__dirname, '..', '..', 'client', 'build'),
    path.resolve(process.cwd(), 'client', 'build'),
    '/usr/client/build',
  ];

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // Fallback to the first non-empty candidate or default path
  return candidates.find((candidate): candidate is string => Boolean(candidate)) ?? '/usr/client/build';
}
