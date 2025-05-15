/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const NotFoundError = require('../src/Commons/exceptions/NotFoundError');
const AuthorizationError = require('../src/Commons/exceptions/AuthorizationError');

const ThreadsTableTestHelper = {
    async addThread({
        id = 'thread-123',
        title = 'sebuah thread',
        body = 'sebuah body thread',
        owner = 'user-123',
        date = new Date().toISOString(),
    }) {
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
            values: [id, title, body, owner, date],
        };

        await pool.query(query);
    },

    async findThreadById(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async verifyThreadAvailability(id) {
        const result = await this.findThreadById(id);
        if (!result.length) {
            throw new NotFoundError('Thread tidak ditemukan');
        }
    },

    async verifyThreadOwner(id, owner) {
        const thread = await this.findThreadById(id);
        if (!thread.length) {
            throw new NotFoundError('Thread tidak ditemukan');
        }
        if (thread[0].owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads WHERE 1=1');
    },
};

module.exports = ThreadsTableTestHelper;