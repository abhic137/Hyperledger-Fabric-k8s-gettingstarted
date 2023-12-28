#!/bin/bash

# Check if pod name is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <pod-name>"
  exit 1
fi

POD_NAME=$1
# Number of times to run the command in parallel
NUM_RUNS=5

# Run the command in the background with an incremented asset value
for ((i=0; i<$NUM_RUNS; i++)); do
  ASSET_VALUE=$((9 + i))
  COMMAND="peer chaincode invoke -o orderer:7050 --tls true --cafile \$ORDERER_CA -C mychannel -n asset --peerAddresses peer0-org1:7051 --tlsRootCertFiles /organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0-org2:7051 --tlsRootCertFiles /organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --peerAddresses peer0-org3:7051 --tlsRootCertFiles /organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt -c '{\"Args\":[\"CreateAsset\",\"asset$ASSET_VALUE\",\"green\",\"100\",\"nikhil\",\"500\"]}' --waitForEvent"
  kubectl exec -it $POD_NAME -- /bin/bash -c "$COMMAND" &
done

# Wait for all background processes to finish
wait



####INSTRUCTIONS TO RUN
##  ./parallel_exec.sh <your-pod-name>
