# Otimizador de Imagens

Este projeto é um serviço backend para otimização de imagens, basta enviar uma imagem pela API. Assim que o upload é feito, a imagem é colocada em uma fila de processamento. Um worker especializado pega essa tarefa e realiza a otimização da imagem, criando diferentes versões em baixa, média e alta qualidade. Todos os arquivos gerados, junto com o status do processamento e informações detalhadas da tarefa, ficam armazenados no MongoDB, permitindo fácil acompanhamento e consulta.

## Variaveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```
# MongoDB
MONGODB_URI=mongodb://localhost:27017/web_img_optimization
MONGODB_URI_TEST=mongodb://localhost:27017/web_img_optimization_test

# RabbitMQ
RABBITMQ_URL=amqp://localhost
RABBITMQ_QUEUE=img_tasks

# Porta da API
PORT=3000

# Pasta onde as imagens otimizadas serão salvas
OUTPUT_DIR=processed_images
```

- Certifique-se de que os serviços do MongoDB e RabbitMQ estejam rodando e acessíveis nos endereços configurados.
- O parâmetro `OUTPUT_DIR` define onde as imagens otimizadas serão salvas.
- Altere as variáveis conforme necessário para seu ambiente de desenvolvimento, teste ou produção.

## Instalação

### 1. Com Docker/Docker Compose (Recomendado)
1. Configure o arquivo `.env` com as variáveis necessárias (MongoDB, RabbitMQ, etc).
2. Suba os serviços:
   ```powershell
   docker-compose up
   ```
3. Acesse a API em `http://localhost:3000`.

### 2. Sem Docker
1. Instale as dependências:
   ```powershell
   npm install
   ```
2. Configure o arquivo `.env`.
3. Inicie o serviço:
   ```powershell
   npm start
   ```
4. Certifique-se de que MongoDB e RabbitMQ estejam rodando localmente.

## Rotas da API

### 1. Upload de Imagem
- **POST** `/upload`
- Envia uma imagem para processamento.
- Resposta: `task_id` e status inicial.

Exemplo cURL:
```bash
curl --request POST \
  --url http://localhost:3000/api/upload \
  --header 'content-type: multipart/form-data' \
  -F "file=@/caminho/para/sua/imagem.jpg"
```

> A imagem deve ser enviada no campo `file` do formulário multipart.

### 2. Consulta de Status
- **GET** `/status/{task_id}`
- Consulta o status e metadados da tarefa.

Exemplo cURL:
```bash
curl http://localhost:3000/status/SEU_TASK_ID_AQUI
```

## Observações
- As imagens otimizadas são salvas na pasta `processed_images/`.
- O serviço suporta formatos como WebP.

## Testes
Execute os testes com:
```powershell
npx jest
```