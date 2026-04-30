# Azure Deployment Guide

## Azure Resources Setup

### 1. Create Azure Account and Resource Group
- Sign up for an Azure account at [Azure Portal](https://portal.azure.com).
- Create a resource group:
  ```bash
  az group create --name InteractHubGroup --location eastus
  ```

### 2. Deploy Azure App Service
- Create an App Service:
  ```bash
  az webapp create --resource-group InteractHubGroup --plan InteractHubPlan --name InteractHubApp --runtime "DOTNET|7.0"
  ```

### 3. Configure Azure SQL Database
- Create an Azure SQL Database:
  ```bash
  az sql server create --name interacthub-sql --resource-group InteractHubGroup --location eastus --admin-user adminuser --admin-password YourPassword123
  az sql db create --resource-group InteractHubGroup --server interacthub-sql --name InteractHubDB --service-objective S0
  ```

### 4. Set Up Azure Blob Storage
- Create a storage account:
  ```bash
  az storage account create --name interacthubstorage --resource-group InteractHubGroup --location eastus --sku Standard_LRS
  ```

## CI/CD Pipeline

### GitHub Secrets
Add the following secrets to your GitHub repository:
- `AZURE_WEBAPP_PUBLISH_PROFILE`: Publish profile of your Azure App Service.
- `AZURE_SQL_CONNECTION_STRING`: Connection string for Azure SQL Database.
- `AZURE_STORAGE_CONNECTION_STRING`: Connection string for Azure Blob Storage.

### Workflow File
The CI/CD pipeline is defined in `.github/workflows/azure-deploy.yml`. It automates the build and deployment process on every push to the `main` branch.

## Environment Variables

### App Service Configuration
Set the following environment variables in Azure App Service:
- `ConnectionStrings__DefaultConnection`: Azure SQL Database connection string.
- `AzureStorage__ConnectionString`: Azure Blob Storage connection string.

## Monitoring and Logging

### Application Insights
- Enable Application Insights for your App Service:
  ```bash
  az monitor app-insights component create --app InteractHubInsights --location eastus --resource-group InteractHubGroup
  ```
- Add the instrumentation key to your App Service environment variables:
  - `APPINSIGHTS_INSTRUMENTATIONKEY`: Instrumentation key from Application Insights.

## Deployment Logs
- Deployment logs are available in the GitHub Actions workflow run logs.

## Screenshots
Include screenshots of the Azure Portal showing the deployed resources and the live application URL.