const DeleteCommentUseCase = require('../../../Applications/use_case/DeleteCommentUseCase');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('DeleteCommentUseCase', () => {
    it('should orchestrate the delete comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };

        const mockThreadRepository = {
            verifyThreadAvailability: jest.fn().mockResolvedValue(),
        };
        const mockCommentRepository = {
            verifyCommentAvailability: jest.fn().mockResolvedValue(),
            verifyCommentOwner: jest.fn().mockResolvedValue(),
            deleteComment: jest.fn().mockResolvedValue(),
        };

        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Act
        await deleteCommentUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadAvailability)
            .toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentAvailability)
            .toHaveBeenCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.verifyCommentOwner)
            .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(mockCommentRepository.deleteComment)
            .toHaveBeenCalledWith(useCasePayload.commentId);
    });

    it('should throw NotFoundError when comment is not available', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-not-found',
            owner: 'user-123',
        };

        const mockThreadRepository = {
            verifyThreadAvailability: jest.fn().mockResolvedValue(),
        };
        const mockCommentRepository = {
            verifyCommentAvailability: jest.fn().mockRejectedValue(new NotFoundError('komentar tidak ditemukan')),
            verifyCommentOwner: jest.fn(),
            deleteComment: jest.fn(),
        };

        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Act & Assert
        await expect(deleteCommentUseCase.execute(useCasePayload))
            .rejects.toThrow(NotFoundError);

        // Verifikasi pemanggilan
        expect(mockThreadRepository.verifyThreadAvailability)
            .toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentAvailability)
            .toHaveBeenCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.verifyCommentOwner)
            .not.toHaveBeenCalled();
        expect(mockCommentRepository.deleteComment)
            .not.toHaveBeenCalled();
    });

    it('should throw AuthorizationError when user is not the owner', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-not-owner',
        };

        const mockThreadRepository = {
            verifyThreadAvailability: jest.fn().mockResolvedValue(),
        };
        const mockCommentRepository = {
            verifyCommentAvailability: jest.fn().mockResolvedValue(),
            verifyCommentOwner: jest.fn().mockRejectedValue(new AuthorizationError('anda tidak berhak mengakses resource ini')),
            deleteComment: jest.fn(),
        };

        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Act & Assert
        await expect(deleteCommentUseCase.execute(useCasePayload))
            .rejects.toThrow(AuthorizationError);

        // Verifikasi pemanggilan
        expect(mockThreadRepository.verifyThreadAvailability)
            .toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentAvailability)
            .toHaveBeenCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.verifyCommentOwner)
            .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(mockCommentRepository.deleteComment)
            .not.toHaveBeenCalled();
    });
});