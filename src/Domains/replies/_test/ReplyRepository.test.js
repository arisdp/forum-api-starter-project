const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
    it('should throw error when invoke unimplemented addReply method', async () => {
        const replyRepository = new ReplyRepository();
        await expect(replyRepository.addReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

    it('should throw error when invoke unimplemented verifyReplyOwner method', async () => {
        const replyRepository = new ReplyRepository();
        await expect(replyRepository.verifyReplyOwner('reply-123', 'user-123')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

    it('should throw error when invoke unimplemented deleteReply method', async () => {
        const replyRepository = new ReplyRepository();
        await expect(replyRepository.deleteReply('reply-123')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

    it('should throw error when invoke unimplemented getRepliesByCommentId method', async () => {
        const replyRepository = new ReplyRepository();
        await expect(replyRepository.getRepliesByCommentId('comment-123')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

    it('should throw error when invoke unimplemented verifyReplyAvailability method', async () => {
        const replyRepository = new ReplyRepository();
        await expect(replyRepository.verifyReplyAvailability('reply-123')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
