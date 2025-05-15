const AddReplyUseCase = require('../AddReplyUseCase');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

// Import interface dari domain untuk mocking agar IDE support dan konsisten
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('AddReplyUseCase', () => {
    it('should orchestrate the add reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'Ini balasan',
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };

        const expectedAddedReply = new AddedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        });

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.verifyThreadAvailability = jest.fn().mockResolvedValue();
        mockCommentRepository.verifyCommentAvailability = jest.fn().mockResolvedValue();
        mockReplyRepository.addReply = jest.fn().mockImplementation((newReply) => {
            return new AddedReply({
                id: 'reply-123',
                content: newReply.content,
                owner: newReply.owner,
            });
        });

        const addReplyUseCase = new AddReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Act
        const result = await addReplyUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply(useCasePayload));
        expect(result).toStrictEqual(expectedAddedReply);
    });

    it('should throw error if thread not found', async () => {
        const useCasePayload = {
            content: 'Balasan error',
            threadId: 'thread-xyz',
            commentId: 'comment-123',
            owner: 'user-123',
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.verifyThreadAvailability = jest.fn().mockRejectedValue(new Error('THREAD_NOT_FOUND'));
        mockCommentRepository.verifyCommentAvailability = jest.fn();
        mockReplyRepository.addReply = jest.fn();

        const addReplyUseCase = new AddReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Act & Assert
        await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError('THREAD_NOT_FOUND');
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentAvailability).not.toBeCalled();
        expect(mockReplyRepository.addReply).not.toBeCalled();
    });

    it('should throw error if comment not found', async () => {
        const useCasePayload = {
            content: 'Balasan error',
            threadId: 'thread-123',
            commentId: 'comment-xyz',
            owner: 'user-123',
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.verifyThreadAvailability = jest.fn().mockResolvedValue();
        mockCommentRepository.verifyCommentAvailability = jest.fn().mockRejectedValue(new Error('COMMENT_NOT_FOUND'));
        mockReplyRepository.addReply = jest.fn();

        const addReplyUseCase = new AddReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Act & Assert
        await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError('COMMENT_NOT_FOUND');
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.addReply).not.toBeCalled();
    });
});
