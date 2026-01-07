import { AirtableHttpClient, AirtableRecord, AirtableFieldMap } from '@/core/airtable/AirtableHttpClient';
import { getAirtableLikesConfig } from '@/config/envLikes';

export type LikesRecord = AirtableRecord & {
  fields: {
    Utilisateur: string[];
    Contenu: string[];
    Statut: 'Actif' | 'Annulé';
  };
};

export class LikesAirtableClient extends AirtableHttpClient {
  constructor() {
    const cfg = getAirtableLikesConfig();
    super({
      apiKey: cfg.apiKey,
      baseId: cfg.baseId,
      tableId: cfg.likesTableId,
    });
  }

  async findLikeByUserAndContent(userId: string, contentId: string): Promise<LikesRecord | null> {
    const records = await this.listRecordsRaw();
    const match = records.find(r => {
      const f = r.fields as any;
      const users: string[] = Array.isArray(f?.Utilisateur) ? f.Utilisateur : [];
      const contents: string[] = Array.isArray(f?.Contenu) ? f.Contenu : [];
      const status: string | undefined = f?.Statut as any;
      return users.includes(userId) && contents.includes(contentId);
    });
    return (match ?? null) as LikesRecord | null;
  }

  async createLike(fields: { Utilisateur: string[]; Contenu: string[]; Statut: 'Actif' | 'Annulé' }): Promise<LikesRecord> {
    const payload: AirtableFieldMap = {
      Utilisateur: fields.Utilisateur,
      Contenu: fields.Contenu,
      Statut: fields.Statut
    };
    const rec = await this.createRecord(payload);
    return rec as LikesRecord;
  }

  async updateLikeStatus(recordId: string, status: 'Actif' | 'Annulé'): Promise<LikesRecord> {
    const payload: AirtableFieldMap = {
      Statut: status
    };
    const rec = await this.updateRecord(recordId, payload);
    return rec as LikesRecord;
  }

  async getLikesCountForContent(contentId: string): Promise<number> {
    const records = await this.listRecordsRaw();
    const count = records.filter(r => {
      const f = r.fields as any;
      const contents: string[] = Array.isArray(f?.Contenu) ? f.Contenu : [];
      const status: string | undefined = f?.Statut as any;
      return contents.includes(contentId) && status === 'Actif';
    }).length;
    return count;
  }



  async getUserLikesForContent(userId: string, contentId: string): Promise<LikesRecord | null> {
    const records = await this.listRecordsRaw();
    const match = records.find(r => {
      const f = r.fields as any;
      const users: string[] = Array.isArray(f?.Utilisateur) ? f.Utilisateur : [];
      const contents: string[] = Array.isArray(f?.Contenu) ? f.Contenu : [];
      const status: string | undefined = f?.Statut as any;
      return users.includes(userId) && contents.includes(contentId) && status === 'Actif';
    });
    return (match ?? null) as LikesRecord | null;
  }
}