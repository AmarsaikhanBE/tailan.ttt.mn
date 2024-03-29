import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 } from 'uuid';

export default async (file: File) => {
  if (!file.size) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const extention = file.name.split('.').pop();
  const pathname = `/assets/${Date.now()}-${v4()}.${extention}`;
  await writeFile(join(process.cwd(), 'public' + pathname), buffer);
  return pathname;

  // return URL.createObjectURL(file);
};
