export type AirtableUsersConfig = {
    apiKey: string;
    baseId: string;
    usersTableId: string;
  };
  
  const missingEnvMessage = (name: string) =>
    `The environment variable ${name} must be defined.`;
  
  export const getAirtableUsersConfig = (): AirtableUsersConfig => {
    const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_USERS_TABLE_ID } = process.env;
  
    if (!AIRTABLE_API_KEY) throw new Error(missingEnvMessage('AIRTABLE_API_KEY'));
    if (!AIRTABLE_BASE_ID) throw new Error(missingEnvMessage('AIRTABLE_BASE_ID'));
    if (!AIRTABLE_USERS_TABLE_ID) throw new Error(missingEnvMessage('AIRTABLE_USERS_TABLE_ID'));
  
    return {
      apiKey: AIRTABLE_API_KEY,
      baseId: AIRTABLE_BASE_ID,
      usersTableId: AIRTABLE_USERS_TABLE_ID,
    };
  };