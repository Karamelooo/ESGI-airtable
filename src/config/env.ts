export type AirtableConfig = {
  apiKey: string;
  baseId: string;
  tableId: string;
};

const missingEnvMessage = (
  variableName: string,
): string => `The environment variable ${variableName} must be defined.`;

export const getAirtableConfig = (): AirtableConfig => {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID } = process.env;

  if (!AIRTABLE_API_KEY) {
    throw new Error(missingEnvMessage('AIRTABLE_API_KEY'));
  }

  if (!AIRTABLE_BASE_ID) {
    throw new Error(missingEnvMessage('AIRTABLE_BASE_ID'));
  }

  if (!AIRTABLE_TABLE_ID) {
    throw new Error(missingEnvMessage('AIRTABLE_TABLE_ID'));
  }

  return {
    apiKey: AIRTABLE_API_KEY,
    baseId: AIRTABLE_BASE_ID,
    tableId: AIRTABLE_TABLE_ID,
  };
};
