/**
 * Migrate Prompts Script
 * Tracks and migrates prompt versions
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface PromptVersion {
    version: string;
    hash: string;
    createdAt: string;
    description?: string;
}

interface PromptHistory {
    name: string;
    currentVersion: string;
    versions: PromptVersion[];
}

const PROMPTS_DIR = path.join(__dirname, '../packages/prompts/src');
const HISTORY_FILE = path.join(__dirname, '../.prompt-history.json');

function hashContent(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex').slice(0, 8);
}

function loadHistory(): Record<string, PromptHistory> {
    if (fs.existsSync(HISTORY_FILE)) {
        return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
    }
    return {};
}

function saveHistory(history: Record<string, PromptHistory>): void {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

function scanPrompts(): Record<string, string> {
    const prompts: Record<string, string> = {};

    function scanDir(dir: string, prefix: string = '') {
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                scanDir(fullPath, `${prefix}${item}/`);
            } else if (item.endsWith('.ts') && item !== 'index.ts') {
                const content = fs.readFileSync(fullPath, 'utf-8');
                const name = `${prefix}${item.replace('.ts', '')}`;
                prompts[name] = content;
            }
        }
    }

    scanDir(PROMPTS_DIR);
    return prompts;
}

async function main() {
    console.log('📝 Checking prompt versions...\n');

    const history = loadHistory();
    const currentPrompts = scanPrompts();

    let hasChanges = false;

    for (const [name, content] of Object.entries(currentPrompts)) {
        const hash = hashContent(content);

        if (!history[name]) {
            // New prompt
            console.log(`✨ New prompt: ${name}`);
            history[name] = {
                name,
                currentVersion: 'v1',
                versions: [{
                    version: 'v1',
                    hash,
                    createdAt: new Date().toISOString(),
                    description: 'Initial version',
                }],
            };
            hasChanges = true;
        } else {
            // Check if content changed
            const currentHash = history[name].versions.find(
                v => v.version === history[name].currentVersion
            )?.hash;

            if (currentHash !== hash) {
                // Content changed
                const newVersion = `v${history[name].versions.length + 1}`;
                console.log(`📝 Updated prompt: ${name} (${history[name].currentVersion} → ${newVersion})`);

                history[name].versions.push({
                    version: newVersion,
                    hash,
                    createdAt: new Date().toISOString(),
                });
                history[name].currentVersion = newVersion;
                hasChanges = true;
            } else {
                console.log(`✅ Unchanged: ${name} (${history[name].currentVersion})`);
            }
        }
    }

    if (hasChanges) {
        saveHistory(history);
        console.log('\n💾 History saved to .prompt-history.json');
    } else {
        console.log('\n✅ No changes detected');
    }

    // Summary
    console.log('\n📊 Prompt Summary:');
    console.log('─'.repeat(50));

    for (const [name, info] of Object.entries(history)) {
        console.log(`  ${name}: ${info.currentVersion} (${info.versions.length} version(s))`);
    }
}

main().catch(console.error);
