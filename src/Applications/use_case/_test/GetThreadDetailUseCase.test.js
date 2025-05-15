const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const Comment = require('../../../Domains/comments/entities/Comment');

class ThreadRepositoryMock {
    async verifyThreadAvailability(threadId) { }
    async getThreadById(threadId) { }
}

class CommentRepositoryMock {
    async getCommentsByThreadId(threadId) { }
}

class ReplyRepositoryMock {
    async getRepliesByCommentId(commentIds) { }
}

describe('GetThreadDetailUseCase', () => {
    it('should orchestrate the use case correctly and return expected ThreadDetail', async () => {
        // Arrange
        const threadId = 'thread-123';

        const threadRepository = new ThreadRepositoryMock();
        const commentRepository = new CommentRepositoryMock();
        const replyRepository = new ReplyRepositoryMock();

        const mockThread = {
            id: threadId,
            title: 'Thread Title',
            body: 'Thread body content',
            date: new Date('2025-01-01'),
            username: 'john_doe',
        };

        const mockComments = [
            {
                id: 'comment-123',
                username: 'alice',
                date: new Date('2025-01-02'),
                content: 'Comment content',
                is_deleted: false,
            },
            {
                id: 'comment-456',
                username: 'bob',
                date: new Date('2025-01-03'),
                content: 'Another comment',
                is_deleted: true,
            },
        ];

        const mockReplies = [
            {
                id: 'reply-1',
                comment_id: 'comment-123',
                username: 'charlie',
                owner: 'user-1',
                date: new Date('2025-01-04'),
                content: 'Reply content',
                is_deleted: false,
            },
            {
                id: 'reply-2',
                comment_id: 'comment-456',
                username: 'dave',
                owner: 'user-2',
                date: new Date('2025-01-05'),
                content: 'Deleted reply',
                is_deleted: true,
            },
        ];

        jest.spyOn(threadRepository, 'verifyThreadAvailability').mockResolvedValue();
        jest.spyOn(threadRepository, 'getThreadById').mockResolvedValue(mockThread);
        jest.spyOn(commentRepository, 'getCommentsByThreadId').mockResolvedValue(mockComments);
        jest.spyOn(replyRepository, 'getRepliesByCommentId').mockResolvedValue(mockReplies);

        const mapRepliesSpy = jest.spyOn(Comment, 'mapRepliesToComments').mockImplementation((comments, replies) => {
            return comments.map((comment) => ({
                ...comment,
                replies: replies
                    .filter((r) => r.comment_id === comment.id && !r.is_deleted)
                    .map((r) => ({
                        id: r.id,
                        content: r.content,
                        date: r.date.toISOString(),
                        username: r.username,
                    })),
            }));
        });

        const useCase = new GetThreadDetailUseCase({
            threadRepository,
            commentRepository,
            replyRepository,
        });

        // Act
        const result = await useCase.execute(threadId);

        // Assert
        expect(threadRepository.verifyThreadAvailability).toBeCalledWith(threadId);
        expect(threadRepository.getThreadById).toBeCalledWith(threadId);
        expect(commentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
        expect(replyRepository.getRepliesByCommentId).toBeCalledWith(['comment-123', 'comment-456']);
        expect(mapRepliesSpy).toBeCalled();

        expect(result).toBeInstanceOf(ThreadDetail);
        expect(result.comments[0]).toBeInstanceOf(CommentDetail);
        expect(result.comments[0].replies).toHaveLength(1); // only non-deleted reply
    });

    it('should work even when replyRepository is not provided', async () => {
        // Arrange
        const threadId = 'thread-noreply';

        const threadRepository = new ThreadRepositoryMock();
        const commentRepository = new CommentRepositoryMock();

        const mockThread = {
            id: threadId,
            title: 'No Reply Thread',
            body: 'Body',
            date: new Date(),
            username: 'someone',
        };

        const mockComments = [
            {
                id: 'comment-999',
                username: 'foo',
                date: new Date(),
                content: 'Only comment',
                is_deleted: false,
            },
        ];

        jest.spyOn(threadRepository, 'verifyThreadAvailability').mockResolvedValue();
        jest.spyOn(threadRepository, 'getThreadById').mockResolvedValue(mockThread);
        jest.spyOn(commentRepository, 'getCommentsByThreadId').mockResolvedValue(mockComments);

        jest.spyOn(Comment, 'mapRepliesToComments').mockReturnValue(mockComments.map((c) => ({
            ...c,
            replies: [],
        })));

        const useCase = new GetThreadDetailUseCase({
            threadRepository,
            commentRepository,
            // replyRepository omitted
        });

        // Act
        const result = await useCase.execute(threadId);

        // Assert
        expect(result).toBeInstanceOf(ThreadDetail);
        expect(result.comments[0]).toBeInstanceOf(CommentDetail);
        expect(result.comments[0].replies).toEqual([]);
    });
});
    