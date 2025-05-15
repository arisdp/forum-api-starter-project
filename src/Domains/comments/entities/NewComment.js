const InvariantError = require('../../../Commons/exceptions/InvariantError');
// const NotFoundError = require('../../../Commons/exceptions/NotFoundError');


class NewComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const { content, threadId, owner } = payload;

        this.content = content;
        this.threadId = threadId;
        this.owner = owner;
    }

    _verifyPayload({ content, threadId, owner }) {
        if (!content || !threadId || !owner) {
            throw new InvariantError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof content !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
            throw new InvariantError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = NewComment;