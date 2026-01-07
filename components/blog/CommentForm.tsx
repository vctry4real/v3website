"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { FormInput, FormTextarea } from '@/components/ui/FormField';
import { blogInteractionService, Comment } from '@/components/lib/blogInteractionService';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

// Validation Schema
const commentSchema = z.object({
    author_name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be typically shorter'),
    content: z.string().min(5, 'Comment must be at least 5 characters').max(1000, 'Comment too long'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
    slug: string;
    onCommentAdded: (comment: Comment) => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ slug, onCommentAdded }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CommentFormData>({
        resolver: zodResolver(commentSchema),
    });

    const onSubmit = async (data: CommentFormData) => {
        setIsSubmitting(true);
        try {
            const newComment = await blogInteractionService.addComment(slug, data.author_name, data.content);

            if (newComment) {
                onCommentAdded(newComment);
                toast.success('Comment posted!');
                reset();
            }
        } catch (error) {
            toast.error('Failed to post comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-surface-elevated/50 backdrop-blur-sm rounded-xl p-6 border border-border-muted">
            <h3 className="text-lg font-semibold text-text mb-4">Leave a Comment</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="max-w-md">
                    <FormInput
                        label="Name"
                        placeholder="Your name"
                        {...register('author_name')}
                        error={errors.author_name}
                        className="bg-bg-dark/50"
                    />
                </div>

                <div>
                    <FormTextarea
                        label="Comment"
                        placeholder="Share your thoughts..."
                        {...register('content')}
                        error={errors.content}
                        rows={4}
                        className="bg-bg-dark/50"
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center"
                    >
                        {isSubmitting ? 'Posting...' : (
                            <>
                                Post Comment <Send className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};
