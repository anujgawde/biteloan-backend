import { Injectable } from '@nestjs/common';
const { VertexAI } = require('@google-cloud/vertexai');

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
