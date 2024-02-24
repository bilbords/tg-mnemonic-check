CREATE TABLE subscribed_users (
	id serial PRIMARY KEY,
	telegram_id bigint
)

INSERT INTO subscribed_users ("telegram_id") VALUES ('1192520887')