import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentService: DocumentsService) {}

  @Post('/extract-data')
  @UseInterceptors(FileInterceptor('file'))
  extractDataFromDocument(@UploadedFile() file: Express.Multer.File) {
    return this.documentService.extractDataFromDocument(file);
  }
}
