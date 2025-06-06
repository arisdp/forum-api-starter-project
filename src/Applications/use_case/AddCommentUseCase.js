const NewComment = require('../../Domains/comments/entities/NewComment'); // ✅ tambahkan baris ini

class AddCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const { threadId } = useCasePayload;
        await this._threadRepository.verifyThreadAvailability(threadId);

        const newComment = new NewComment(useCasePayload);
        return this._commentRepository.addComment(newComment);
    }
}

module.exports = AddCommentUseCase;