# Guia de Deploy na Vercel

A Vercel é uma das plataformas mais fáceis para publicar projetos React.

## Passo 1: Preparar o Código

Eu já ajudei a configurar o `vite.config.js` para funcionar na Vercel (removi a configuração específica do GitHub Pages).

Agora você precisa **enviar essa alteração para o GitHub**:

1.  Abra o terminal.
2.  Execute estes comandos, um por um:
    ```bash
    git add .
    git commit -m "Configurar para Vercel"
    git push
    ```

## Passo 2: Criar Projeto na Vercel

1.  Acesse [vercel.com](https://vercel.com).
2.  Faça login com sua conta do **GitHub**.
3.  No painel (Dashboard), clique em **"Add New..."** -> **"Project"**.
4.  Você verá uma lista dos seus repositórios do GitHub. Clique em **Import** ao lado do projeto `ocorrencias`.

## Passo 3: Configurar e Publicar

1.  Na tela de configuração ("Configure Project"), a Vercel já deve detectar que é um projeto **Vite**.
2.  Não precisa mudar nada nas configurações de Build.
3.  Clique em **Deploy**.

## Pronto!

Em cerca de 1 min, o site estará no ar e você receberá um link (ex: `ocorrencia.vercel.app`).
Qualquer mudança que você fizer no código e enviar para o GitHub (`git push`) atualizará o site automaticamente na Vercel.
