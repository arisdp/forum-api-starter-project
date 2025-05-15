exports.up = (pgm) => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'threads',
            onDelete: 'CASCADE',
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
        date: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        is_deleted: {
            type: 'BOOLEAN',
            notNull: true,
            default: false,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('comments');
};