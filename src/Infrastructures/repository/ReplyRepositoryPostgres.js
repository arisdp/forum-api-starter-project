const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
// const { nanoid } = require('nanoid');
// const NewReply = require('../../Domains/replies/entities/NewReply');
// const ReplyDetail = require('../../Domains/replies/entities/ReplyDetail');


class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReply(newReply) {
        const { content, commentId, owner } = newReply;
        const id = `reply-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
            values: [id, content, commentId, owner, date, false],
        };

        const result = await this._pool.query(query);
        return new AddedReply({ ...result.rows[0] });
    }

    async verifyReplyOwner(replyId, owner) {
        const query = {
            text: 'SELECT owner FROM replies WHERE id = $1',
            values: [replyId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('balasan tidak ditemukan');
        }

        const reply = result.rows[0];
        if (reply.owner !== owner) {
            throw new AuthorizationError('anda tidak berhak mengakses resource ini');
        }
    }

    async deleteReply(replyId) {
        const query = {
            text: 'UPDATE replies SET is_deleted = true WHERE id = $1 RETURNING id',
            values: [replyId],
        };

        await this._pool.query(query);
    }

    async getRepliesByCommentId(commentId) {

        const commentIds = Array.isArray(commentId) ? commentId : [commentId];  // Pastikan commentId dalam bentuk array
        const query = {
            text: `
          SELECT 
            replies.id, 
            users.username, 
            replies.owner, 
            replies.date, 
            replies.content, 
            replies.is_deleted,
            replies.comment_id
          FROM replies
          LEFT JOIN users ON replies.owner = users.id
          WHERE replies.comment_id =ANY($1::text[])
          ORDER BY replies.date ASC
        `,
            values: [commentIds],
        };

        console.log('Running query:', query);  // Debug log untuk memeriksa query yang dijalankan

        const result = await this._pool.query(query);
        console.log('[REPOSITORY] getRepliesByCommentIds - Result:', result.rows);
        return result.rows;
    }

    async verifyReplyAvailability(replyId) {
        const query = {
            text: 'SELECT id FROM replies WHERE id = $1',
            values: [replyId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('balasan tidak ditemukan');
        }
    }
}

module.exports = ReplyRepositoryPostgres;