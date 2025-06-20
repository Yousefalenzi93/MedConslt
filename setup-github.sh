#!/bin/bash

# إعداد Git ورفع المشروع على GitHub

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 إعداد Git ورفع المشروع على GitHub${NC}"
echo -e "${CYAN}==========================================${NC}"
echo ""

# Get GitHub username
if [ -z "$1" ]; then
    echo -e "${YELLOW}يرجى إدخال اسم المستخدم على GitHub:${NC}"
    read -p "GitHub Username: " GITHUB_USERNAME
else
    GITHUB_USERNAME=$1
fi

if [ -z "$2" ]; then
    REPOSITORY_NAME="medical-consultation-platform"
else
    REPOSITORY_NAME=$2
fi

# Check if git is installed
echo -e "${YELLOW}🔍 فحص Git...${NC}"
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✅ Git متوفر: $GIT_VERSION${NC}"
else
    echo -e "${RED}❌ Git غير مثبت${NC}"
    echo -e "${YELLOW}يرجى تثبيت Git أولاً${NC}"
    exit 1
fi

# Initialize git if not already initialized
echo ""
echo -e "${YELLOW}📁 إعداد Git...${NC}"
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✅ تم إنشاء مستودع Git محلي${NC}"
else
    echo -e "${GREEN}✅ مستودع Git موجود بالفعل${NC}"
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo -e "${RED}❌ ملف .gitignore غير موجود${NC}"
    echo -e "${YELLOW}يرجى إنشاء ملف .gitignore أولاً${NC}"
    exit 1
fi

# Add all files
echo ""
echo -e "${YELLOW}📦 إضافة الملفات...${NC}"
git add .

# Check git status
echo ""
echo -e "${YELLOW}📋 حالة الملفات:${NC}"
git status --short

# Commit
echo ""
echo -e "${YELLOW}💾 إنشاء commit...${NC}"
COMMIT_MESSAGE="Initial commit: Medical consultation platform

✨ Features:
- 🏥 Complete medical consultation platform
- 🤖 AI assistant integration
- 📹 Video call functionality
- 📱 Responsive design
- 🔒 Secure authentication
- 📊 Advanced analytics

🛠️ Tech Stack:
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod validation

🚀 Ready for Netlify deployment!"

git commit -m "$COMMIT_MESSAGE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ تم إنشاء commit بنجاح${NC}"
else
    echo -e "${RED}❌ فشل في إنشاء commit${NC}"
    exit 1
fi

# Set main branch
echo ""
echo -e "${YELLOW}🌿 إعداد الفرع الرئيسي...${NC}"
git branch -M main
echo -e "${GREEN}✅ تم إعداد فرع main${NC}"

# Add remote origin
echo ""
echo -e "${YELLOW}🔗 إضافة remote origin...${NC}"
REMOTE_URL="https://github.com/$GITHUB_USERNAME/$REPOSITORY_NAME.git"

# Remove existing origin if exists
git remote remove origin 2>/dev/null

git remote add origin $REMOTE_URL
echo -e "${GREEN}✅ تم إضافة remote: $REMOTE_URL${NC}"

# Instructions for GitHub
echo ""
echo -e "${CYAN}📋 الخطوات التالية:${NC}"
echo -e "1. اذهب إلى: https://github.com/new"
echo -e "2. اسم المستودع: $REPOSITORY_NAME"
echo -e "3. اختر Public أو Private"
echo -e "4. لا تضيف README أو .gitignore (موجودان بالفعل)"
echo -e "5. انقر 'Create repository'"

echo ""
echo -e "${CYAN}🚀 بعد إنشاء المستودع، شغل:${NC}"
echo -e "${YELLOW}git push -u origin main${NC}"

echo ""
echo -e "${CYAN}🌐 للربط مع Netlify:${NC}"
echo -e "1. اذهب إلى: https://netlify.com"
echo -e "2. انقر 'New site from Git'"
echo -e "3. اختر GitHub واختر المستودع"
echo -e "4. الإعدادات ستُقرأ تلقائياً من netlify.toml"

echo ""
echo -e "${CYAN}📁 الملفات المرفوعة:${NC}"
FILE_COUNT=$(git ls-files | wc -l)
echo -e "${GREEN}عدد الملفات: $FILE_COUNT${NC}"

echo ""
echo -e "${GREEN}✅ تم الإعداد بنجاح!${NC}"
echo -e "${GREEN}المشروع جاهز للرفع على GitHub والربط مع Netlify${NC}"

echo ""
echo "اضغط Enter للخروج..."
read
