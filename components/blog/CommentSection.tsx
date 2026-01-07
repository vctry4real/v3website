"use client";

import React, { useEffect, useState } from 'react';
import { blogInteractionService, Comment } from '@/components/lib/blogInteractionService';
import { CommentForm } from './CommentForm';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User } from 'lucide-react';

interface CommentSectionProps {
    slug: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ slug }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                const fetchedComments = await blogInteractionService.getComments(slug);
                setComments(fetchedComments);
            } catch (error) {
                console.error('Failed to load comments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [slug]);

    const handleNewComment = (newComment: Comment) => {
        // Prepend the new comment to the list
        setComments((prev) => [newComment, ...prev]);
    };

    return (
        <div className="space-y-8 mt-16 pt-8 border-t border-border-muted" id="comments">
            <div className="flex items-center space-x-2 mb-6">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-text">
                    Comments ({comments.length})
                </h2>
            </div>

            <CommentForm slug={slug} onCommentAdded={handleNewComment} />

            <div className="space-y-6 mt-8">
                {loading ? (
                    <div className="text-center py-8 text-text-muted">Loading comments...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 bg-surface-muted/30 rounded-lg">
                        <p className="text-text-secondary">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-surface-elevated rounded-lg p-5 border border-border-muted transition-all hover:border-border-muted/80"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-text">{comment.author_name}</h4>
                                        <span className="text-xs text-text-muted">
                                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-text-secondary text-base leading-relaxed whitespace-pre-wrap mt-2">
                                {comment.content}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
