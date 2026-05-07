// 自動同步：每 5 秒檢查 GitHub 上有沒有新 commit，有就 git pull
// 配合 vite HMR + node --watch，前後端會自動載入新版程式
import { exec as execCb } from 'child_process';
import { promisify } from 'util';
const exec = promisify(execCb);

const INTERVAL_MS = 5000;

async function run(cmd) {
  try {
    const { stdout } = await exec(cmd);
    return stdout.trim();
  } catch (e) {
    return null;
  }
}

let lastRemoteHash = null;

async function tick() {
  await run('git fetch origin main --quiet');
  const remote = await run('git rev-parse origin/main');
  const local  = await run('git rev-parse HEAD');
  if (!remote || !local) return;
  if (remote !== local) {
    if (remote !== lastRemoteHash) {
      console.log(`↓ pulling new commit ${remote.slice(0, 7)}…`);
      const out = await run('git pull --ff-only origin main');
      if (out) console.log(out.split('\n').slice(0, 3).join('\n'));
      lastRemoteHash = remote;
    }
  }
}

console.log('Auto-sync watching origin/main every 5s');
setInterval(tick, INTERVAL_MS);
tick();
