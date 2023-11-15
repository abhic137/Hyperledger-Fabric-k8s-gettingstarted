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
