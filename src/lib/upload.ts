import { rejects } from 'assert';
import { writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { v4 } from 'uuid';

export default async (file: File) =>
  new Promise((resolve) => {
    if (!file.size) return null;

    // const buffer = Buffer.from(await file.arrayBuffer());
    // const extention = file.name.split('.').pop();
    // const pathname = `/${Date.now()}-${v4()}.${extention}`;
    // await writeFile(join(process.cwd(), 'public' + pathname), buffer);
    // return pathname;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
  });
