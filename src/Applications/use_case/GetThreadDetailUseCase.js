const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../Domains/comments/entities/CommentDetail');
const Comment = require('../../Domains/comments/entities/Comment');

class GetThreadDetailUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(threadId) {
        console.log('[USECASE] Verifying thread availability...');
        await this._threadRepository.verifyThreadAvailability(threadId);

        console.log('[USECASE] Fetching thread data...');
        const thread = await this._threadRepository.getThreadById(threadId);
        console.log('[USECASE] Thread data:', thread);

        console.log('[USECASE] Fetching comments...');
        const rawComments = await this._commentRepository.getCommentsByThreadId(threadId);
        console.log('[USECASE] Raw comments:', rawComments);

        const commentIds = rawComments.map((comment) => comment.id);
        console.log('[USECASE] Extracted comment IDs:', commentIds);

        let replies = [];
        if (this._replyRepository) {
            console.log('[USECASE] Fetching replies for comments...');
            replies = await this._replyRepository.getRepliesByCommentId(commentIds);
            console.log('[USECASE] Raw replies:', replies);
        }

        console.log('[USECASE] Mapping replies to corresponding comments...');
        const commentsWithReplies = Comment.mapRepliesToComments(rawComments, replies);
        console.log('[USECASE] Comments with mapped replies:', commentsWithReplies);

        console.log('[USECASE] Constructing CommentDetail entities...');
        const finalComments = commentsWithReplies.map((comment) => new CommentDetail({
            id: comment.id,
            username: comment.username,
            date: new Date(comment.date).toISOString(),
            content: comment.content,
            is_deleted: comment.is_deleted || false,
            replies: comment.replies,
        }));
        console.log('[USECASE] Final CommentDetail entities:', finalComments);

        console.log('[USECASE] Constructing ThreadDetail entity...');
        const result = new ThreadDetail({
            id: thread.id,
            title: thread.title,
            body: thread.body,
            date: new Date(thread.date).toISOString(),
            username: thread.username,
            comments: finalComments,
        });

        console.log('[USECASE] Final ThreadDetail result:', result);
        return result;
    }
}

module.exports = GetThreadDetailUseCase;