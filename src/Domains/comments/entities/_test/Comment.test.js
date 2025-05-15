const Comment = require('../Comment'); // sesuaikan path jika berbeda
const ReplyDetail = require('../../../replies/entities/ReplyDetail');

describe('Comment.mapRepliesToComments', () => {
    it('should correctly map replies to each comment', () => {
        const comments = [
            {
                id: 'comment-123',
                username: 'user1',
                content: 'Comment 1',
                date: new Date().toISOString(),
            },
            {
                id: 'comment-223',
                username: 'user2',
                content: 'Comment 2',
                date: new Date().toISOString(),
            },
        ];

        const replies = [
            {
                id: 'reply-123',
                comment_id: 'comment-123',
                username: 'userA',
                content: 'Reply to comment 1',
                date: '2025-05-04T10:00:00.000Z',
                is_deleted: false,
            },
            {
                id: 'reply-223',
                comment_id: 'comment-123',
                username: 'userB',
                content: 'Another reply',
                date: '2025-05-04T11:00:00.000Z',
                is_deleted: true,
            },
            {
                id: 'reply-323',
                comment_id: 'comment-223',
                username: 'userC',
                content: 'Reply to comment 2',
                date: '2025-05-04T12:00:00.000Z',
            },
        ];

        const result = Comment.mapRepliesToComments(comments, replies);

        // Check structure
        expect(result).toHaveLength(2);

        // Check replies for comment-1
        expect(result[0].replies).toHaveLength(2);
        expect(result[0].replies[0]).toBeInstanceOf(ReplyDetail);
        expect(result[0].replies[0].id).toEqual('reply-123');
        expect(result[0].replies[1].is_deleted).toBe(true);

        // Check replies for comment-2
        expect(result[1].replies).toHaveLength(1);
        expect(result[1].replies[0].id).toEqual('reply-323');
        expect(result[1].replies[0]).toBeInstanceOf(ReplyDetail);
        expect(result[1].replies[0].is_deleted).toBe(false);
    });

    it('should return comments with empty replies if none found', () => {
        const comments = [
            { id: 'comment-123', username: 'user1', content: 'Test', date: new Date().toISOString() },
        ];

        const replies = [];

        const result = Comment.mapRepliesToComments(comments, replies);

        expect(result).toHaveLength(1);
        expect(result[0].replies).toEqual([]);
    });

    it('should default is_deleted to false if undefined', () => {
        const comments = [{ id: 'comment-123', username: 'user1', content: 'Test', date: new Date().toISOString() }];
        const replies = [
            { id: 'reply-123', comment_id: 'comment-123', username: 'userA', content: 'Reply', date: new Date().toISOString() },
        ];

        const result = Comment.mapRepliesToComments(comments, replies);
        expect(result[0].replies[0].is_deleted).toBe(false);
    });
});
