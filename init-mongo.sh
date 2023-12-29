#!/bin/bash

HOST="server:4000/api"

send_request() {
  local method="$1"
  local path="$2"
  local data="$3"

  curl -X "$method" \
    -H "Content-Type: application/json" \
    -d "$data" \
    "$HOST/$path"
}

send_request "POST" "items" '{
  "name": "pieza 01",
  "reference": "1",
  "description": "pieza de prueba",
  "purchasePrice": 50.20,
  "salePrice": 120
}'

send_request "POST" "boxes" '{
  "reference": "2",
  "size": "120x120x5",
  "location": "E20-F06",
  "itemReference": "1",
  "numItems": 50
}'

send_request "POST" "orders" '{
  "reference": "3",
  "date": "17-11-2023",
  "state": "PENDING",
  "items": [
    {
      "itemReference": "4",
      "numberItems": 40
    }
  ]
}'

echo "Initialization script executed successfully."
