export type PrimitiveField = string | number | boolean | null;

export type RecordFields = Record<string, PrimitiveField | PrimitiveField[]>;

export type RecordEntity = {
  id: string;
  createdAt: Date;
  fields: RecordFields;
};
