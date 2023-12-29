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
  "name": "pieza 4b",
  "reference": "1",
  "description": "pieza de tractor moncho SL",
  "purchasePrice": 50.20,
  "salePrice": 120
}'

send_request "POST" "items" '{
  "name": "pieza 23f",
  "reference": "2",
  "description": "pieza de pascuali modelo 4578H",
  "purchasePrice": 200.89,
  "salePrice": 400
}'

send_request "POST" "boxes" '{
  "reference": "1",
  "size": "120x120x5",
  "location": "E20-F05",
  "itemReference": "1",
  "numItems": 25
}'

send_request "POST" "boxes" '{
  "reference": "2",
  "size": "120x120x5",
  "location": "E20-F06",
  "itemReference": "2",
  "numItems": 50
}'


send_request "POST" "orders" '{
  "reference": "1",
  "date": "29-12-2023",
  "state": "PENDING",
  "items": [
    {
      "itemReference": "1",
      "numberItems": 10
    },
    {
      "itemReference": "2",
      "numberItems": 20
    },
    
  ]
}'

echo "Initialization script executed successfully."
