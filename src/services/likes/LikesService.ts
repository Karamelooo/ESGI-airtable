import { LikesAirtableClient } from '@/core/airtable/LikesAirtableClient';

export class LikesService {
  private likesClient = new LikesAirtableClient();

  async toggleLike(userId: string, contentId: string): Promise<{ liked: boolean; count: number }> {
    const existingLike = await this.likesClient.findLikeByUserAndContent(userId, contentId);

    if (existingLike) {
      const newStatus = existingLike.fields.Statut === 'Actif' ? 'Annulé' : 'Actif';
      await this.likesClient.updateLikeStatus(existingLike.id, newStatus);
      
      const count = await this.likesClient.getLikesCountForContent(contentId);
      return { liked: newStatus === 'Actif', count };
    } else {
      await this.likesClient.createLike({
        Utilisateur: [userId],
        Contenu: [contentId],
        Statut: 'Actif'
      });

      const count = await this.likesClient.getLikesCountForContent(contentId);
      return { liked: true, count };
    }
  }

  async getLikeStatus(userId: string, contentId: string): Promise<{ liked: boolean; count: number }> {
    const userLike = await this.likesClient.findLikeByUserAndContent(userId, contentId);
    const count = await this.likesClient.getLikesCountForContent(contentId);
    
    return {
      liked: userLike ? userLike.fields.Statut === 'Actif' : false,
      count
    };
  }

  async getLikesCount(contentId: string): Promise<number> {
    return await this.likesClient.getLikesCountForContent(contentId);
  }
}