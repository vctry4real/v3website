import { supabase } from './supabase';

export interface Comment {
    id: string;
    post_slug: string;
    author_name: string;
    content: string;
    created_at: string;
}

export const blogInteractionService = {
    /**
     * Fetch comments for a specific blog post
     */
    async getComments(slug: string): Promise<Comment[]> {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_slug', slug)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching comments:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Add a new comment to a blog post
     */
    async addComment(slug: string, authorName: string, content: string): Promise<Comment | null> {
        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    post_slug: slug,
                    author_name: authorName,
                    content: content,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Error adding comment:', error);
            throw error;
        }

        return data;
    },

    /**
     * Increment the like count for a blog post
     * Uses a Supabase RPC function if available, or falls back to client-side increment (less safe)
     */
    async incrementLikes(slug: string): Promise<void> {
        // Try calling the RPC function first (safest for concurrency)
        const { error: rpcError } = await supabase.rpc('increment_likes', { post_slug: slug });

        if (!rpcError) return;

        // Fallback: If RPC doesn't exist, try standard update (optimistic)
        console.warn('RPC increment_likes failed, falling back to standard update:', rpcError);

        // 1. Get current count
        const { data: post, error: fetchError } = await supabase
            .from('blog_posts')
            .select('likes_count')
            .eq('slug', slug)
            .single();

        if (fetchError || !post) throw fetchError || new Error('Post not found');

        // 2. Increment
        const { error: updateError } = await supabase
            .from('blog_posts')
            .update({ likes_count: (post.likes_count || 0) + 1 })
            .eq('slug', slug);

        if (updateError) throw updateError;
    },

    /**
     * Get the current like count
     */
    async getLikesCount(slug: string): Promise<number> {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('likes_count')
            .eq('slug', slug)
            .single();

        if (error) return 0;
        return data?.likes_count || 0;
    }
};
