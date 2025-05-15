const CommentRepository = require('../CommentRepository');

describe('CommentRepository abstract class', () => {
    it('should throw error when calling unimplemented addComment', async () => {
        const repository = new CommentRepository();
        await expect(repository.addComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

    it('should throw error when calling unimplemented verifyCommentOwner', async () => {
        const repository = new CommentRepository();
        await expect(repository.verifyCommentOwner('comment-123', 'user-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

    it('should throw error when calling unimplemented deleteComment', async () => {
        const repository = new CommentRepository();
        await expect(repository.deleteComment('comment-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

    it('should throw error when calling unimplemented getCommentsByThreadId', async () => {
        const repository = new CommentRepository();
        await expect(repository.getCommentsByThreadId('thread-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

    it('should throw error when calling unimplemented verifyCommentAvailability', async () => {
        const repository = new CommentRepository();
        await expect(repository.verifyCommentAvailability('comment-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
