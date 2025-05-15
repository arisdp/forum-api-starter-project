const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ReplyDetail = require('../../replies/entities/ReplyDetail');

class CommentDetail {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, username, date, content, replies, is_deleted } = payload;

        this.id = id;
        this.username = username;
        this.date = date;
        this.content = is_deleted ? '**komentar telah dihapus**' : content;
        this.is_deleted = is_deleted;
        this.replies = replies || [];
    }

    _verifyPayload({ id, username, date, content, is_deleted }) {
        if (!id || !username || !date || !content || is_deleted === undefined) {
            throw new NotFoundError('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string' ||
            typeof username !== 'string' ||
            typeof date !== 'string' ||
            typeof content !== 'string' ||
            typeof is_deleted !== 'boolean'
        ) {
            throw new InvariantError('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CommentDetail;