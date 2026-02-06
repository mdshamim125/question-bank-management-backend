// import { NextFunction, Request, Response } from "express";
// import { AnyZodObject } from "zod";

// const validateRequest =
//   (schema: AnyZodObject) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await schema.parseAsync({
//         body: req.body,
//       });
//       return next();
//     } catch (err) {
//       next(err);
//     }
//   };

// export default validateRequest;

import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny  } from 'zod';

const validateRequest =
  (schema: ZodTypeAny ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // parse req.body directly
      await schema.parseAsync(req.body);
      return next();
    } catch (err) {
      next(err);
    }
  };

export default validateRequest;
