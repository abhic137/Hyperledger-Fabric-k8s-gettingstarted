1. Installing and Configuring Cert-Manager

```kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.3.1/cert-manager.yaml```

2. Setting up issuer
```kubectl apply -f issuer.yaml```

3. update the ingress in with information