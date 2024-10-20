# Use the official Node.js image as the base for building the React app
FROM denoland/deno:2.0.2 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY deno.json deno.lock ./
RUN deno install

# Copy the rest of the application and build
COPY . .
RUN deno run build

# Use Nginx to serve the built React app
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
