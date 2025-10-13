'use client';

import React, { useState, useEffect } from 'react';
import styles from './LikeButton.module.css';

interface LikeButtonProps {
  contentId: string;
  className?: string;
}

export default function LikeButton({ contentId, className = '' }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [anim, setAnim] = useState<'none' | 'pop' | 'pulse'>('none');

  useEffect(() => {
    const loadLikeStatus = async () => {
      try {
        const res = await fetch(`/api/likes?contentId=${encodeURIComponent(contentId)}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (res.ok) {
          setLiked(data.liked);
          setCount(data.count);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadLikeStatus();
  }, [contentId]);

  const handleLike = async () => {
    if (loading) return;

    setLoading(true);

    const prevLiked = liked;
    const prevCount = count;
    setLiked(!prevLiked);
    setCount(prevLiked ? prevCount - 1 : prevCount + 1);
    setAnim(prevLiked ? 'pop' : 'pulse');

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentId }),
        cache: 'no-store',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur');
      }

      const statusRes = await fetch(`/api/likes?contentId=${encodeURIComponent(contentId)}`, {
        cache: 'no-store',
      });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setLiked(!!statusData.liked);
        setCount(Number(statusData.count) || 0);
      } else {
        setLiked(data.liked);
        setCount(data.count);
      }
    } catch (e) {
      setLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setLoading(false);
      setAnim('none');
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleLike}
        disabled={loading}
        className={`
          flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all duration-200 ease-out shadow-sm hover:shadow-md active:scale-[0.98]
          ${liked 
            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
            : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200 hover:border-red-200 hover:text-red-600'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        title={liked ? 'Retirer le like' : 'Ajouter un like'}
      >
        <svg 
          className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'fill-none text-current'} ${styles.heart} ${anim === 'pulse' ? styles.pulse : anim === 'pop' ? styles.pop : ''}`}
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
          onAnimationEnd={() => setAnim('none')}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
        <span className="text-xs font-medium">
          {count}
        </span>
      </button>
    </div>
  );
}