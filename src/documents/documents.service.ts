import { Injectable } from '@nestjs/common';
const { DocumentProcessorServiceClient } =
  require('@google-cloud/documentai').v1beta3;
import * as stringSimilarity from 'string-similarity';

@Injectable()
export class DocumentsService {
  async getDocument(): Promise<any> {}

  async extractDataFromDocument(file: Express.Multer.File): Promise<any> {
    const dataSearchArray = {
      customerId: 'Customer ID, Client ID, Account ID, Borrower ID',
      borrowerName:
        'Customer Name, Borrower Name, Client Name, Applicant Name, Account Holder Name',
      totalLoanAmount: 'Total Loan Amount, Total Disbursed Amount',
      currentInstalment:
        'Current payment amount, Current installment payment, Present repayment sum, Ongoing installment amount, Latest repayment installment',
      contactNumber: 'Contact no., Mobile no., Cell phone no.',
      rateOfInterest:
        'Interest rate, Rate of Interest, Annual percentage rate, Loan interest',
      totalAmountPaid: 'Total Amount Paid, Amount Paid, Settled Amount',
      lastEmiDate: 'Loan End Date, Instalment End Date, Last Instalment Date',
    };
    const dataValues = {};
    const client = new DocumentProcessorServiceClient();

    const base64File = Buffer.from(file.buffer).toString('base64');
    const name = `projects/${process.env.DOCUMENT_AI_PROJECT_ID}/locations/${process.env.DOCUMENT_AI_LOCATION}/processors/${process.env.DOCUMENT_AI_PROCESSOR_ID}`;

    const request = {
      name,
      rawDocument: {
        content: base64File,
        mimeType: 'application/pdf',
      },
    };
    const [result] = await client.processDocument(request);

    const { document } = result;

    const { pages } = document;

    const concatenatedFormfields = pages.map((page) => page?.formFields).flat();

    for (const key in dataSearchArray) {
      const fieldNameArray = concatenatedFormfields.map(
        (obj) => obj.fieldName.textAnchor.content,
      );

      const matches = stringSimilarity.findBestMatch(
        dataSearchArray[key],
        fieldNameArray,
      );
      const bestMatch = matches.bestMatch;
      const entry = concatenatedFormfields.find(
        (obj) => obj.fieldName.textAnchor.content === bestMatch.target,
      );
      dataValues[key] =
        entry.fieldValue.textAnchor.content ?? 'Value Not Found';
    }
    console.log(dataValues);
    return dataValues;
  }
}
