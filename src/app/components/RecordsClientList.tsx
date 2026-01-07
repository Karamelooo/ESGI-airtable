"use client";

import { RecordEntity } from '@/domain/records/Record';
import { useSearch } from '@/store/SearchContext';
import LikeButton from './LikeButton';

const formatDate = (value: Date | string): string =>
  new Date(value).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  });

const ProjectCard = ({ record }: { record: RecordEntity }) => {
  const getImageUrl = (): string => {
    const imageField = (record.fields as any).Image || (record.fields as any).image;
    if (Array.isArray(imageField) && imageField.length > 0) {
      const first = imageField[0] as any;
      const thumb = typeof first?.thumbnails?.large?.url === 'string' ? first.thumbnails.large.url : undefined;
      const url = typeof first?.url === 'string' ? first.url : undefined;
      return thumb || url || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop";
    }
    return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop";
  };

  const getTitle = () => {
    return record.fields.Nom ||
      record.fields.nom ||
      record.fields.Name ||
      record.fields.name ||
      'Projet sans titre';
  };

  const getDescription = () => {
    return record.fields.Description || record.fields.description || '';
  };

  const getTags = () => {
    const tags = record.fields.Tags || record.fields.tags;
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') return tags.split(',').map(t => t.trim());
    return [];
  };

  return (
    <article className="group rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-lg hover:border-neutral-300">
      <a href={`/projects/${record.id}`} className="block relative h-48 bg-gradient-to-br from-blue-500 to-blue-700 overflow-hidden">
        <img
          src={getImageUrl()}
          alt={getTitle() as string}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>

      <div className="p-6">
        <div className="mb-4">
          <a href={`/projects/${record.id}`} className="block group">
            <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {getTitle()}
            </h3>
          </a>
          <span className="text-xs text-neutral-500 uppercase tracking-wide">
            {formatDate(record.createdAt)}
          </span>
        </div>

        {getDescription() && (
          <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
            {getDescription()}
          </p>
        )}

        {getTags().length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {getTags().slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
          <LikeButton contentId={record.id} />
          <a
            href={`/projects/${record.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 group"
          >
            Voir le projet
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
};

export default function RecordsClientList({ initialRecords }: { initialRecords: RecordEntity[] }) {
  const { records } = useSearch();
  const list = records ?? initialRecords;

  if (!list.length) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-neutral-500 text-lg">
          Aucun projet trouvé pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
      {list.map((record) => (
        <ProjectCard key={record.id} record={record} />
      ))}
    </div>
  );
}

