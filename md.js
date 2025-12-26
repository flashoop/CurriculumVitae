const puppeteer = require('puppeteer');
const MarkdownIt = require('markdown-it');
const fs = require('fs');

async function convertToPdf() {
    // 1. 如果是 Markdown，先转成 HTML
    const md = new MarkdownIt();
    const markdownContent = fs.readFileSync('resume.md', 'utf-8');
    const htmlContent = md.render(markdownContent);

    // 2. 构造完整的 HTML 结构（加入样式）
    const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                h1 { color: #333; }
                /* 这里可以加入你的 CSS 样式 */
            </style>
        </head>
        <body>
            ${htmlContent}
        </body>
        </html>
    `;

    // 3. 启动 Puppeteer
    const browser = await puppeteer.launch({
        // 建议使用你之前成功下载的路径，避免路径报错
        executablePath: '/Users/leozhao/.cache/puppeteer/chrome/mac_arm-142.0.7444.175/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        headless: 'new'
    });

    const page = await browser.newPage();

    // 4. 加载 HTML 内容
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    // 5. 生成 PDF
    await page.pdf({
        path: 'output.pdf',
        format: 'A4',
        printBackground: true, // 保留背景颜色和图片
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
        }
    });

    await browser.close();
    console.log('PDF 生成成功！');
}

convertToPdf();
