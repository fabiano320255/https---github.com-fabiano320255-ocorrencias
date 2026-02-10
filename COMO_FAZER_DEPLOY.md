# Guia de Deploy (Publicação)

O "Deploy" (publicação do site) é feito **no terminal do seu computador**, dentro da pasta do projeto.

## Passo a Passo

1. **Abra o Terminal**: 
   - Pode ser o terminal do VS Code (Terminal > New Terminal)
   - Ou o CMD/PowerShell do Windows na pasta do projeto.

2. **Execute o comando**:
   ```bash
   npm run deploy
   ```

## O que acontece quando você roda isso?

Quando você roda esse comando, ele segue as instruções que configuramos no arquivo `package.json`:

1. **Build**: Primeiro ele roda `vite build`. Isso cria uma pasta `dist` com a versão otimizada do seu site.
2. **Upload**: Depois ele usa o pacote `gh-pages` para pegar essa pasta `dist` e enviar para um "ramo" (branch) especial no seu GitHub chamado `gh-pages`.

## Onde ver o site?

Depois de alguns minutos, o GitHub detecta a mudança e atualiza o site no endereço:
https://fabiano320255.github.io/ocorrencias/

---

## Dúvidas Comuns

### "No meu computador eu preciso rodar `npm run dev` para ver (servidor rodando). No GitHub não precisa?"

**Não.** O motivo é que existem dois "modos" de rodar o site:

1.  **Modo Desenvolvimento (`npm run dev`)**:
    - Usado no seu PC enquanto você cria o site.
    - É um "servidor inteligente" que fica vigiando seus arquivos.
    - Se você muda uma vírgula no código, o site atualiza na hora.
    - Precisa estar rodando o tempo todo.

2.  **Modo Produção (GitHub Pages)**:
    - É o site "pronto", como se fosse um arquivo PDF finalizado.
    - Quando rodamos o deploy (`vite build`), o computador transformou todo o seu código React complexo em arquivos simples (HTML, CSS e JavaScript puro) que qualquer navegador entende.
    - O GitHub Pages apenas **entrega** esses arquivos estáticos para quem acessar. Ele não fica "rodando" nada no fundo, só hospedando os arquivos.
