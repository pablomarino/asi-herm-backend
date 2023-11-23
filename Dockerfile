FROM denoland/deno:alpine

WORKDIR /app

COPY . ./

EXPOSE 4000

CMD ["deno", "task", "start"]
