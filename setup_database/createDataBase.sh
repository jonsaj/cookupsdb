#! /bin/bash
psql -c "CREATE DATABASE cookupsdb;"
psql -d cookupsdb --file=./drop.sql
psql -d cookupsdb --file=./schema.sql
psql -d cookupsdb --file=./populate_db.sql
