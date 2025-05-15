const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
    const useCasePayload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
        owner: 'user-123',
    };

    const createMockRepositories = (overrides = {}) => {
        return {
            threadRepository: {
                verifyThreadAvailability: jest.fn().mockResolvedValue(),
                ...overrides.threadRepository,
            },
            commentRepository: {
                verifyCommentAvailability: jest.fn().mockResolvedValue(),
                ...overrides.commentRepository,
            },
            replyRepository: {
                verifyReplyAvailability: jest.fn().mockResolvedValue(),
                verifyReplyOwner: jest.fn().mockResolvedValue(),
                deleteReply: jest.fn().mockResolvedValue(),
                ...overrides.replyRepository,
            },
        };
    };

    it('✅ should orchestrate the delete reply action correctly', async () => {
        const mocks = createMockRepositories();
        const deleteReplyUseCase = new DeleteReplyUseCase(mocks);

        await deleteReplyUseCase.execute(useCasePayload);

        expect(mocks.threadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.threadId);
        expect(mocks.commentRepository.verifyCommentAvailability).toBeCalledWith(useCasePayload.commentId);
        expect(mocks.replyRepository.verifyReplyAvailability).toBeCalledWith(useCasePayload.replyId);
        expect(mocks.replyRepository.verifyReplyOwner).toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
        expect(mocks.replyRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
    });

    it('❌ should throw error when thread is not found', async () => {
        const threadRepository = {
            verifyThreadAvailability: jest.fn().mockRejectedValue(new Error('THREAD_NOT_FOUND')),
        };
        const mocks = createMockRepositories({ threadRepository });
        const useCase = new DeleteReplyUseCase(mocks);

        await expect(useCase.execute(useCasePayload)).rejects.toThrowError('THREAD_NOT_FOUND');

        expect(mocks.threadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.threadId);
        expect(mocks.commentRepository.verifyCommentAvailability).not.toBeCalled();
        expect(mocks.replyRepository.verifyReplyAvailability).not.toBeCalled();
        expect(mocks.replyRepository.verifyReplyOwner).not.toBeCalled();
        expect(mocks.replyRepository.deleteReply).not.toBeCalled();
    });

    it('❌ should throw error when comment is not found', async () => {
        const commentRepository = {
            verifyCommentAvailability: jest.fn().mockRejectedValue(new Error('COMMENT_NOT_FOUND')),
        };
        const mocks = createMockRepositories({ commentRepository });
        const useCase = new DeleteReplyUseCase(mocks);

        await expect(useCase.execute(useCasePayload)).rejects.toThrowError('COMMENT_NOT_FOUND');

        expect(mocks.threadRepository.verifyThreadAvailability).toBeCalled();
        expect(mocks.commentRepository.verifyCommentAvailability).toBeCalledWith(useCasePayload.commentId);
        expect(mocks.replyRepository.verifyReplyAvailability).not.toBeCalled();
        expect(mocks.replyRepository.verifyReplyOwner).not.toBeCalled();
        expect(mocks.replyRepository.deleteReply).not.toBeCalled();
    });

    it('❌ should throw error when reply is not found', async () => {
        const replyRepository = {
            verifyReplyAvailability: jest.fn().mockRejectedValue(new Error('REPLY_NOT_FOUND')),
        };
        const mocks = createMockRepositories({ replyRepository });
        const useCase = new DeleteReplyUseCase(mocks);

        await expect(useCase.execute(useCasePayload)).rejects.toThrowError('REPLY_NOT_FOUND');

        expect(mocks.threadRepository.verifyThreadAvailability).toBeCalled();
        expect(mocks.commentRepository.verifyCommentAvailability).toBeCalled();
        expect(mocks.replyRepository.verifyReplyAvailability).toBeCalledWith(useCasePayload.replyId);
        expect(mocks.replyRepository.verifyReplyOwner).not.toBeCalled();
        expect(mocks.replyRepository.deleteReply).not.toBeCalled();
    });

    it('❌ should throw error when user is not the reply owner', async () => {
        const replyRepository = {
            verifyReplyOwner: jest.fn().mockRejectedValue(new Error('UNAUTHORIZED')),
        };
        const mocks = createMockRepositories({ replyRepository });
        const useCase = new DeleteReplyUseCase(mocks);

        await expect(useCase.execute(useCasePayload)).rejects.toThrowError('UNAUTHORIZED');

        expect(mocks.threadRepository.verifyThreadAvailability).toBeCalled();
        expect(mocks.commentRepository.verifyCommentAvailability).toBeCalled();
        expect(mocks.replyRepository.verifyReplyAvailability).toBeCalled();
        expect(mocks.replyRepository.verifyReplyOwner).toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
        expect(mocks.replyRepository.deleteReply).not.toBeCalled();
    });
});
