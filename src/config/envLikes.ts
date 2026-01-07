export type AirtableLikesConfig = {
  apiKey: string;
  baseId: string;
  likesTableId: string;
};

const missingEnvMessage = (name: string) =>
  `The environment variable ${name} must be defined.`;

export const getAirtableLikesConfig = (): AirtableLikesConfig => {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_LIKES_TABLE_ID } = process.env;

  if (!AIRTABLE_API_KEY) throw new Error(missingEnvMessage('AIRTABLE_API_KEY'));
  if (!AIRTABLE_BASE_ID) throw new Error(missingEnvMessage('AIRTABLE_BASE_ID'));
  if (!AIRTABLE_LIKES_TABLE_ID) throw new Error(missingEnvMessage('AIRTABLE_LIKES_TABLE_ID'));

  return {
    apiKey: AIRTABLE_API_KEY,
    baseId: AIRTABLE_BASE_ID,
    likesTableId: AIRTABLE_LIKES_TABLE_ID,
  };
};