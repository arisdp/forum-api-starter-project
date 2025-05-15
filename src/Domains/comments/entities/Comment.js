const ReplyDetail = require('../../replies/entities/ReplyDetail');

class Comment {
    static mapRepliesToComments(comments, replies) {
        return comments.map((comment) => {
            const commentReplies = replies
                .filter(reply => reply.comment_id === comment.id)
                .map(reply => new ReplyDetail({
                    id: reply.id,
                    username: reply.username,
                    date: new Date(reply.date).toISOString(),
                    content: reply.content,
                    is_deleted: reply.is_deleted || false,
                }));
            return {
                ...comment,
                replies: commentReplies,
            };
        });
    }
}

module.exports = Comment;