---
title: 'Criando cluster kubernetes utilizando containerd'
date: '2024-12-10'
tags: ['k8s']
draft: false
summary: ' '
---

# Introdução

Neste exemplo vou demonostrar como subir um pequeno cluster kubernetes, para utilizar em cenários de testes, utilizando containerd.

# Requisitos

- 1 VM Controlplane (Ubuntu 24.04 LTS - 1vCPU 2GB - x86).
- 1 VM Workload (Ubuntu 24.04 LTS - 1vCPU 2GB - x86).

[imagem]

# Configuracoes iniciais (Control-plane)

1 - Carregar dois modulos do Kernel (overlay e br_netfilter)

```bash:.bashrc
echo overlay >> /etc/modules-load.d/k8s.conf
echo br_netfilter >> /etc/modules-load.d/k8s.conf

```

2 - Mudar alguns parametros dentro do SO, para habilitar o ip Forwarding, bridge ipv4 e ipv6

```bash:.bashrc
echo net.bridge.bridge-nf-call-iptables = 1 >> /etc/sysctl.d/k8s.conf
echo net.bridge.bridge-nf-call-ip6tables = 1 >> /etc/sysctl.d/k8s.conf
echo net.ipv4.ip_forward = 1 >> /etc/sysctl.d/k8s.conf
```

3 - Faca um reboot utilizando o seguinte comando, para maquina carregar os modulos alterados.

```bash:.bashrc
sysctl --system
```

# Instalacão do runtime containerd (Control-plane)

1 - Realize um update dos pacotes

```bash:.bashrc
apt update -y
```

2 - Instale o binario do containerd

```bash:.bashrc
apt install -y containerd
```

3 - Crie um diretorio para setar as configuracoes do containerd

```bash:.bashrc
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml
systemctl restart containerd.service
```

# Instalacao dos pacotes kubernetes (kubeadm, kubectl e kubelet) - ControlPlane

https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/

```bash:.bashrc
apt-get install -y apt-transport-https ca-certificates curl gpg
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
apt-get update -y
apt-cache madison kubelet ## para buscar a versão do kubelet, neste caso vou usar a 1.31
apt-get install -y kubelet=1.31.3-1.1 kubeadm=1.31.3-1.1 kubectl=1.31.3-1.1
apt-mark hold kubelet kubeadm kubectl
systemctl enable --now kubelet
```

2 - Após feito a instalacão dos pacotes do kubernetes, chegou a hora de iniciar nosso cluster, para isso vamos utilizar o kubeadm para criar este cluster.

```bash:.bashrc
kubeadm init
```

3 - Após essa instalacão seria apresentado um token parecido com este para realizar o vinculo de nodes workers dentro do nosso cluster. Mas antes precisamos ajustar nosso worker-node para vincular ele dentro do cluster.

```bash:.bashrc
kubeadm join 10.128.0.2:6443 --token auizk7.zbsq77inba5eys2h \
        --discovery-token-ca-cert-hash sha256:6832f193effb7802dc020f34f64ec63c23ca2415ae1c355dae265af987154187
```

Não se preocupe, caso você feche a sessão e perca este token basta executar o comando

```bash:.bashrc
kubeadm token create --print-join-command
```

4 - Outro ponto necessário é liberar algumas permissões para a pasta do kubernetes

```bash:.bashrc
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config
```

5 - Após esses passos você já está apto executar qualquer comando para validar que seu no master está ok

```bash:.bashrc

kubectl cluster-info
kubectl get pods -A
```

# Configuracoes iniciais (Worker)

1 - Carregar dois modulos do Kernel (overlay e br_netfilter)

```bash:.bashrc
echo overlay >> /etc/modules-load.d/k8s.conf
echo br_netfilter >> /etc/modules-load.d/k8s.conf

```

2 - Mudar alguns parametros dentro do SO, para habilitar o ip Forwarding, bridge ipv4 e ipv6

```bash:.bashrc
echo net.bridge.bridge-nf-call-iptables = 1 >> /etc/sysctl.d/k8s.conf
echo net.bridge.bridge-nf-call-ip6tables = 1 >> /etc/sysctl.d/k8s.conf
echo net.ipv4.ip_forward = 1 >> /etc/sysctl.d/k8s.conf
```

3 - Faca um reboot utilizando o seguinte comando, para maquina carregar os modulos alterados.

```bash:.bashrc
sysctl --system
```

# Instalacão do runtime containerd (Worker)

1 - Realize um update dos pacotes

```bash:.bashrc
apt update -y
```

2 - Instale o binario do containerd

```bash:.bashrc
apt install -y containerd
```

3 - Crie um diretorio para setar as configuracoes do containerd

```bash:.bashrc
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml
systemctl restart containerd.service
```

# Instalacao dos pacotes kubernetes (kubeadm, kubectl e kubelet) - Worker

https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/

```bash:.bashrc
apt-get install -y apt-transport-https ca-certificates curl gpg
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
apt-get update -y
apt-cache madison kubelet ## para buscar a versão do kubelet, neste caso vou usar a 1.31
apt-get install -y kubelet=1.31.3-1.1 kubeadm=1.31.3-1.1 kubectl=1.31.3-1.1
apt-mark hold kubelet kubeadm kubectl
systemctl enable --now kubelet
```

2 - Garanta que o containerd está em funcionamento

systemctl status containerd.service

# Realizando join dos nodes workers dentro do cluster

1 - Execute o comando gerado pelo control-plane dentro do node worker

```
kubeadm join 10.128.0.2:6443 --token auizk7.zbsq77inba5eys2h \
        --discovery-token-ca-cert-hash sha256:6832f193effb7802dc020f34f64ec63c23ca2415ae1c355dae265af987154187

```

2 - Feito este processo, você acabou de vincular o node worker dentro do cluster, mas o kubectl ainda não vai retornar nada dentro do node worker, para validar que o vinculo foi executado com sucesso, vá até seu control-plane e digite o seguinte comando para validar o vinculo.

```
kubectl get nodes
```

3 - Repare, que o node foi vinculado, mas tanto o node worker quanto o control-plane estão com o status "NotReady", isso significa que estamos sem nenhum cluster CNI de Network configurado. Neste tutorial vou utilizar o wave net um CNI suportado pelo Kubenetes.

```
kubectl apply -f https://github.com/weaveworks/weave/releases/download/v2.8.1/weave-daemonset-k8s.yaml

```

4 - Agora execute um kubectl get nodes e você vai perceber que os nodes ficaram ready

[imagem-3]

Obs.:

Nesta versão você pode manusear o cluster com o crictl como se fosse o docker
crictl ps

Ajuste crictl
export CONTAINER_RUNTIME_ENDPOINT=unix://run/containerd/containerd.sock
