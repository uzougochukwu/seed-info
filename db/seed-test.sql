\c nc_news_test

CREATE TABLE topics (
    slug TEXT PRIMARY KEY,
    description VARCHAR(200),
    img_url VARCHAR(500)
);

CREATE TABLE users (
    username VARCHAR(200) PRIMARY KEY,
    name VARCHAR(200),
    avatar_url VARCHAR(500)
);

CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    topic TEXT References Topics(slug),
    author VARCHAR(200) References Users(username),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes BIGINT DEFAULT 0,
    article_img_url VARCHAR(500)
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id References Articles(article_id),
    body TEXT,
    votes BIGINT DEFAULT 0,
    author VARCHAR(200) References Users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

