# get Makefile directory name: http://stackoverflow.com/a/5982798/376773
THIS_MAKEFILE_PATH:=$(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST))
THIS_DIR:=$(shell cd $(dir $(THIS_MAKEFILE_PATH));pwd)

# BIN directory
BIN := $(THIS_DIR)/node_modules/.bin

# Path
PATH := node_modules/.bin:$(PATH)

## Run git tag picking the version from package.json
tag:
	git tag "v$$(node -e 'console.log(require("./package").version)')"

.PHONY: tag