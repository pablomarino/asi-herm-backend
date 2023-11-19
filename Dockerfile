FROM denoland/deno:alpine

WORKDIR /app

COPY . ./

EXPOSE 4000

CMD ["run", "--allow-all", "server.ts"]
