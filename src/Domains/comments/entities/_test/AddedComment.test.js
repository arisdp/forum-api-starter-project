const AddedComment = require('../AddedComment');

describe('AddedComment Entity', () => {
    it('should create AddedComment object correctly when given valid payload', () => {
        const payload = {
            id: 'comment-123',
            content: 'ini komentar',
            owner: 'user-123',
        };

        const addedComment = new AddedComment(payload);

        expect(addedComment.id).toEqual(payload.id);
        expect(addedComment.content).toEqual(payload.content);
        expect(addedComment.owner).toEqual(payload.owner);
    });

    it('should throw error when payload does not contain needed property', () => {
        const payload = {
            id: 'comment-123',
            content: 'ini komentar',
            // owner missing
        };

        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload does not meet data type specification', () => {
        const payload = {
            id: 123, // not string
            content: true, // not string
            owner: {},
        };

        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});
