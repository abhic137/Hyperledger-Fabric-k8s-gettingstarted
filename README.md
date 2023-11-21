# Hyperledger-Fabric-k8s-gettingstarted
* it provides decentralized internet
* dapp's  = decentralized softwares.
* fabric is a private block chain it has features to get subnets called as channels
* msp= membership service provider this will enroll in a pirtucular network
* smart contracts can be written with chaincode we can do it in java script, java or golang
# Instructions
## install kubectl 
```
snap install kubectl --classic
kubectl version --client
kubectl cluster-info
```
## installing Lens (kubernets IDE)

```


sudo snap install kontena-lens --classic


```

## Create and add 4 nodes
```
follow the commands from here : https://github.com/abhic137/k8-multinode-kubeadm
kubectl get nodes
```
## setup NFS server for volume (pv and pvc)
### Setting up NFS server
take anew pc or a vm with ubuntu
```
sudo apt install nfs-kernel-server

```
create a directory
```
sudo mkdir -p /mnt/nfs_share
sudo chmod -R nobody:nogroup /mnt/nfs_share/
sudo chmod 777 /mnt/nfs_share
```
config at the exports file
```
cat /etc/exports
echo "/mnt/nfs_share *(rw,sync,no_subtree_check,insecure)" | sudo tee -a /etc/exports
```
(here "*" is a feild for ip if we want a specific ip to access the server)
```
sudo exportfs -a
sudo systemctl restart nfs-kernel-server
```
### setting up NFS client ie., host local machine
```
sudo apt update
sudo apt install nfs-common
sudo mkdir -p /mnt/nfs_clientshare
sudo mount <IP_OF_NFS_SERVER>:/mnt/nfs_share /mnt/nfs_clientshare
ls -l /mnt/nfs_clientshare/

```
### To check 
ssh into ther NFS server
```
cd /mnt/nfs_share/
ls
```
You will find nothing in this directory
Now go to the client pc 
```
cd nfs_clientshare
ls
touch example.txt
```
now go back to the server pc and re run the commands now you will find the file inside it.

## Adding PV and PVC to Kubernets cluster
add the ip of nfs inside the pv.yaml inside the nfs folder
```
kubectl get nodes
kubectl apply -f 1.nfs/pv.yaml

```
opens lens IDE and click on "+" to add cluster to check the info about the cluster
(apply the persistance volume claims)
```
apply -f 1.nfs/pvc.yaml
```
```
kubectl describe pv mypv
kubectl describe pvc mypvc

```

## add Nginix pods with pod.yaml
```
kubectl apply -f 1.nfs/pod.yaml
```
you can check it in the lens IDE under workloads > pods
go inside the nfs machine
```
cd /mnt/nfs_share/
ls
```
you can use lens to directly open the pod. or use the CLI to get inside the pod you can see the nfs files inside the pod.
```
cd /usr/share/nginx/html/
ls
```
## Running a Sample App in our K8's Setup
```
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```
go to lens IDE ypou can see under the pods sections to see the pods status
```
kubectl describe deployment nginx-deployment
```
```
kubectl get pods -o wide
```

updating the deployment (updating the image and incresaing the replicas)
```
kubectl apply - https://k8s.io/examples/application/deployment-scale.yaml
```
we can directly scale the number of repicas from the lens IDE directly

## CA server
on master node (host)
copy all the data from the prerequsies folder to the nfs client folder to make it available in the nfs server
```
cp -R prerequsite/* ../nfs_clientshare
ls ../nfs_clientshare
ls
mkdir organizations
mv -r fabric-ca organizations

```
Go into the NFS server 
```
cd /mnt/nfs_share
chmod +x scripts/ -R
chmod 777 organizations/ -R
```
on host
```
cd 2.ca
kubectl apply ca-org1.yaml
kubectl apply ca-org1-service.yaml
```
the only change between the diffrent ca-org files is the name  and the port number
now apply all the files in the 2.ca directory for that we have to use the command
```
kubectl apply -f .
```
go to lens IDE to see the pods of CA

## Generating Certificates for peers and orderer orgs
Kubernetes Jobs: Jobs ensure that one or more pods execute
their commands and exit successfully. When all the pods have
exited without errors, the Job gets completed. When the Job
gets deleted, any created pods get deleted as well

```
cd 3.certificates
kubectl apply -f job.yaml
```
go into the shell of create-certs throuth lensIDE or through cli with kubectl exec -it command
```
ls # you will find the organizations directory here
```
after sometime the job will stop afer generating the certificate
the certificates will be stored in the NFS server
you can check it in the nfs server location
```
cd organizations
ls
```
here you will find 2 folders ```peerOrganizations``` and ```ordererOrganizations```

## Creating Genesis block and Channel transaction
in host
```
cd  4.artifacts
kubectl apply -f .
```
check in lens IDE it ill create artifacts and then stop running go to the nfs_client share folder to check
```
cd ../nfs_clienshare
ls
ls  channel artifacts ## look for org1,2,3, and mychannel
ls gensesis-block  ##look for genisis.block
```
you will see a folder named channel artifacts and system-genesis-block
## Starting Ordering Services
on host machine
```
cd 5.orderer
kubectl apply -f .
kubectl get deployments
kube ctlget svc
```
output:
![oput](https://github.com/abhic137/Hyperledger-Fabric-k8s-gettingstarted/assets/46273637/a0048b6d-aed7-49bb-a35d-e7b013cb94e2)

we can also check it in the lens IDE
## Starting Peers services

```
cd 6.configmap
kubectl appy -f .
```
```
cd 7.peers/org1
kubectl apply -f .
cd ..
kubectl apply -f 7.peers/org2
kubectl apply -f 7.peers/org3
kubectl get deployments

```
this should be the output
![Screenshot from 2023-11-21 11-45-06](https://github.com/abhic137/Hyperledger-Fabric-k8s-gettingstarted/assets/46273637/61da7c49-23f1-4a6d-8cf9-99546d2be2dd)

If this happens 
![Screenshot from 2023-11-21 11-50-48](https://github.com/abhic137/Hyperledger-Fabric-k8s-gettingstarted/assets/46273637/d134417f-5f97-42c6-aa2c-7693571faacd)
![Screenshot from 2023-11-21 11-52-15](https://github.com/abhic137/Hyperledger-Fabric-k8s-gettingstarted/assets/46273637/7af29644-f459-4cc9-b47c-832e616da859)


This might be the issue 
![Screenshot from 2023-11-21 11-49-49](https://github.com/abhic137/Hyperledger-Fabric-k8s-gettingstarted/assets/46273637/34b21a6c-7254-472c-9986-c3fdcfc4c656)

This is how LENS IDE should look
![Screenshot from 2023-11-21 11-54-43](https://github.com/abhic137/Hyperledger-Fabric-k8s-gettingstarted/assets/46273637/fdea83e1-6f0b-45dd-9b8b-0f07fabce84f)


## Channel operation
go inside the cli of org 1 for channel creation
and run the commands
![Screenshot from 2023-11-21 12-11-32](https://github.com/abhic137/Hyperledger-Fabric-k8s-gettingstarted/assets/46273637/512b2abd-8371-44e2-820f-92366763df67)

```
ls
cd scripts
./createAppChannel.sh
ls channel-artifact/
```
### for peer channel join

```
cd
peer channel join -b ./channel-artifacts/mychannel.block
```
join channel for other peers as well
GO to org 2 shell
```
peer channel join -b ./channel-artifacts/mychannel.block

```
To verify use the command
inside the org2 cli
```
peer channel list
```
go to the shell of the org 3
```
peer channel join -b ./channel-artifacts/mychannel.block

```
verify
```
peer channel list

```
### Updating the aanchor peers
go to the shell of cli org1
```
./scripts/updateAnchorPeer.sh Org1MSP
```
go to the cli of org2
```
./scripts/updateAnchorPeer.sh Org2MSP

```
go to the cli of org3
```
./scripts/updateAnchorPeer.sh Org3MSP

```
## Chain code Operation
External Builders and Launchers
• Prior to Hyperledger Fabric 2.0, the process used to build and launch
chaincode was part of the peer implementation and could not be easily
customized.
• This build process would generate a Docker container image that would be
launched to execute chaincode that connected as a client to the peer.
External builder and launcher API
An external builder and launcher consists of four programs or scripts:
• bin/detect: Determine whether or not this buildpack should be used to build
the chaincode package and launch it.
• bin/build: Transform the chaincode package into executable chaincode.
• bin/release (optional): Provide metadata to the peer about the chaincode.
• bin/run (optional): Run the chaincode.
Steps involved in running an external chaincode server
1. Configure the peer service to handle external chaincode builders. i.e. Tell the
peer node to not package and run the chaincode by itself.
Configuring the peer to use external builders involves adding an externalBuilder element under the
chaincode configuration block in the core.yaml that defines external builders.
#List of directories to treat as external builders and launchers for
#chaincode. The external builder detection processing will iterate over the
#builders in the order specified below.
externalBuilders:
- name: external-builder
path: /builders/external
environmentwhitelist:
- GOPROXY
Steps involved in running an external chaincode server
1. Configure the peer service to handle external chaincode builders. i.e. Tell the peer node
to not package and run the chaincode by itself.
2. Inform the peer node about external chaincode's availability. i.e. Tell the peer
node where can it find the external chaincode service. This is given through the
connection.json file. The file itself is packaged into external builder package as
expected.
"address": "basic-org1:7052",
"dial
timeout": "10s",
"tls required": false,
"client_auth_required": false,
"client_key":
"---BEGIN EC PRIVATE KEY-.-
-END EC PRIVATE KEY-..",
"client cert":
"...-BEGIN CERTIFICATE-...-
"root_cert": "-..-BEGIN CERTIFICATE-•.• ...
...-END CERTIFICATE-•..",
--END CERTIFICATE----"
3.Install the chaincode package that carries connection.json file
4.Run the chaincode server externally.
5.Approve and commit the chaincode for a particular channel

* Points to Ponder
• Chaincode server can be started/stopped any number of times. If the peer
node does not find a connection to the running instance of chaincode server it
will establish one when either commit, invoke or query.
• Multiple peers can connect to a single instance of a chaincoder server. This is
because the peer node passes the context required in every request.
• Currently external chaincode service is only available for golang chaincode
## Packaging the chain code
in host machine
```
cd ../nfs_clientshare
ls
cd chaincode/basic/packaging
ls
cat connection.json
cat metadata.json
```
for packaging the chain code
```
tar cfz code.tar.gz connection.json
ls
tar cfz basic-org1.tgz code.tar.gz metadata.json
rm code.tar.gz
```
Edit this file (for doing the same thing for org2 and org3) 
```
nano connection.json
```
```Change the basic-org1 to basic-org2```
Execute the commands
```
tar cfz code.tar.gz connection.json
tar cfz basic-org2.tgz code.tar.gz metadata.json
```
Edit the file for org3
```
nano connection.json
rm code.tar.gz
```
```Change the basic-org2 to basic-org3```
Execute the commands
```
tar cfz code.tar.gz connection.json
tar cfz basic-org3.tgz code.tar.gz metadata.json
```
to check 
```
ls
```
![Screenshot from 2023-11-21 14-42-11](https://github.com/abhic137/Hyperledger-Fabric-k8s-gettingstarted/assets/46273637/1f38dc5a-8a36-4523-8ff8-0174ddc8f590)

### Installing chain code
go to the cli of the org1 pod

```
cd /opt/gopath/src/github.com/chaincode/
ls
cd basic/
ls
cd packaging/
ls
peer lifecycle chaincode install basic-org1.tgz
```
go to the cli of the org2 pod

```
cd /opt/gopath/src/github.com/chaincode/
ls
cd basic/
ls
cd packaging/
ls
peer lifecycle chaincode install basic-org2.tgz
```
Go to the cli of the org3
```
cd /opt/gopath/src/github.com/chaincode/basic/packaging
peer lifecycle chaincode install basic-org3.tgz
```
create a txt file names note.txt
copy and paste the last line in txt file from the org1 org2 and org3 cli

 ![Screenshot from 2023-11-21 16-44-35](https://github.com/abhic137/Hyperledger-Fabric-k8s-gettingstarted/assets/46273637/4b4ebafd-4518-4552-8ccb-e2a2091ea3f3)
create chain code deployment
check the 9.cc-deploy/basic/org1-chaincode-deployment.yaml here you have to look for the container imahe
* this image holds the chain code, we have to create a ```docker hub repository``` first 
* in Hyperledger-Fabric-k8s-gettingstarted/8.chaincode/basic/assetTransfer.go
* we have to add the info at the line 271 and 272
```

```
