"use client";

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { blogInteractionService } from '@/components/lib/blogInteractionService';
import toast from 'react-hot-toast';

interface LikeButtonProps {
    slug: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ slug }) => {
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);

    useEffect(() => {
        // Fetch initial likes count
        const fetchLikes = async () => {
            const count = await blogInteractionService.getLikesCount(slug);
            setLikes(count);
        };

        fetchLikes();

        // Check if user has liked this post from local storage persistence
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
        if (likedPosts.includes(slug)) {
            setHasLiked(true);
        }
    }, [slug]);

    const handleLike = async () => {
        if (hasLiked) {
            toast.success("You've already liked this post!");
            return;
        }

        // Optimistic UI update
        setLikes((prev) => prev + 1);
        setHasLiked(true);
        setIsLikeAnimating(true);

        // Persist to local storage
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
        localStorage.setItem('liked_posts', JSON.stringify([...likedPosts, slug]));

        try {
            await blogInteractionService.incrementLikes(slug);
        } catch (error) {
            // Revert on failure
            setLikes((prev) => prev - 1);
            setHasLiked(false);
            localStorage.setItem('liked_posts', JSON.stringify(likedPosts)); // revert local storage
            toast.error('Failed to update likes. Please try again.');
        }

        // Reset animation
        setTimeout(() => setIsLikeAnimating(false), 1000);
    };

    return (
        <button
            onClick={handleLike}
            disabled={hasLiked}
            className={`group flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${hasLiked
                    ? 'bg-primary/20 text-primary cursor-default'
                    : 'bg-surface-elevated hover:bg-surface-muted text-text-secondary hover:text-primary cursor-pointer'
                }`}
            aria-label="Like this post"
        >
            <div className={`relative ${isLikeAnimating ? 'animate-bounce' : ''}`}>
                <Heart
                    className={`w-6 h-6 transition-colors duration-300 ${hasLiked ? 'fill-primary text-primary' : 'group-hover:text-primary'
                        }`}
                />
                {isLikeAnimating && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-primary font-bold animate-ping opacity-75">
                        +1
                    </span>
                )}
            </div>
            <span className="font-medium text-lg">{likes}</span>
        </button>
    );
};
