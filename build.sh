#!/bin/bash

IFS=$'\n'
set -f
for i in $(cat < "./.env"); do
  travis encrypt --pro "$i" --add
done