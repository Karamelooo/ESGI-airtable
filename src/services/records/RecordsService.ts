import { RecordEntity } from '@/domain/records/Record';
import { RecordsRepository } from '@/domain/records/RecordsRepository';

export class RecordsService {
  constructor(private readonly repository: RecordsRepository) {}

  async listRecords(): Promise<RecordEntity[]> {
    return this.repository.list();
  }
}
