const AddCommentUseCase = require('../AddCommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddCommentUseCase', () => {
    it('should orchestrate the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            id: 'comment-123',
            content: 'Ini komentar dari unit test',
            threadId: 'thread-123',
            owner: 'user-123',
        };


        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        // Mocking threadRepository
        mockThreadRepository.verifyThreadAvailability = jest.fn().mockResolvedValue();

        // Mocking commentRepository
        mockCommentRepository.addComment = jest.fn().mockImplementation(({ content, threadId, owner }) =>
            Promise.resolve(new AddedComment({
                id: 'comment-123',
                content,
                owner,
            }))
        );

        const addCommentUseCase = new AddCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Act
        const addedComment = await addCommentUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadAvailability)
            .toHaveBeenCalledWith(useCasePayload.threadId);

        expect(mockCommentRepository.addComment)
            .toHaveBeenCalledWith({
                content: useCasePayload.content,
                threadId: useCasePayload.threadId,
                owner: useCasePayload.owner,
            });

        expect(addedComment).toStrictEqual(new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        }));
    });
});