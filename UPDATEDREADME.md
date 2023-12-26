#########K8s Dashboard ##########


Step 2: Run the Below command to Enable the Dashboard

***kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml


Step 3: Create users and roles for the dashboard

****nano admin-user-service-account.yaml
 ```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
```
*****nano admin-user-cluster-role-binding.yaml
```
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
```
####Run below command to create user
```
kubectl apply -f admin-user-service-account.yaml -f admin-user-cluster-role-binding.yaml
```
#######output should look like below
```
serviceaccount/admin-user created
clusterrolebinding.rbac.authorization.k8s.io/admin-user created
```
Ste4: Create Token for user

*********
```
kubectl -n kubernetes-dashboard create token admin-user
```
####Output should look like
```
eyJhbGciOiJSUzI1Ni
```
Step 5: Run Below command for port fordwarding
```
kubectl port-forward -n kubernetes-dashboard service/kubernetes-dashboard 8080:443
```


#####
## NFS Server

1. sudo apt update
2. sudo apt install nfs-kernel-server
3. sudo mkdir -p /mnt/nfs_share
4. sudo chown -R nobody:nogroup /mnt/nfs_share/
5. sudo chmod 777 /mnt/nfs_share/
6. echo "/mnt/nfs_share \*(rw,sync,no_subtree_check,insecure)" | sudo tee -a /etc/exports
7. sudo exportfs -a
8. sudo systemctl restart nfs-kernel-server

## NFS Client (Ubuntu)

1. sudo apt update
2. sudo apt install nfs-common
3. sudo mkdir -p /mnt/nfs_clientshare
4. sudo mount <IP>:/mnt/nfs_share /mnt/nfs_clientshare
5. ls -l /mnt/nfs_clientshare/

## NFS Client (MacOS)

1. mkdir nfs_clientshare
2. sudo mount -o nolocks -t nfs <IP>:/mnt/nfs_share ./nfs_clientshare



########################Adding PV and PVC to Kubernets cluster

###1.nfs
####apply kubectl command

#######Go into the NFS server

cd /mnt/nfs_share1
chmod +x scripts/ -R

chmod 777 organizations/ -R
 
 #####2.ca











### 3.certificate

###Genreating certificate for peer and orderers

###create job.yaml file ........kubernetes jobs: job ensure that one or more pods execute their command  and exit successfully.
                                                 when  all the pods have  exited without errors,the jobs gets completed. when
                                                 the jobs gets deleted my create pods also deleted as well
####apply kubectl command 	 

### 4.artifact

###Genreating genesis block and channel transction	

###create job.yaml 

###apply kubectl command











#####5.orderer###########

#####create deployment of orderer

****orderer.yml  , orderer2.yml , orderer3.yml , orderer4.yml , orderer5.yml 
####create services of all orderer deployment

*****orderer-svc.yml , orderer2-svc.yml ,orderer3-svc.yml , orderer4-svc.yml , orderer5-svc.yml

#####APPLY kubectl command 
********kubectl apply -f .

####check pods and deployments pods and check logs as well of all pods on lens app


####6.configmap
###########create k8s configmap....core.yaml and external chaincode build scripts
###create builder-configmap.yaml
###aplly kubectl command
******check in configmap in lens app





#####for creating peer go to 7.peer
##for Org1
peerOrg1-cli.yml, peerOrg1.yml, peerOrg-svc.yml 

###for Org2
peerOrg2-cli.yml,  peerOrg2.yml  ,peerOrg2-svc.yml

###for Org3
peerOrg3-cli.yml , peerOrg3.yml  ,peerOrg3-svc.yml

###apply kubectl command in each Org1, Org2 ,Org3 ...
 
###check wheather all pods are runing or not on Lens app / kubectl get pods



####creating new channel 
##go to cli-peer0-org1 and enter scripts file and for edit createAppchannel.sh file give name and channel artifacts name
execute file 
*****./createAppchannel.sh

 ####for each org peer should be join  
 
 ****peer channel join -b ./channel-artifacts/channel.block
 
 ###for checking channel join or not
 
 *****peer channel list
 
####for updating anchorpeer execute update bash file un each peer org

***./updateAchorpeer.sh Org1MSP     /      ./scripts/updateAnchorPeer.sh Org1MSP

***./updateAchorpeer.sh Org2MSP     /        ./scripts/updateAnchorPeer.sh Org2MSP

***./updateAchorpeer.sh Org3MSP     /        ./scripts/updateAnchorPeer.sh Org3MSP






####packaging the chaincode
 
***go to nfs_clientshare file ,chaincode directory is there inside chaincode file we will all file of connection.json and metadata.json

*** if we have code.tar.gz and package file delete them ( rm -rf code.tar.gz)

####we have deploy single chaincode in each org.

**first remove code.tar.gz file if we have 

A-edit connection.json file change addresses and metadata file change lables
   ** nano connection.json**
   
   {
    "address": "chain-org:7052",
    "dial_timeout": "10s",
    "tls_required": false,
    "client_auth_required": false,
    "client_key": "-----BEGIN EC PRIVATE KEY----- ... -----END EC PRIVATE KEY-----",
    "client_cert": "-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----",
    "root_cert": "-----BEGIN CERTIFICATE---- ... -----END CERTIFICATE-----"
}

   ***nano metadata.json
   {"path":"","type":"external","label":"asset"}
   
   
****tar cfz code.tar.gz connection.json

B  --- now code.tar.gz is created so package that file with metadata.json

C  -- tar cfz chain-org.tgz code.tar.gz metadata.json
 
###install chaincode 

##go to each org cli-peer-org inside container paste command

### got to path /opt/gopath/src/github.com/chaincode/basic/

cd packaging

all chaincode tar file is there

****peer lifecycle chaincode install chain-org.tgz 

###after installing chaincode we got asset id

asset:04a2985d68a1ec427d874286ff090fac6e9be1174b05e70fd20733a9b58ea109


#####9.cc-deploy

#####Now create deployment for the chaincode

***In service.yaml file give the name same name what u give in address of connetion.json (eg:chain-org)

###now each org deployment give basic id of each of org

###if we have allready chaincode deployment delete them and apply again..

###kubectl apply -f .

###now approve chaincode in each org , apply below command in each org

***peer lifecycle chaincode approveformyorg --channelID mychannel --name asset --version 1.0 --init-required --package-id asset:b6ed75da9104f5c004334fba4d8bb24b868c9cf356021e66289bdba6f5ebd0ee --sequence 1 -o orderer:7050 --tls --cafile $ORDERER_CA 


#######checkcommitreadiness apply on any peer-org....

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name asset --version 1.0 --init-required --sequence 1 -o -orderer:7050 --tls --cafile $ORDERER_CA


######wheather chaincode is intalled or not 

**********peer lifecycle chaincode queryinstalled
*********peer lifecycle chaincode queryinstalled -C mychannel
***********peer lifecycle chaincode queryinstalled --output json
********peer chaincode list --instantiated -C mychannel
*******peer channel getinfo -c mychannel
**********peer channel list
***********peer channel list --orderer orderer.example.com:7050




  
####commit chaincode

peer lifecycle chaincode commit -o orderer:7050 --channelID mychannel --name asset --version 1.0 --sequence 1 --init-required --tls true --cafile $ORDERER_CA --peerAddresses peer0-org1:7051 --tlsRootCertFiles /organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0-org2:7051 --tlsRootCertFiles /organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --peerAddresses peer0-org3:7051 --tlsRootCertFiles /organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt

####for verfing commited chaincode
peer lifecycle chaincode querycommitted -C mychannel


####InitLedger command
peer chaincode invoke -o orderer:7050 --isInit --tls true --cafile $ORDERER_CA -C mychannel -n asset --peerAddresses peer0-org1:7051 --tlsRootCertFiles /organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0-org2:7051 --tlsRootCertFiles /organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --peerAddresses peer0-org3:7051 --tlsRootCertFiles /organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt -c '{"Args":["InitLedger"]}' --waitForEvent



###query command
peer chaincode query -C mychannel -n asset -c '{"Args":["GetAllAssets"]}'

invoke command
peer chaincode invoke -o orderer:7050 --tls true --cafile $ORDERER_CA -C mychannel -n asset --peerAddresses peer0-org1:7051 --tlsRootCertFiles /organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0-org2:7051 --tlsRootCertFiles /organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --peerAddresses peer0-org3:7051 --tlsRootCertFiles /organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt -c '{"Args":["CreateAsset","asset9","red","51","tom","300"]}' --waitForEvent

###query command
peer chaincode query -C mychannel -n asset -c '{"Args":["GetAllAssets"]}'













 


