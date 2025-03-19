# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# Create app and data directories with proper permissions
WORKDIR /app
# Create data directory and ensure it has correct permissions
RUN mkdir -p /app/data && chmod 777 /app/data
USER $APP_UID
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
RUN apt-get update && apt-get install -y nodejs npm --fix-missing
WORKDIR /src
COPY ["gamebooktest1.client/nuget.config", "gamebooktest1.client/"]
COPY ["GamebookTest1.Server/GamebookTest1.Server.csproj", "GamebookTest1.Server/"]
COPY ["gamebooktest1.client/gamebooktest1.client.esproj", "gamebooktest1.client/"]
COPY ["gamebooktest1.client/package.json", "gamebooktest1.client/"]
COPY ["gamebooktest1.client/package-lock.json", "gamebooktest1.client/"]
RUN dotnet restore "./GamebookTest1.Server/GamebookTest1.Server.csproj"
COPY . .

# Build the React client
WORKDIR "/src/gamebooktest1.client"
RUN npm ci
RUN npm run build

# Build the server
WORKDIR "/src/GamebookTest1.Server"
RUN dotnet build "./GamebookTest1.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./GamebookTest1.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Create wwwroot directory and copy the React build output
RUN mkdir -p /app/publish/wwwroot
COPY --from=build /src/gamebooktest1.client/dist/ /app/publish/wwwroot/

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# Ensure data directory exists with proper permissions in the final image
RUN mkdir -p /app/data && chmod 777 /app/data
ENTRYPOINT ["dotnet", "GamebookTest1.Server.dll"]