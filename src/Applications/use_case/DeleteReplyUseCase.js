class DeleteReplyUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload) {
        const { threadId, commentId, replyId, owner } = useCasePayload;

        await this._threadRepository.verifyThreadAvailability(threadId);
        await this._commentRepository.verifyCommentAvailability(commentId);
        await this._replyRepository.verifyReplyAvailability(replyId);
        await this._replyRepository.verifyReplyOwner(replyId, owner);

        return this._replyRepository.deleteReply(replyId);
    }
}

module.exports = DeleteReplyUseCase;