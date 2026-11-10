create table author
(
    id         integer not null
        constraint author_pk
            primary key autoincrement,
    first_name text    not null,
    last_name  text    not null,
    email      text    not null,
    bio        text
);