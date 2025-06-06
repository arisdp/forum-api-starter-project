const AddedReply = require('../AddedReply');

describe('AddedReply entity', () => {
    it('should create AddedReply object correctly', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'Ini balasan',
            owner: 'user-123',
        };

        // Act
        const addedReply = new AddedReply(payload);

        // Assert
        expect(addedReply.id).toEqual(payload.id);
        expect(addedReply.content).toEqual(payload.content);
        expect(addedReply.owner).toEqual(payload.owner);
    });

    it('should throw error when payload does not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'Ini balasan',
            owner: 'user-123',
        };

        // Act & Assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload has incorrect data types', () => {
        // Arrange
        const payload = {
            id: 123,
            content: {},
            owner: true,
        };

        // Act & Assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});
