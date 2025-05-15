const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

class ThreadDetail {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, title, body, date, username, comments } = payload;

        this.id = id;
        this.title = title;
        this.body = body;
        this.date = date;
        this.username = username;
        this.comments = comments;
    }

    _verifyPayload({ id, title, body, date, username, comments }) {
        if (!id || !title || !body || !date || !username || !comments) {
            throw new NotFoundError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string' ||
            typeof title !== 'string' ||
            typeof body !== 'string' ||
            typeof date !== 'string' ||
            typeof username !== 'string' ||
            !Array.isArray(comments)
        ) {
            throw new InvariantError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ThreadDetail;