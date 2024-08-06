

FROM node:22-alpine3.19

WORKDIR /app/frontend

COPY .  .

RUN  npm install && \
     npm run build    

EXPOSE 3000
CMD ["npm","run","dev"]
