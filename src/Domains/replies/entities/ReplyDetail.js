const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

class ReplyDetail {
    constructor(payload) {
        console.log('[ReplyDetail] Constructing with payload:', payload);
        this._verifyPayload(payload);

        const { id, username, date, content, is_deleted } = payload;

        this.id = id;
        this.username = username;
        this.date = date;
        this.content = is_deleted ? '**balasan telah dihapus**' : content;
        this.is_deleted = is_deleted;
    }

    _verifyPayload({ id, username, date, content, is_deleted }) {
        console.log('[ReplyDetail] Constructing with id:', id);
        console.log('[ReplyDetail] Constructing with username:', username);
        console.log('[ReplyDetail] Constructing with date:', date);
        console.log('[ReplyDetail] Constructing with content:', content);
        console.log('[ReplyDetail] Constructing with is_deleted:', is_deleted);
        if (!id || !username || !date || !content || is_deleted === undefined) {
            throw new NotFoundError('REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string' ||
            typeof username !== 'string' ||
            typeof date !== 'string' ||
            typeof content !== 'string' ||
            typeof is_deleted !== 'boolean'
        ) {
            throw new InvariantError('REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ReplyDetail;