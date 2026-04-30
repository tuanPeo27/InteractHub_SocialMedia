# Azure Deployment Guide

## 3.4 CI/CD and Cloud Deployment - Documentation

### D1: Azure Deployment and CI/CD Pipeline

---

## 1. Azure Account Setup

### 1.1 Create Azure Account
1. Visit [azure.microsoft.com](https://azure.microsoft.com)
2. Sign up for a free account or use existing subscription
3. Note: Students can get free Azure credits via Azure for Students

### 1.2 Create Resource Group
```powershell
az group create --name InteractHubRG --location "Southeast Asia"
```

---

## 2. Azure App Service Deployment

### 2.1 Create App Service Plan
```powershell
az appservice plan create --name InteractHubPlan --resource-group InteractHubRG --sku FREE
```

### 2.2 Create Web App
```powershell
az webapp create \
  --name InteractHub \
  --resource-group InteractHubRG \
  --plan InteractHubPlan \
  --runtime "DOTNET|10"
```

### 2.3 Configuration
Set the following application settings:
```
AZURE_SQL_CONNECTION_STRING = "Server=tcp:server.database.windows.net,1433;Database=InteractHubDB;User ID=admin;Password=xxx;Encrypt=true;Connection Timeout=30;"
JWT_SECRET = "your-secret-key-min-32-chars-long"
Frontend__BaseUrl = "https://your-frontend.azurewebsites.net"
```

---

## 3. Azure SQL Database

### 3.1 Create SQL Server
```powershell
az sql server create \
  --name interacthubdb \
  --resource-group InteractHubRG \
  --location "Southeast Asia" \
  --admin-user adminuser \
  --admin-password YourPassword123!
```

### 3.2 Create SQL Database
```powershell
az sql db create \
  --name InteractHubDB \
  --server interacthubdb \
  --resource-group InteractHubRG \
  --service-tier Basic \
  --capacity 5
```

### 3.3 Configure Firewall
```powershell
az sql server firewall-rule create \
  --resource-group InteractHubRG \
  --server interacthubdb \
  --name AllowAzureIP \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

---

## 4. Azure Blob Storage

### 4.1 Create Storage Account
```powershell
az storage account create \
  --name interacthubstorage \
  --resource-group InteractHubRG \
  --location "Southeast Asia" \
  --sku Standard_LRS
```

### 4.2 Create Blob Container
```powershell
az storage container create \
  --name posts-images \
  --account-name interacthubstorage \
  --public-access off
```

### 4.3 Get Connection String
```powershell
az storage account show-connection-string \
  --name interacthubstorage \
  --resource-group InteractHubRG
```

---

## 5. CI/CD Pipeline (GitHub Actions)

### 5.1 Pipeline Configuration
The CI/CD pipeline is configured in [.github/workflows/azure-deploy.yml](.github/workflows/azure-deploy.yml)

**Workflow Steps:**
1. **Build**: Checkout code, restore packages, build, test
2. **Deploy**: Download artifacts, login to Azure, deploy to App Service

### 5.2 GitHub Secrets Configuration
Add these secrets in GitHub repository Settings → Secrets:
- `AZURE_PUBLISH_PROFILE`: Azure publish profile (download from Azure Portal)

### 5.3 Triggering Deployment
```bash
# Push to main branch triggers deployment
git push origin main
```

---

## 6. Environment Configuration

### 6.1 appsettings.json for Production
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:interacthubdb.database.windows.net,1433;Database=InteractHubDB;User ID=admin;Password=xxx;Encrypt=true;"
  },
  "Jwt": {
    "Secret": "your-32-character-minimum-secret-key",
    "Issuer": "InteractHub",
    "Audience": "InteractHubUsers"
  },
  "Azure": {
    "StorageConnectionString": "DefaultEndpointsProtocol=https;AccountName=interacthubstorage;AccountKey=xxx..."
  }
}
```

### 6.2 Azure Portal Configuration
1. Go to Azure Portal → App Service → Configuration
2. Add application settings:
   - `ConnectionStrings__DefaultConnection`
   - `Jwt__Secret`
   - `Azure__StorageConnectionString`
   - `Frontend__BaseUrl`

---

## 7. Application Insights (Monitoring)

### 7.1 Create Application Insights
```powershell
az monitor app-insights component create \
  --app InteractHubInsights \
  --location "Southeast Asia" \
  --resource-group InteractHubRG
```

### 7.2 Add Instrumentation Key
```powershell
az monitor app-insights component show \
  --app InteractHubInsights \
  --resource-group InteractHubRG
```

---

## 8. Deployment Verification

### 8.1 Check Deployment Status
```powershell
az webapp deployment list --resource-group InteractHubRG --name InteractHub
```

### 8.2 View Logs
```powershell
az webapp log tail --resource-group InteractHubRG --name InteractHub
```

### 8.3 Test Application
```
Backend API: https://interacthub.azurewebsites.net/api/
Swagger: https://interacthub.azurewebsites.net/swagger/index.html
```

---

## 9. Live Application URLs

| Service | URL |
|---------|-----|
| Backend API | `https://interacthub.azurewebsites.net` |
| Swagger UI | `https://interacthub.azurewebsites.net/swagger` |
| Application Insights | `https://portal.azure.com` → InteractHubInsights |

---

## 10. Pipeline Execution Results

### Build Status: ✅ SUCCESS
```
✓ Restore packages
✓ Build project
✓ Run unit tests (15+ tests)
✓ Publish artifacts
```

### Deployment Status: ✅ SUCCESS
```
✓ Login to Azure
✓ Deploy to Azure App Service
✓ Application started successfully
```

---

## Summary

| Requirement | Status | Details |
|-------------|--------|---------|
| Azure Account | ✅ | Free tier account created |
| App Service | ✅ | InteractHub web app deployed |
| SQL Database | ✅ | Azure SQL Server & Database |
| Blob Storage | ✅ | Storage account for images |
| CI/CD Pipeline | ✅ | GitHub Actions workflow |
| Environment Config | ✅ | App settings configured |
| Monitoring | ✅ | Application Insights enabled |

**Live URL**: `https://interacthub.azurewebsites.net`