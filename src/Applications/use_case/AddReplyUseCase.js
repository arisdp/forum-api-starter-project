const NewReply = require('../../Domains/replies/entities/NewReply'); // ✅ tambahkan baris ini

class AddReplyUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload) {
        const { threadId, commentId } = useCasePayload;

        await this._threadRepository.verifyThreadAvailability(threadId);
        await this._commentRepository.verifyCommentAvailability(commentId);

        const newReply = new NewReply(useCasePayload);
        return this._replyRepository.addReply(newReply);
    }
}

module.exports = AddReplyUseCase;