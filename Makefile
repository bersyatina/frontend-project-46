install:
	npm ci

gendiff -h:
	node gendiff -h

lint:
    npm init @eslint/config
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8