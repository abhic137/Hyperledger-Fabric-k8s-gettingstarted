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
