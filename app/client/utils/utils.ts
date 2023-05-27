import { addMinutes, format } from 'date-fns';

export const formatPhoneNumber = (str: string) => {
  //Filter only numbers from the input
  const cleaned = ('' + str).replace(/\D/g, '');

  //Check if the input is of correct length
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }

  return null;
};

/* Converts JSON to CSV format
  Example of JSON: 
  [
    {
      id: 1,
      name: 'Foo',
      timestamp: new Date(),
    },
    {
      id: 2,
      name: 'Bar',
      timestamp: new Date(),
    },
  ]
*/
export const convertFromJSONToCSV = (arr: ConcatArray<Array<string>> | Array<Record<string, unknown>>) => {
  const array = [Object.keys(arr[0])].concat(arr as ConcatArray<Array<string>>);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join('\n');
};

/* Converts JSON to CSV format for landlords data for reports
  This is for a specific JSON format as follows:
  [
    {
      landlord: {
        landlordUserToken: "156914284",
        firstName: null,
        lastName: null,
        emails: [],
        phones: []
      }
    },
    {
      landlord: {
        landlordUserToken: "156914285",
        firstName: "John",
        lastName: "Doe",
        emails: ["johndoe@gmail.com"],
        phones: ["3104567891"]
      }
    },
  ]
*/
export const convertFromJSONToCSVForLandlordReports = (
  arr: ConcatArray<Array<string>> | Array<Record<string, unknown>>,
) => {
  const array = [Object.keys(Object.values(arr[0])[0] as Record<string, never>)].concat(
    arr as ConcatArray<Array<string>>,
  );

  return array
    .map((it, index) => {
      if (!index) {
        // for the header
        return Object.values(Object.values(it)).toString();
      }
      return Object.values(Object.values(it)[0]).toString();
    })
    .join('\n');
};

/* Converts JSON to CSV format for search policies data
  This is for a specific JSON format as follows:
  [
    {
      createdDate: 1624309011062,
      updatedDate: 1624309299014,
      listingAlias: '3v32tuga55x6b',
      isActive: true,
      policyStatus: 'Active',
      paymentId: { id: 1},
      leaseId: { id: 5},
      applicationId: { id: '46244009883584310881626994336051'},
      policyId: '01F8R5S4KP2EVBV1FE3Q5GSHHW',
      leaseTermStartDate: 1624312058508,
      leaseTermEndDate: 1624312058508,
      policyTermStartDate: 1624308960473,
      policyTermEndDate: 1624309299014,
      landlordUserToken: '12345',
      renterIds: ['23456789', '34567891', '45678912'],
    },
    ...
  ],

  Keys:
  '0': createdDate
  '1': updatedDate
  '2': listingAlias
  '3': isActive
  '4': policyStatus
  '5': paymentId
  '6': leaseId
  '7': applicationId
  '8': policyId
  '9': leaseTermStartDate
  '10': leaseTermEndDate
  '11': policyTermStartDate
  '12': policyTermEndDate
  '13': landlordUserToken
  '14': renterIds
*/
export const convertFromJSONToCSVForSearchPolicies = (arr: ConcatArray<Array<string>> | Array<unknown>) => {
  const array = [Object.keys(arr[0] as string)].concat(arr as ConcatArray<Array<string>>);

  const isDateField = (key: number) => {
    const dateKeys = [0, 1, 9, 10, 11, 12];
    return dateKeys.includes(key);
  };

  const isIdField = (key: number) => {
    const idKeys = [5, 6, 7];
    return idKeys.includes(key);
  };

  const isRenterIdArray = (key: number) => {
    const renterIdKey = [14];
    return renterIdKey.includes(key);
  };

  const replacer = (key: string, value: number | { [s: string]: unknown } | ArrayLike<unknown> | null) => {
    return value === null
      ? ''
      : isDateField(parseInt(key, 10)) // leaseTermStartDate, leaseTermEndDate, policyTermStartDate, policyTermEndDate
      ? typeof value === 'number'
        ? new Date(value).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        : value
      : isIdField(parseInt(key, 10)) // applicationId, leaseId, paymentId
      ? Object.values(value)[0] === null
        ? ''
        : typeof value === 'object'
        ? Object.values(value)[0]
        : value
      : isRenterIdArray(parseInt(key, 10)) && Array.isArray(value) // rentersIds
      ? value.join(', ')
      : value;
  };

  return array
    .map((row) => {
      const rowValues = JSON.stringify(Object.values(row), replacer);
      return rowValues.substring(1, rowValues.length - 1);
    })
    .join('\n');
};

/* Converts new Date().toISOString() to local time
 *
 *  Example:  16:55:38 local time
 *
 *  new Date().toISOString()
 * '2021-10-26T23:55:38.154Z'
 *
 *  Output: '2021-10-26T16:55:38.154'
 */
export const convertToLocalISOTime = () => {
  const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);

  return localISOTime;
};

/* Converts Object date like to Date string format
 *
 * Input: { "year": 2023, "month": 2,"day": 1 }
 *
 *  Output: "2/1/2023"
 */
export const convertObjectToDateFormat = (value: { [s: string]: unknown } | ArrayLike<unknown>) => {
  // value = { "year": 2023, "month": 2,"day": 1 },
  const dateArr = Object.values(value); // dateArr = [2023, 2, 1]
  dateArr.push(dateArr.shift());
  return dateArr.join('/'); // dateStr = "2/1/2023"
};

export const formatToUTC = (date: number | string | Date): string => {
  if (!date) {
    return '';
  }
  const dateObj = new Date(date);
  return format(addMinutes(dateObj, dateObj.getTimezoneOffset()), 'M/dd/yyyy');
};

export const convertCentsToDollarCurrency = (value: string | number | null | Record<string, unknown>) => {
  const dollars = (Number(value) / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return dollars;
};

/* Converts JSON to CSV format for user activity data
  This is for a specific JSON format as follows:
  [
    {
      __typename: 'ListingActivity'
      action: 'optIn',
      userToken: '12345',
      idValue: '3v32tuga55x6b',
      createdDate: 1624309011062,
      message: 'store income to rent flag as true',
    },
    ...
  ],
*/
export const convertFromJSONToCSVForUserActivity = (arr: Array<Record<string, unknown>>, methodToInvoke: string) => {
  let fields = Object.keys(arr[0]).filter((field) => field !== '__typename' && field !== 'idType');

  if (methodToInvoke === 'getUserActivityOptIns') {
    fields = fields.filter((field) => field !== 'message');
  }

  const replacer = (_key: string, value: number | { [s: string]: unknown } | ArrayLike<unknown> | null) => {
    if (value === null) return '';

    if (typeof value === 'number')
      // createdDate
      return new Date(value).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

    return value;
  };

  const csv = arr.map((row) => {
    return fields
      .map((fieldName) => {
        return JSON.stringify(row[fieldName], replacer);
      })
      .join(',');
  });

  // replace header values to match the design
  let index = fields.indexOf('idValue');

  if (index !== -1) {
    fields[index] = 'listingAlias';
  }

  index = fields.indexOf('action');

  if (index !== -1) {
    fields[index] = 'eventType';
  }

  csv.unshift(fields.join(',')); // add header column
  return csv.join('\r\n');
};

/* Count number of occurrences of distinct values from an array of objects
 *
 * Input: ([{ "action": "optIn", ... }], 'action', 'optIn')
 *
 *  Output: 180 - number
 */
export const countNumberOfOccurrencesOfDistinctValuesFromAnArrayOfObjects = (
  arr: Array<Record<string, unknown>>,
  key: string,
  value: string,
) => arr.filter((obj) => obj[key] === value).length;

/* Sort two rows of the react-table for a date column
 * a and b are of the same type:  number, string or Date
 * Input: (a, b)
 *
 *  Output: number
 */
interface ValuesObject {
  [key: string]: string;
}
interface SortableObject {
  values: ValuesObject;
}
export const sortByDate = (
  a: number | string | Date | SortableObject,
  b: number | string | Date | SortableObject,
  id: string,
): number => {
  let a1, b1;
  if (typeof a === 'number' && typeof b === 'number') {
    a1 = a;
    b1 = b;
  } else if (typeof a === 'string' && typeof b === 'string') {
    a1 = new Date(a).getTime();
    b1 = new Date(b).getTime();
  } else if (a instanceof Date && b instanceof Date) {
    a1 = a.getTime();
    b1 = b.getTime();
  } else if (typeof a === 'object' && typeof b === 'object' && 'values' in a && 'values' in b) {
    // react-table column passes objects to sort, actual date is in values[columnId]
    a1 = new Date(a.values[id]).getTime();
    b1 = new Date(b.values[id]).getTime();
  } else {
    return 0;
  }

  return a1 - b1;
};
