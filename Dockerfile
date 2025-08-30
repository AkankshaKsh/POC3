# Simple production image
FROM node:18-alpine

WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY index.js ./

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "index.js"]
