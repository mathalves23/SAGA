# 🤖 Funcionalidades de IA Integradas

## Configuração da API OpenAI

Para usar as funcionalidades reais de IA, você precisa configurar uma chave da API OpenAI:

### 1. Obter uma Chave da API
1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie uma conta ou faça login
3. Vá para "API Keys" e crie uma nova chave
4. Copie a chave (começará com `sk-`)

### 2. Configurar no Projeto
Crie um arquivo `.env.local` na raiz do projeto:

```bash
REACT_APP_OPENAI_API_KEY=sua_chave_aqui
```

### 3. Reiniciar o Servidor
```bash
npm run dev
```

## Funcionalidades Implementadas

### 🗣️ **Assistente Virtual**
- **Real**: Chat com ChatGPT especializado em fitness
- **Contexto**: Personal trainer virtual com conhecimento específico
- **Recursos**: Sugestões dinâmicas, histórico de conversa

### 📷 **Análise de Forma**
- **Real**: IA analisa exercícios e gera feedback personalizado
- **Recursos**: Pontuação, feedback detalhado, sugestões de melhoria
- **Prompts**: Especialista em biomecânica e análise de movimento

### 🎤 **Comando de Voz**
- **Real**: Processamento de comandos naturais via IA
- **Recursos**: Interpretação contextual, respostas personalizadas
- **Simulação**: Reconhecimento de voz (Web Speech API em produção)

### 🚀 **Geração de Treinos**
- **Real**: Criação de treinos personalizados via IA
- **Parâmetros**: Objetivo, duração, nível, grupo muscular
- **Output**: JSON estruturado com exercícios detalhados

### 🥗 **Nutrição Inteligente** (Premium)
- **Real**: Conselhos nutricionais personalizados
- **Contexto**: Nutricionista esportivo especializado
- **Recursos**: Cálculos específicos, recomendações práticas

## Modo Demonstração

Sem a API key configurada, todas as funcionalidades funcionam em modo demonstração:
- Respostas pré-programadas inteligentes
- Simulação realística das funcionalidades
- Interface completamente funcional

## Custos da API

- **Modelo**: GPT-3.5-turbo (mais econômico)
- **Tokens**: ~500 tokens por resposta
- **Estimativa**: ~$0.001-0.002 por conversa
- **Otimização**: Histórico limitado, respostas concisas

## Segurança

⚠️ **Importante**: Em produção, a chave da API deve estar no backend, não no frontend.

### Implementação Recomendada para Produção:
1. Backend com proxy para OpenAI
2. Autenticação de usuário
3. Rate limiting
4. Logs de uso
5. Cache de respostas comuns

## Estrutura do Código

```
src/services/aiService.ts     # Serviço principal de IA
src/pages/ai/AIPage.tsx       # Interface principal
```

### Métodos Principais:
- `chatAssistant()` - Chat inteligente
- `analyzeForm()` - Análise de exercícios  
- `processVoiceCommand()` - Comandos de voz
- `generateWorkout()` - Geração de treinos
- `getNutritionAdvice()` - Conselhos nutricionais

## Personalização

Você pode personalizar os prompts em `aiService.ts`:
- Ajustar personalidade da IA
- Modificar especialização
- Alterar formato das respostas
- Adicionar contexto específico

## Suporte

Para dúvidas sobre implementação ou problemas:
1. Verifique a configuração da API key
2. Confira os logs do console
3. Teste em modo demonstração primeiro
4. Consulte a documentação da OpenAI 