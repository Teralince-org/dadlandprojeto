# 1. Imagem base do Node.js
FROM node:20-slim

# 2. Define o diretório de trabalho
WORKDIR /app

# 3. Copia apenas o que é necessário para instalar as dependências primeiro
# (Isso acelera o build do Docker)
COPY package.json package-lock.json* ./

# 4. Instala as dependências
RUN npm install 

# 5. Copia o resto do código
COPY . .

# 6. Porta padrão do Next.js
EXPOSE 3000

# 7. Comando para rodar em desenvolvimento
CMD ["npm", "run", "dev"]