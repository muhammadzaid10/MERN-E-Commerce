import { Readable } from "stream";

const bufferGenerator = (file) => {
  const stream = Readable.from(file.buffer);
  // Convert the buffer to a readable stream
  return stream;
};

export default bufferGenerator;