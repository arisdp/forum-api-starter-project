/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('./UsersTableTestHelper');
const ThreadsTableTestHelper = require('./ThreadsTableTestHelper');
const CommentsTableTestHelper = require('./CommentsTableTestHelper');

const RepliesTableTestHelper = {
    async addReply({
        id = 'reply-123',
        content = 'sebuah balasan',
        commentId = 'comment-123',
        owner = 'user-123',
        date = new Date().toISOString(),
    }) {
        // Pastikan owner ada
        await UsersTableTestHelper.addUser({ id: owner });

        // Pastikan commentId ada
        const threadId = 'thread-123';
        await ThreadsTableTestHelper.addThread({ id: threadId, owner });
        await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner });

        const query = {
            text: 'INSERT INTO replies (id, content, comment_id, owner, date, is_deleted) VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, content, commentId, owner, date, false],
        };

        const result = await pool.query(query);
        console.log('Added Reply:', result.rows[0]);  // Log the added reply
        return result.rows[0];
    },

    async findReplyById(id) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [id],
        };
        // const result = await this._pool.query('SELECT * FROM replies WHERE id = $1', [id]);
        await pool.query(query);
    },


    async findRepliesByCommentId(id) {
        const result = await pool.query(
            'SELECT * FROM replies WHERE comment_id = $1',
            [id]
        );
        console.log('Replies for commentId:', id, result.rows); // Log the result
        return result.rows; // Should return an array (even if empty)
    },

    async cleanTable() {
        await pool.query('DELETE FROM replies');
    },
};

module.exports = RepliesTableTestHelper;