/**
 * 🎨 Mermaid Architecture Diagram PNG Generator
 * 
 * Extracts all Mermaid diagrams from architecture.md
 * and generates high-quality PNG images.
 * 
 * Usage: node scripts/generate-architecture-pngs.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
    inputFile: path.resolve(__dirname, '../architecture.md'),
    outputDir: path.resolve(__dirname, '../architecture-diagrams'),
};

// Diagram name mapping
const DIAGRAM_NAMES = [
    'system-overview',
    'service-communication',
    'kafka-architecture',
    'rag-pipeline',
    'auth-flow',
    'payment-flow',
    'material-ingestion',
    'rag-query-flow',
    'data-models',
    'security-architecture',
    'deployment-architecture',
];

/**
 * Extract all Mermaid code blocks from markdown
 */
function extractMermaidDiagrams(markdown) {
    const regex = /```mermaid\n([\s\S]*?)```/g;
    const diagrams = [];
    let match;

    while ((match = regex.exec(markdown)) !== null) {
        diagrams.push(match[1].trim());
    }

    return diagrams;
}

function main() {
    console.log('');
    console.log('🎨 Mermaid Architecture Diagram PNG Generator');
    console.log('━'.repeat(50));

    // Setup
    if (!fs.existsSync(CONFIG.inputFile)) {
        console.error(`❌ File not found: ${CONFIG.inputFile}`);
        process.exit(1);
    }

    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }

    // Create mermaid config file
    const mermaidConfig = {
        theme: 'dark',
        themeVariables: {
            darkMode: true,
            background: '#0d1117',
            primaryColor: '#58a6ff',
            secondaryColor: '#238636',
            tertiaryColor: '#6e7681',
            primaryTextColor: '#c9d1d9',
            secondaryTextColor: '#8b949e',
            lineColor: '#30363d',
            fontSize: '14px'
        }
    };

    const configPath = path.join(CONFIG.outputDir, 'mermaid.config.json');
    fs.writeFileSync(configPath, JSON.stringify(mermaidConfig, null, 2));

    // Extract diagrams
    const markdown = fs.readFileSync(CONFIG.inputFile, 'utf8');
    const diagrams = extractMermaidDiagrams(markdown);

    console.log(`📊 Found ${diagrams.length} Mermaid diagrams\n`);

    let successCount = 0;

    for (let i = 0; i < diagrams.length; i++) {
        const name = DIAGRAM_NAMES[i] || `diagram-${i + 1}`;
        const mmdPath = path.join(CONFIG.outputDir, `${String(i + 1).padStart(2, '0')}-${name}.mmd`);
        const pngPath = path.join(CONFIG.outputDir, `${String(i + 1).padStart(2, '0')}-${name}.png`);

        console.log(`[${i + 1}/${diagrams.length}] ${name}`);

        try {
            // Write mermaid file
            fs.writeFileSync(mmdPath, diagrams[i], 'utf8');

            // Generate PNG
            const cmd = `npx mmdc -i "${mmdPath}" -o "${pngPath}" -c "${configPath}" -w 1920 -s 2 -b transparent`;
            execSync(cmd, {
                cwd: path.resolve(__dirname, '..'),
                stdio: 'pipe',
                timeout: 60000
            });

            console.log(`  ✅ Generated: ${path.basename(pngPath)}`);
            successCount++;

            // Cleanup mmd file
            fs.unlinkSync(mmdPath);
        } catch (error) {
            console.log(`  ❌ Failed: ${error.message.split('\n')[0]}`);
            if (fs.existsSync(mmdPath)) fs.unlinkSync(mmdPath);
        }
    }

    // Cleanup config
    if (fs.existsSync(configPath)) fs.unlinkSync(configPath);

    console.log('');
    console.log('━'.repeat(50));
    console.log(`✨ Generated ${successCount}/${diagrams.length} PNG files`);
    console.log(`📂 ${CONFIG.outputDir}`);

    const pngs = fs.readdirSync(CONFIG.outputDir).filter(f => f.endsWith('.png'));
    if (pngs.length > 0) {
        console.log('');
        console.log('📄 Files:');
        pngs.forEach(f => console.log(`   • ${f}`));
    }
}

main();
