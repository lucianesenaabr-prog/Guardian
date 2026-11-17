# Guardian — Central de Emergência Digital

**Trilha:** Cibersegurança · **Hack Brasil 2026**

> Perdeu o celular ou foi roubado? O Guardian reúne em **uma única tela** tudo o que a pessoa precisa fazer nos primeiros minutos: bloquear o aparelho e a linha, travar bancos e cartões, revogar acessos e registrar a ocorrência.

**Demo:** (colar aqui o link da demo publicada)
**Vídeo (3 min):** (colar aqui o link do vídeo)
**Time:** (nomes)

> **Aviso importante: isto é uma simulação.** Banco Aurora, Banco Meridiano, Via Telecom, a fabricante "Nova" e todos os dados da Marina Alves são **fictícios**. Nada é enviado a nenhum serviço real e nenhum dado pessoal real é usado. Cada passo da demonstração mostra *o que o Guardian faria*, não executa a ação de verdade.

## O problema

Quando um celular é roubado, o relógio corre: o ladrão tenta acessar o e-mail, os aplicativos de banco e o Pix antes que a vítima consiga reagir. Hoje a vítima precisa, em pânico, ligar para a operadora, o banco, o fabricante, redefinir senhas, revogar apps conectados e ainda registrar a ocorrência, em canais diferentes e sem saber por onde começar.

(Adicionar aqui 1 ou 2 dados reais sobre roubo de celulares e fraudes por Pix, **com a fonte**.)

## A solução

O Guardian é uma central que a pessoa abre **em um computador seguro** e que coordena o protocolo de emergência inteiro, na ordem certa, com acompanhamento em tempo real.

| # | Proteção | O que o Guardian faz (na demo, simulado) |
|---|---|---|
| 1 | Proteger o dispositivo | Localiza, toca alarme, ativa o Modo Perdido, aplica bloqueio remoto e remove a conta do fabricante |
| 2 | Bloquear a linha telefônica | Pede o bloqueio à operadora, suspende a linha e desativa o chip/eSIM |
| 3 | Proteger as instituições financeiras | Em cada banco: encerra sessões, bloqueia cartões, zera o limite do Pix e remove o aparelho confiável |
| 4 | Revogar consentimentos Open Finance | Verifica e revoga, um a um, os compartilhamentos de dados ativos |
| 5 | Proteger e-mail e contas digitais | Encerra sessões, redefine a senha, ativa verificação em duas etapas, remove o telefone de recuperação e revisa regras de encaminhamento |
| 6 | Registrar a ocorrência | Organiza os dados do aparelho e encaminha a ocorrência |

**Pareamento seguro:** o login acontece no computador **e** no celular, e a pessoa digita no celular um código de 6 dígitos mostrado no computador. Só então a central é liberada.

**Celular virtual ao lado:** a tela do celular reage a cada passo, com apps bloqueados enquanto o Guardian trabalha, mensagens da operadora chegando, e a tela de "Aparelho perdido" no final. Isso torna visível o que está acontecendo.

## Como usar a demo

1. No computador, clique em **Entrar**. No celular, clique em **Entrar**.
2. No celular, digite o código mostrado no computador (ou use "Preencher código (demo)").
3. Clique em **Iniciar protocolo de emergência** e execute as proteções na ordem, ou escolha qualquer uma.
4. Use **Reiniciar cenário** para repetir.

## O que é real e o que é simulado

| Real | Simulado |
|---|---|
| Fluxo de pareamento em dois dispositivos | Bancos, operadora, fabricante e órgão de registro |
| Motor que executa as proteções passo a passo, com histórico | As chamadas a cada instituição (são esperas e mudanças de estado) |
| Estado compartilhado entre a central e o celular | Localização, alarme, bloqueio e protocolos gerados |
| Interface completa, sem dependência de servidor | Todos os dados pessoais (fictícios) |

**Caminho para um produto real:** cada passo do motor (`src/engine/protocols.ts`) viraria uma integração com a instituição correspondente (banco, operadora, fabricante, Open Finance e canal de registro de ocorrência), com consentimento explícito da pessoa e trilha de auditoria. Isso depende de parcerias e de APIs que não fazem parte desta demonstração.

## Decisões técnicas

- **Um único estado, duas telas.** A central e o celular virtual leem o mesmo estado (`src/state/store.ts`), por isso qualquer ação aparece nos dois lugares sem sincronização extra.
- **Motor de protocolos separado da interface** (`src/engine/`). Cada proteção é só uma lista de passos; adicionar uma nova é descrever os passos, sem mexer na interface.
- **Demo em um único arquivo HTML** (`vite-plugin-singlefile`), fácil de publicar e sem backend: funciona offline e não faz nenhuma chamada de rede.
- **Dados fictícios centralizados** (`src/data/scenario.ts`), para nunca misturar com dados reais.
- **TypeScript em modo estrito.**

## Como rodar

Requisitos: Node.js 18 ou mais recente.

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # confere os tipos e gera dist/index.html (arquivo único)
```

A demo publicada está em `docs/index.html` (copiar `dist/index.html` para lá depois de um novo `npm run build`).

## Estrutura

```
src/
  data/        cenário fictício e lista das seis proteções
  state/       tipos e estado central
  engine/      motor que executa as proteções e a definição dos passos de cada uma
  components/
    desktop/   central no computador (entrada, painel, histórico)
    phone/     celular virtual (apps e telas)
```

## Limites e próximos passos

- A demo não se conecta a nenhum serviço: não bloqueia nada de verdade.
- Próximos passos: integração real com Open Finance e com um banco piloto, uso do celular de um familiar como segundo fator para iniciar o protocolo e aviso automático a contatos de confiança.
- Ainda não há testes automatizados; a verificação foi feita comparando o comportamento da interface passo a passo.

## Créditos

Projeto desenvolvido com apoio de ferramentas de IA, conforme permitido pelo regulamento do Hack Brasil 2026.
