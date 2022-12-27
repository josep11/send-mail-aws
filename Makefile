## Run git tag picking the version from package.json
tag:
	git tag "v$$(node -e 'console.log(require("./package").version)')"

.PHONY: tag