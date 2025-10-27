#!/bin/bash

echo "🔍 Sales Scoreboard - Project Verification"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

checks_passed=0
checks_total=0

check_file() {
    checks_total=$((checks_total + 1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        checks_passed=$((checks_passed + 1))
    else
        echo -e "${RED}✗${NC} $2 - Missing: $1"
    fi
}

check_dir() {
    checks_total=$((checks_total + 1))
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        checks_passed=$((checks_passed + 1))
    else
        echo -e "${RED}✗${NC} $2 - Missing: $1"
    fi
}

echo "📚 Documentation Files:"
check_file "README.md" "Main README"
check_file "START_HERE.md" "Getting Started Guide"
check_file "QUICKSTART.md" "Quick Start Guide"
check_file "DEPLOYMENT_CHECKLIST.md" "Deployment Checklist"
check_file "COMMANDS.md" "Commands Reference"
check_file "PROJECT_SUMMARY.md" "Project Summary"
echo ""

echo "⚙️ Configuration Files:"
check_file "package.json" "Root package.json"
check_file ".gitignore" "Git ignore file"
check_file "render.yaml" "Render config"
echo ""

echo "🖥️ Backend Files:"
check_dir "server" "Server directory"
check_file "server/package.json" "Server package.json"
check_file "server/server.js" "Main server file"
check_file "server/.env.example" "Server env example"
check_dir "server/models" "Models directory"
check_file "server/models/User.js" "User model"
check_dir "server/middleware" "Middleware directory"
check_file "server/middleware/auth.js" "Auth middleware"
check_dir "server/routes" "Routes directory"
check_file "server/routes/auth.js" "Auth routes"
check_file "server/routes/users.js" "Users routes"
check_file "server/routes/ai.js" "AI routes"
echo ""

echo "🎨 Frontend Files:"
check_dir "client" "Client directory"
check_file "client/package.json" "Client package.json"
check_file "client/index.html" "HTML template"
check_file "client/vite.config.js" "Vite config"
check_file "client/tailwind.config.js" "Tailwind config"
check_file "client/postcss.config.js" "PostCSS config"
check_file "client/.env.example" "Client env example"
check_dir "client/src" "Source directory"
check_file "client/src/main.jsx" "Main entry point"
check_file "client/src/App.jsx" "App component"
check_file "client/src/index.css" "Global styles"
echo ""

echo "📄 React Pages:"
check_dir "client/src/pages" "Pages directory"
check_file "client/src/pages/Login.jsx" "Login page"
check_file "client/src/pages/Register.jsx" "Register page"
check_file "client/src/pages/Dashboard.jsx" "Dashboard page"
check_file "client/src/pages/Profile.jsx" "Profile page"
check_file "client/src/pages/AdminPanel.jsx" "Admin panel"
check_file "client/src/pages/About.jsx" "About page"
echo ""

echo "🧩 React Components:"
check_dir "client/src/components" "Components directory"
check_file "client/src/components/Navigation.jsx" "Navigation component"
check_file "client/src/components/ChatWidget.jsx" "Chat widget"
check_file "client/src/components/PrivateRoute.jsx" "Private route"
echo ""

echo "🔧 Additional Frontend:"
check_dir "client/src/context" "Context directory"
check_file "client/src/context/AuthContext.jsx" "Auth context"
check_dir "client/src/services" "Services directory"
check_file "client/src/services/api.js" "API service"
echo ""

echo "=========================================="
echo -e "Results: ${GREEN}$checks_passed${NC}/$checks_total checks passed"
echo ""

if [ $checks_passed -eq $checks_total ]; then
    echo -e "${GREEN}✓ All files verified! Project is complete!${NC}"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Read START_HERE.md"
    echo "   2. Follow QUICKSTART.md for setup"
    echo "   3. Deploy using DEPLOYMENT_CHECKLIST.md"
else
    echo -e "${RED}✗ Some files are missing. Please check above.${NC}"
fi
echo ""
