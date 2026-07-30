export function modifyGame(currentCode: string, modification: string): string {
  const lower = modification.toLowerCase();
  let code = currentCode;

  // Speed modifications
  if (lower.includes('faster') || lower.includes('increase speed') || lower.includes('speed up')) {
    code = code.replace(/const speed = (\d+)/g, (match, val) => {
      return 'const speed = ' + Math.min(15, parseInt(val) + 2);
    });
    code = code.replace(/const pipeSpeed = ([\d.]+)/g, (match, val) => {
      return 'const pipeSpeed = ' + Math.min(10, parseFloat(val) + 1).toFixed(1);
    });
    code = code.replace(/const gameSpeed = (\d+)/g, (match, val) => {
      return 'const gameSpeed = ' + Math.max(40, parseInt(val) - 20);
    });
  }

  if (lower.includes('slower') || lower.includes('decrease speed') || lower.includes('slow down')) {
    code = code.replace(/const speed = (\d+)/g, (match, val) => {
      return 'const speed = ' + Math.max(1, parseInt(val) - 2);
    });
    code = code.replace(/const pipeSpeed = ([\d.]+)/g, (match, val) => {
      return 'const pipeSpeed = ' + Math.max(1, parseFloat(val) - 1).toFixed(1);
    });
    code = code.replace(/const gameSpeed = (\d+)/g, (match, val) => {
      return 'const gameSpeed = ' + Math.min(200, parseInt(val) + 20);
    });
  }

  // Color modifications
  const colorMap: Record<string, string> = {
    red: '#ff0000', blue: '#0066ff', green: '#00cc00', yellow: '#ffdd00',
    purple: '#9900cc', orange: '#ff6600', pink: '#ff66aa', white: '#ffffff',
    black: '#000000', cyan: '#00cccc', gold: '#ffd700', neon: '#00ff88',
  };

  for (const [name, hex] of Object.entries(colorMap)) {
    if (lower.includes(name + ' player') || lower.includes('player ' + name) || lower.includes('character ' + name)) {
      const playerColorRegex = new RegExp("ctx\\.fillStyle = '(#[0-9a-fA-F]{6})';\\s*\\n\\s*ctx\\.fillRect\\(player", 'g');
      code = code.replace(playerColorRegex, `ctx.fillStyle = '${hex}';\nctx.fillRect(player`);
    }
    if (lower.includes(name + ' background') || lower.includes('background ' + name)) {
      const bgColorRegex = new RegExp("ctx\\.fillStyle = '(#[0-9a-fA-F]{6})';\\s*\\n\\s*ctx\\.fillRect\\(0, 0", 'g');
      code = code.replace(bgColorRegex, `ctx.fillStyle = '${hex}';\nctx.fillRect(0, 0`);
    }
    if (lower.includes(name + ' enem') || lower.includes('enem' + name)) {
      const enemyColorRegex = new RegExp("ctx\\.fillStyle = '(#[0-9a-fA-F]{6})';\\s*\\n\\s*for \\(const (e|o)", 'g');
      code = code.replace(enemyColorRegex, (_match, _color, varName) => `ctx.fillStyle = '${hex}';\nfor (const ${varName}`);
    }
    // Generic color change
    if (lower === 'change color to ' + name || lower === 'make it ' + name || lower.includes('color ' + name)) {
      code = code.replace(/playerColor: '(#[0-9a-fA-F]{6})'/g, `playerColor: '${hex}'`);
    }
  }

  // Size modifications
  if (lower.includes('bigger') || lower.includes('larger') || lower.includes('increase size')) {
    code = code.replace(/const playerSize = (\d+)/g, (match, val) => {
      return 'const playerSize = ' + Math.min(60, parseInt(val) + 10);
    });
    code = code.replace(/const birdSize = ([\d.]+)/g, (match, val) => {
      return 'const birdSize = ' + Math.min(40, parseFloat(val) + 5).toFixed(1);
    });
    code = code.replace(/const playerW = (\d+)/g, (match, val) => {
      return 'const playerW = ' + Math.min(60, parseInt(val) + 10);
    });
  }

  if (lower.includes('smaller') || lower.includes('decrease size') || lower.includes('shrink')) {
    code = code.replace(/const playerSize = (\d+)/g, (match, val) => {
      return 'const playerSize = ' + Math.max(10, parseInt(val) - 10);
    });
    code = code.replace(/const birdSize = ([\d.]+)/g, (match, val) => {
      return 'const birdSize = ' + Math.max(8, parseFloat(val) - 5).toFixed(1);
    });
    code = code.replace(/const playerW = (\d+)/g, (match, val) => {
      return 'const playerW = ' + Math.max(15, parseInt(val) - 10);
    });
  }

  // Difficulty modifications
  if (lower.includes('harder') || lower.includes('more difficult') || lower.includes('more enemies') || lower.includes('increase difficulty')) {
    code = code.replace(/const spawnRate = (\d+)/g, (match, val) => {
      return 'const spawnRate = ' + Math.max(15, parseInt(val) - 10);
    });
    code = code.replace(/const pipeGap = (\d+)/g, (match, val) => {
      return 'const pipeGap = ' + Math.max(80, parseInt(val) - 20);
    });
    code = code.replace(/const brickRows = (\d+)/g, (match, val) => {
      return 'const brickRows = ' + Math.min(9, parseInt(val) + 1);
    });
  }

  if (lower.includes('easier') || lower.includes('less difficult') || lower.includes('fewer enemies') || lower.includes('decrease difficulty')) {
    code = code.replace(/const spawnRate = (\d+)/g, (match, val) => {
      return 'const spawnRate = ' + Math.min(100, parseInt(val) + 10);
    });
    code = code.replace(/const pipeGap = (\d+)/g, (match, val) => {
      return 'const pipeGap = ' + Math.min(220, parseInt(val) + 20);
    });
    code = code.replace(/const brickRows = (\d+)/g, (match, val) => {
      return 'const brickRows = ' + Math.max(2, parseInt(val) - 1);
    });
  }

  // Gravity modifications
  if (lower.includes('more gravity') || lower.includes('heavier') || lower.includes('fall faster')) {
    code = code.replace(/const gravity = ([\d.]+)/g, (match, val) => {
      return 'const gravity = ' + Math.min(1.5, parseFloat(val) + 0.2).toFixed(1);
    });
  }

  if (lower.includes('less gravity') || lower.includes('lighter') || lower.includes('float') || lower.includes('low gravity')) {
    code = code.replace(/const gravity = ([\d.]+)/g, (match, val) => {
      return 'const gravity = ' + Math.max(0.1, parseFloat(val) - 0.2).toFixed(1);
    });
  }

  // Jump modifications
  if (lower.includes('jump higher') || lower.includes('higher jump') || lower.includes('more jump')) {
    code = code.replace(/const jumpForce = -?(\d+)/g, (match, val) => {
      return 'const jumpForce = -' + Math.min(20, parseInt(val) + 3);
    });
    code = code.replace(/const flapForce = -?(\d+)/g, (match, val) => {
      return 'const flapForce = -' + Math.min(15, parseInt(val) + 2);
    });
  }

  // Canvas size modifications
  if (lower.includes('wider') || lower.includes('more width')) {
    code = code.replace(/canvas.width = (\d+)/g, (match, val) => {
      return 'canvas.width = ' + Math.min(1200, parseInt(val) + 100);
    });
  }
  if (lower.includes('taller') || lower.includes('more height')) {
    code = code.replace(/canvas.height = (\d+)/g, (match, val) => {
      return 'canvas.height = ' + Math.min(900, parseInt(val) + 100);
    });
  }

  return code;
}
