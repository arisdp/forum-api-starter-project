const ReplyDetail = require('../ReplyDetail');

describe('ReplyDetail entity', () => {
    it('should create ReplyDetail object correctly', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            username: 'user-123',
            date: '2025-04-22',
            content: 'Ini balasan yang tidak dihapus',
            is_deleted: false,
        };

        // Act
        const replyDetail = new ReplyDetail(payload);

        // Assert
        expect(replyDetail.id).toEqual(payload.id);
        expect(replyDetail.username).toEqual(payload.username);
        expect(replyDetail.date).toEqual(payload.date);
        expect(replyDetail.content).toEqual(payload.content);
        expect(replyDetail.is_deleted).toBeFalsy();
    });

    it('should set content to "**balasan telah dihapus**" when is_deleted is true', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            username: 'user-123',
            date: '2025-04-22',
            content: 'Ini balasan yang dihapus',
            is_deleted: true,
        };

        // Act
        const replyDetail = new ReplyDetail(payload);

        // Assert
        expect(replyDetail.content).toEqual('**balasan telah dihapus**');
    });

    it('should throw error when payload does not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            username: 'user-123',
            date: '2025-04-22',
            content: 'Ini balasan yang tidak dihapus',
        };

        // Act & Assert
        expect(() => new ReplyDetail(payload)).toThrowError('REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload has incorrect data types', () => {
        // Arrange
        const payload = {
            id: 123,
            username: {},
            date: [],
            content: true,
            is_deleted: 'false',
        };

        // Act & Assert
        expect(() => new ReplyDetail(payload)).toThrowError('REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});
