alter table post
    add author_id integer
        constraint post_author_fk
            references author (id)
            on delete set null;