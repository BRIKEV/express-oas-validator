import { Request, Response, NextFunction } from 'express';
import { Options } from 'ajv';
/**
 * Validator settings
 */
 export type ValidatorOptions = {
  /**
   * - Custom error handler
   */
  errorHandler: Function;
  /**
   * - Ajv config object
   */
  ajvConfig: Options;
};
/**
* Request validation configuration object
*/
export type RequestValidationConfig = {
  /**
   * - Indicates if request body will be validated
   */
  body?: boolean;
  /**
   * - Indicates if path params will be validated
   */
  params?: boolean;
  /**
   * - Indicates if request headers will be validated
   */
  headers?: boolean;
  /**
   * - Indicates if query params will be validated
   */
  query?: boolean;
  /**
   * - Indicates if required fields will be validated
   */
  required?: boolean;
};
export type ValidatorInstance = {
  /**
   * - Method to validate the request
   */
   validateRequest: (options?: RequestValidationConfig) => (req: Request, res: Response, next: NextFunction) => void;
   validateResponse: (payload: any, req: Request, status?: number) => boolean;
};

export function init(openApiDef: any, options?: ValidatorOptions): ValidatorInstance;