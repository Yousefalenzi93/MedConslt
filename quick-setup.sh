#!/bin/bash

# إعداد سريع لمنصة الاستشارات الطبية
echo "🏥 إعداد سريع لمنصة الاستشارات الطبية"
echo "============================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${YELLOW}🔍 فحص Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js متوفر: $NODE_VERSION${NC}"
    
    MAJOR_VERSION=$(echo $NODE_VERSION | sed 's/v//' | cut -d. -f1)
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ خطأ: يتطلب Node.js 18 أو أحدث${NC}"
        echo -e "${YELLOW}يرجى تحميل Node.js من: https://nodejs.org${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Node.js غير مثبت${NC}"
    echo -e "${YELLOW}يرجى تحميل Node.js من: https://nodejs.org${NC}"
    exit 1
fi

# Install dependencies
echo ""
echo -e "${YELLOW}📦 تثبيت التبعيات...${NC}"
if npm install; then
    echo -e "${GREEN}✅ تم تثبيت التبعيات بنجاح${NC}"
else
    echo -e "${RED}❌ خطأ في تثبيت التبعيات${NC}"
    exit 1
fi

# Type check
echo ""
echo -e "${YELLOW}🔧 فحص TypeScript...${NC}"
if npx tsc --noEmit; then
    echo -e "${GREEN}✅ TypeScript سليم${NC}"
else
    echo -e "${YELLOW}⚠️ تحذيرات TypeScript موجودة، لكن سنتابع...${NC}"
fi

# Build project
echo ""
echo -e "${YELLOW}🔨 بناء المشروع...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ تم بناء المشروع بنجاح${NC}"
else
    echo -e "${RED}❌ خطأ في بناء المشروع${NC}"
    echo -e "${YELLOW}تحقق من الأخطاء أعلاه${NC}"
    exit 1
fi

# Success message
echo ""
echo -e "${GREEN}🎉 تم الإعداد بنجاح!${NC}"
echo ""
echo -e "${CYAN}📋 الخطوات التالية:${NC}"
echo -e "1. للتطوير: npm run dev"
echo -e "2. للنشر: ارفع مجلد 'out' إلى Netlify"
echo -e "3. أو اربط المشروع بـ GitHub ثم Netlify"

echo ""
echo -e "${CYAN}🔗 حسابات تجريبية:${NC}"
echo -e "${BLUE}طبيب: doctor@example.com / demo123${NC}"
echo -e "${BLUE}مدير: admin@example.com / admin123${NC}"
echo -e "${BLUE}مريض: patient1@example.com / patient123${NC}"

echo ""
echo -e "${CYAN}📚 ملفات مفيدة:${NC}"
echo -e "${BLUE}- README.md: دليل المشروع${NC}"
echo -e "${BLUE}- NETLIFY_DEPLOY_GUIDE.md: دليل النشر${NC}"

echo ""
echo "اضغط Enter للخروج..."
read
