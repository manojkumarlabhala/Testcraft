FROM node:20-alpine
WORKDIR /worker
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY scripts ./scripts
WORKDIR /worker/scripts
CMD ["node", "ai-publish-example.js"]
