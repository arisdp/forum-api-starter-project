class ThreadRepository {
    async addThread(newThread) {
        console.log('[addThread] :', newThread);
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyThreadAvailability(threadId) {
        console.log('[verifyThreadAvailability] :', threadId);
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getThreadById(threadId) {
        console.log('[getThreadById] :', threadId);
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = ThreadRepository;