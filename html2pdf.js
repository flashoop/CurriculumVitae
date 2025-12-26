const puppeteer = require('puppeteer');
const path = require('path');

async function convert() {
    const browser = await puppeteer.launch({
        // 依然使用你之前确定的 macOS 路径
        executablePath: '/Users/leozhao/.cache/puppeteer/chrome/mac_arm-142.0.7444.175/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        headless: "new"
    });

    const page = await browser.newPage();

    // 获取 HTML 文件的绝对路径
    const filePath = 'file://' + path.resolve(__dirname, 'index.html'); // 替换为你的文件名

    // 加载本地 HTML
    await page.goto(filePath, { 
        waitUntil: 'networkidle0' // 关键：确保图片、字体等网络资源加载完毕
    });

    // 生成 PDF
    await page.pdf({
        path: 'output.pdf',
        format: 'A4',
        printBackground: true, // 必须开启，否则 CSS 背景、颜色会消失
        margin: {
            top: '10mm',
            right: '10mm',
            bottom: '10mm',
            left: '10mm'
        }
    });

    await browser.close();
    console.log('✅ PDF 已生成：output.pdf');
}

convert().catch(console.error);
