# get Makefile directory name: http://stackoverflow.com/a/5982798/376773
THIS_MAKEFILE_PATH:=$(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST))
THIS_DIR:=$(shell cd $(dir $(THIS_MAKEFILE_PATH));pwd)

# BIN directory
BIN := $(THIS_DIR)/node_modules/.bin

# Path
PATH := node_modules/.bin:$(PATH)

NODE ?= $(shell which node)
YARN ?= $(shell which yarn)
PKG ?= $(if $(YARN),$(YARN),$(NODE) $(shell which npm))

default: help

## Help
help:
	@printf "Available targets:\n\n"
	@awk '/^[a-zA-Z\-\_0-9%:\\]+/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
		helpCommand = $$1; \
		helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
	gsub("\\\\", "", helpCommand); \
	gsub(":+$$", "", helpCommand); \
		printf "  \x1b[32;01m%-35s\x1b[0m %s\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST) | sort -u
	@printf "\n"

install: node_modules

node_modules: package.json
	@NODE_ENV= $(PKG) install
	@touch node_modules

# Example how to get a command execution into a variable and use it in the same line
# pack:
# @file=$$(npm ls); echo "$$file";

## Run git tag picking the version from package.json
tag:
	git tag "$$(node -e 'console.log(require("./package").version)')"

.PHONY: list
## Lists all targets defined in this makefile.
list:
	@$(MAKE) -pRrn : -f $(MAKEFILE_LIST) 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | command grep -v -e '^[^[:alnum:]]' -e '^$@$$command ' | sort

.PHONY: tag 
.PHONY: all install node_modules
