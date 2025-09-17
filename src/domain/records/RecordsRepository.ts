import { RecordEntity } from './Record';

export interface RecordsRepository {
  list: () => Promise<RecordEntity[]>;
}
