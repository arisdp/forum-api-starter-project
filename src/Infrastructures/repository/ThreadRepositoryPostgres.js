const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(newThread) {
        try {
            console.log('[REPOSITORY] addThread - Payload:', newThread);

            const { title, body, owner } = newThread;
            const id = `thread-${this._idGenerator()}`;
            const date = new Date().toISOString();

            console.log(`[REPOSITORY] addThread - Generated ID: ${id}`);
            console.log(`[REPOSITORY] addThread - Timestamp: ${date}`);

            const query = {
                text: 'INSERT INTO threads (id, title, body, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
                values: [id, title, body, owner, date],
            };

            console.log('[REPOSITORY] addThread - Executing query:', query);

            const result = await this._pool.query(query);
            console.log('[REPOSITORY] addThread - Insert result:', result.rows[0]);

            const addedThread = new AddedThread({ ...result.rows[0] });
            console.log('[REPOSITORY] addThread - Returning AddedThread entity:', addedThread);

            return addedThread;
        } catch (error) {
            console.error('[REPOSITORY] addThread - DB error:', error.message);
            throw new Error('THREAD_REPOSITORY.FAILED_TO_ADD_THREAD');
        }
    }

    async verifyThreadAvailability(threadId) {
        console.log('[REPOSITORY] verifyThreadAvailability - Checking thread ID:', threadId);
        const query = {
            text: 'SELECT id FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);
        console.log('[REPOSITORY] verifyThreadAvailability - Result:', result.rows);

        if (!result.rowCount) {
            console.log('[REPOSITORY] verifyThreadAvailability - Thread not found:', threadId);
            throw new NotFoundError('thread tidak ditemukan');
        }
    }

    async getThreadById(threadId) {
        console.log('[REPOSITORY] getThreadById - Fetching thread ID:', threadId);
        const query = {
            text: `
                SELECT threads.id, threads.title, threads.body, threads.date, users.username
                FROM threads
                LEFT JOIN users ON threads.owner = users.id
                WHERE threads.id = $1
            `,
            values: [threadId],
        };

        const result = await this._pool.query(query);
        console.log('[REPOSITORY] getThreadById - Query result:', result.rows);

        if (!result.rowCount) {
            console.log('[REPOSITORY] getThreadById - Thread not found:', threadId);
            throw new NotFoundError('thread tidak ditemukan');
        }

        return result.rows[0];
    }
}

module.exports = ThreadRepositoryPostgres;
