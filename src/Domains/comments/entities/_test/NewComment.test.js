const NewComment = require('../NewComment');

describe('NewComment entity', () => {
    it('should create NewComment object correctly when given valid payload', () => {
        const payload = {
            content: 'Ini komentar baru',
            threadId: 'thread-123',
            owner: 'user-123',
        };

        const newComment = new NewComment(payload);

        expect(newComment.content).toEqual(payload.content);
        expect(newComment.threadId).toEqual(payload.threadId);
        expect(newComment.owner).toEqual(payload.owner);
    });

    it('should throw error when missing required properties', () => {
        const payload = {
            content: 'Komentar tanpa threadId dan owner',
        };

        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when data types do not match specification', () => {
        const payload = {
            content: 123,
            threadId: true,
            owner: {},
        };

        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});
