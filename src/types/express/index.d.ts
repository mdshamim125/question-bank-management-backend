// declare global {
//   namespace Express {
//     interface Request {
//       file?: {
//         fieldname: string;
//         originalname: string;
//         encoding: string;
//         mimetype: string;
//         buffer: Buffer;
//         size: number;
//       };
//     }
//   }
// }

// export {};

import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
      files?: {
        [fieldname: string]: Multer.File[];
      };
    }

    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination?: string;
        filename?: string;
        path?: string;
        buffer: Buffer;
      }
    }
  }
}

export {};
