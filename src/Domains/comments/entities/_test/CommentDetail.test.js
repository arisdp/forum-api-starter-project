const CommentDetail = require('../CommentDetail');

describe('CommentDetail entity', () => {
    it('should create CommentDetail correctly when given valid payload (not deleted)', () => {
        const payload = {
            id: 'comment-123',
            username: 'user1',
            date: '2023-04-21',
            content: 'Ini isi komentar',
            is_deleted: false,
            replies: [],
        };

        const comment = new CommentDetail(payload);

        expect(comment.id).toEqual(payload.id);
        expect(comment.username).toEqual(payload.username);
        expect(comment.date).toEqual(payload.date);
        expect(comment.content).toEqual(payload.content);
        expect(comment.replies).toEqual([]);
    });

    it('should create CommentDetail with masked content when is_deleted is true', () => {
        const payload = {
            id: 'comment-123',
            username: 'user1',
            date: '2023-04-21',
            content: 'Komentar rahasia',
            is_deleted: true,
            replies: [],
        };

        const comment = new CommentDetail(payload);

        expect(comment.content).toEqual('**komentar telah dihapus**');
    });

    it('should throw error when missing required property', () => {
        const payload = {
            id: 'comment-123',
            username: 'user1',
            date: '2023-04-21',
            content: 'Missing is_deleted',
            // is_deleted is missing
        };

        expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when data type does not match specification', () => {
        const payload = {
            id: 123,
            username: true,
            date: {},
            content: [],
            is_deleted: 'false', // should be boolean
        };

        expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create CommentDetail with empty replies array when replies is undefined', () => {
        const payload = {
            id: 'comment-123',
            username: 'user1',
            date: '2023-04-21',
            content: 'Komentar tanpa replies',
            is_deleted: false,
            // replies tidak diberikan
        };

        const comment = new CommentDetail(payload);

        expect(comment.replies).toEqual([]);
    });
});
