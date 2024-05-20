# Project "Difference Generator"

### Hexlet tests and linter status:
[![Actions Status](https://github.com/bersyatina/frontend-project-46/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/bersyatina/frontend-project-46/actions)
[![frontend-project-46](https://github.com/bersyatina/frontend-project-46/actions/workflows/my-check.yml/badge.svg)](https://github.com/bersyatina/frontend-project-46/actions/workflows/my-check.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/1e76cc37c3378ae656b3/maintainability)](https://codeclimate.com/github/bersyatina/frontend-project-46/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/1e76cc37c3378ae656b3/test_coverage)](https://codeclimate.com/github/bersyatina/frontend-project-46/test_coverage)

## Description
Difference generator determines the difference between two data structures and shows the result in the selected format.

## Features
* Support for JSON, YAML configuration file formats
* Customizable output format: stylish, plain or JSON
* Recursive comparison of nested structures

## Requirements
[Node.js](https://nodejs.org/en/download) - v20.11.1

## Setup

```bash
git clone 'git@github.com:bersyatina/frontend-project-46.git'
make install
```

```bash
gendiff [options] <filepath1> <filepath2>

Options:
  -V, --version        output the version number
  -f, --format <type>  output format (default: "stylish")
  -h, --help           output usage information
```

## Examples

### Run Gendiff: data type - nested JSON, format - stylish
[![asciicast](https://asciinema.org/a/1RrROCye7bxMHsoD1Rx0aQvNK.svg)](https://asciinema.org/a/1RrROCye7bxMHsoD1Rx0aQvNK)

### Run Gendiff: data type - YML, format - stylish
[![asciicast](https://asciinema.org/a/bgXsBnHScQXVVpRxyfHvjqdei.svg)](https://asciinema.org/a/bgXsBnHScQXVVpRxyfHvjqdei)

### Run Gendiff: data type - nested YAML, format - plain
[![asciicast](https://asciinema.org/a/ywS61oCZgPThxW1xDShcDOPRi.svg)](https://asciinema.org/a/ywS61oCZgPThxW1xDShcDOPRi)

### Run Gendiff: data type - nested YAML, format - JSON
[![asciicast](https://asciinema.org/a/RJbZTunupo3BAgG6GsstfpJks.svg)](https://asciinema.org/a/RJbZTunupo3BAgG6GsstfpJks)
