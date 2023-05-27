import { expect } from '@jest/globals';
import {
  convertFromJSONToCSV,
  convertFromJSONToCSVForLandlordReports,
  convertToLocalISOTime,
  formatPhoneNumber,
} from '../utils';

describe('utils', () => {
  test('formatPhoneNumber with a string as an input should match a correct phone number', async () => {
    const str = '4155555555';

    const expectedResults = '(415) 555-5555';

    const results = formatPhoneNumber(str);

    expect(results).toEqual(expectedResults);
  });

  test('formatPhoneNumber with a string as an input should not match an incorrect phone number', async () => {
    const str1 = '415555555555555';
    const str2 = '4155555';
    const str3 = '415-5555-5555';
    const str4 = 'a11111111';

    const results1 = formatPhoneNumber(str1);
    const results2 = formatPhoneNumber(str2);
    const results3 = formatPhoneNumber(str3);
    const results4 = formatPhoneNumber(str4);

    expect(results1).toBeNull();
    expect(results2).toBeNull();
    expect(results3).toBeNull();
    expect(results4).toBeNull();
  });

  test('convertFromJSONToCSV with a JSON as input should match a correct csv output', async () => {
    const jsonObject = [
      {
        id: 1,
        name: 'Foo',
        timestamp: 13455,
      },
      {
        id: 2,
        name: 'Bar',
        timestamp: 13488,
      },
    ];

    const expectedResults = 'id,name,timestamp\n1,Foo,13455\n2,Bar,13488';

    const results = convertFromJSONToCSV(jsonObject);

    expect(results).toEqual(expectedResults);
  });

  test('convertFromJSONToCSV with a JSON as input should not match an incorrect csv output', async () => {
    const jsonObject = [
      {
        id: 1,
        name: 'Foo',
        timestamp: 13455,
      },
      {
        id: 3,
        name: 'Bar',
        timestamp: 1444,
      },
    ];

    const expectedResults = 'id,name,timestamp\n1,Foo,13455\n2,Bar,13488';

    const results = convertFromJSONToCSV(jsonObject);

    expect(results).not.toEqual(expectedResults);
  });

  test('convertFromJSONToCSVForLandlordReports with a JSON as input should match a correct csv output', async () => {
    const jsonObject = [
      {
        landlord: {
          landlordUserToken: '156914284',
          firstName: null,
          lastName: null,
          emails: [],
          phones: [],
        },
      },
      {
        landlord: {
          landlordUserToken: '156914285',
          firstName: 'John',
          lastName: 'Doe',
          emails: ['johndoe@gmail.com'],
          phones: ['3104567891'],
        },
      },
    ];

    const expectedResults =
      'landlordUserToken,firstName,lastName,emails,phones\n156914284,,,,\n156914285,John,Doe,johndoe@gmail.com,3104567891';

    const results = convertFromJSONToCSVForLandlordReports(jsonObject);

    expect(results).toEqual(expectedResults);
  });

  test('convertFromJSONToCSVForLandlordReports with a JSON as input should not match an incorrect csv output', async () => {
    const jsonObject = [
      {
        landlord: {
          landlordUserToken: '156914284',
          firstName: null,
          lastName: null,
          emails: [],
          phones: [],
        },
      },
      {
        landlord: {
          landlordUserToken: '156914285',
          firstName: 'John',
          lastName: 'Doe',
          emails: ['johndoe@gmail.com'],
          phones: ['3104567891'],
        },
      },
    ];

    const expectedResults = 'landlordUserToken,firstName,lastName,emails,phones\n156914284,,,,\n156914222,John,Perez,,';

    const results = convertFromJSONToCSVForLandlordReports(jsonObject);

    expect(results).not.toEqual(expectedResults);
  });

  test('convertToLocalISOTime should match a correct output', async () => {
    /*
     * new Date().toISOString()
     * '2021-10-26T23:55:38.154Z'
     *
     *  Output: '2021-10-26T16:55:38.154'
     *
     */

    const expectedLocalHour = new Date().getHours();
    const results = convertToLocalISOTime();
    const localHour = parseInt(results.split('T')[1].split(':')[0], 10);

    expect(localHour).toEqual(expectedLocalHour);
    expect(results.length).toEqual(23);
  });

  test('convertToLocalISOTime should not match an incorrect output', async () => {
    /*
     * new Date().toISOString()
     * '2021-10-26T23:55:38.154Z'
     *
     *  Output: '2021-10-26T16:55:38.154'
     *
     */

    const expectedLocalHour = new Date().getHours() + 7;
    const results = convertToLocalISOTime();
    const localHour = parseInt(results.split('T')[1].split(':')[0], 10);

    expect(localHour).not.toEqual(expectedLocalHour);
    expect(results.length).not.toEqual(24);
  });
});
