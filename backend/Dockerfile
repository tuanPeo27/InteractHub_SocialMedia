FROM mcr.microsoft.com/dotnet/nightly/sdk:10.0-preview AS build

WORKDIR /src

COPY . ./

RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/nightly/aspnet:10.0-preview

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "backend.dll"]