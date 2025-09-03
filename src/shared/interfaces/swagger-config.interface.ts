'use strict';

export interface ISwaggerConfigInterface {
  title: string;
  path?: string;
  description?: string;
  version: string;
  scheme: 'http' | 'https';
}
