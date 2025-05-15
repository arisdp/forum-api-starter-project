const NewReply = require('../NewReply');

describe('NewReply entity', () => {
    it('should create NewReply object correctly', () => {
        // Arrange
        const payload = {
            content: 'Ini balasan baru',
            commentId: 'comment-123',
            owner: 'user-123',
        };

        // Act
        const newReply = new NewReply(payload);

        // Assert
        expect(newReply.content).toEqual(payload.content);
        expect(newReply.commentId).toEqual(payload.commentId);
        expect(newReply.owner).toEqual(payload.owner);
    });

    it('should throw error when payload does not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'Ini balasan baru',
            owner: 'user-123',
        };

        // Act & Assert
        expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload has incorrect data types', () => {
        // Arrange
        const payload = {
            content: 123,
            commentId: {},
            owner: true,
        };

        // Act & Assert
        expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});
