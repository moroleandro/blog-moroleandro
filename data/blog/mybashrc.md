---
title: 'My .bashrc'
date: '2022-12-04'
tags: ['bashrc']
draft: false
summary: 'my commands that I use in my bashrc, which make my day to day easier'
---

```bash:.bashrc
alias k=kubectl
complete -F __start_kubectl k
alias kg='kubectl get pod'
alias kd='kubectl describe'
```
