import { RecordEntity } from './Record';

export interface RecordsRepository {
  list: () => Promise<RecordEntity[]>;
  getById: (id: string) => Promise<RecordEntity>;
}
