import { RecordEntity } from '@/domain/records/Record';
import { RecordsRepository } from '@/domain/records/RecordsRepository';

export class RecordsService {
  constructor(private readonly repository: RecordsRepository) {}

  async listRecords(): Promise<RecordEntity[]> {
    return this.repository.list();
  }

  async getRecordById(id: string): Promise<RecordEntity> {
    return this.repository.getById(id);
  }

  async getAllTags(): Promise<string[]> {
    const records = await this.listRecords();
    const tagsSet = new Set<string>();
    records.forEach(r => {
      const tags = (r.fields as any).Tags || (r.fields as any).tags;
      if (Array.isArray(tags)) {
        tags.forEach(t => tagsSet.add(t));
      } else if (typeof tags === 'string') {
        tags.split(',').forEach(t => tagsSet.add(t.trim()));
      }
    });
    return Array.from(tagsSet).sort();
  }
}
