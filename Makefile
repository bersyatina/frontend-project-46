install:
	npm ci

gendiff -h:
	node gendiff -h

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm run test-coverage