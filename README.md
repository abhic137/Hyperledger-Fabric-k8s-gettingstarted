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
mkdir nfs_clientshare
sudo mount -o nolocks -t nfs <IP_OF_NFS_Server>:/mnt/nfs_share ./nfs_clientshare
```
