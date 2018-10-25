#!/bin/bash

set -x

# SET
curl localhost:8080/?cmd=SET%20foo%20bar
echo
curl localhost:8080/?cmd=SET%20foo2%20bar2
echo
curl localhost:8080/?cmd=SET%20foo3
echo

# GET
curl localhost:8080/?cmd=GET%20foo
echo
curl localhost:8080/?cmd=GET%20foo2
echo
curl localhost:8080/?cmd=GET
echo
curl localhost:8080/?cmd=GET%20foo3
echo

# DEL
curl localhost:8080/?cmd=DEL%20foo
echo
curl localhost:8080/?cmd=DEL
echo
curl localhost:8080/?cmd=DEL%20foo3
echo

# INCR
curl localhost:8080/?cmd=SET%20myvalue%2010
echo
curl localhost:8080/?cmd=INCR%20myvalue
echo
curl localhost:8080/?cmd=GET%20myvalue
echo

# DBSIZE
curl localhost:8080/?cmd=DBSIZE
echo
curl localhost:8080/?cmd=DEL%20foo2
echo
curl localhost:8080/?cmd=DBSIZE
echo

# ZADD
curl localhost:8080/?cmd=ZADD%20myset%20100%20p1
echo
curl localhost:8080/?cmd=ZADD%20myset%20200%20p2
echo
curl localhost:8080/?cmd=ZADD%20myset%20150%20p3
echo

# ZCARD
curl localhost:8080/?cmd=ZCARD%20myset
echo

# ZRANK
curl localhost:8080/?cmd=ZRANK%20myset%20p1
echo
curl localhost:8080/?cmd=ZRANK%20myset%20p2
echo
curl localhost:8080/?cmd=ZRANK%20myset%20p3
echo

# ZRANGE
curl localhost:8080/?cmd=ZRANGE%20myset%200%20-1
echo
