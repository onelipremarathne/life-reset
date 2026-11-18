const PAPER = "#fbf7e8";
const LINE = "#e5e0c8";
const INK = "#34402f";
const MUTED = "#6b705a";
const ACCENT = "#8d79b8";
const MARGIN = "#ecc4c4";

function wrap(ctx, text, maxWidth) {
  const lines = [];
  for (const para of text.split("\n")) {
    if (!para.trim()) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const word of para.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width <= maxWidth) {
        line = test;
        continue;
      }
      if (line) lines.push(line);
      let chunk = "";
      for (const ch of word) {
        if (ctx.measureText(chunk + ch).width > maxWidth) {
          lines.push(chunk);
          chunk = ch;
        } else chunk += ch;
      }
      line = chunk;
    }
    lines.push(line);
  }
  return lines;
}

export async function renderPaperImage(
  entry,
  { width = 340, height = 440, scale = 2 } = {},
) {
  await Promise.all([
    document.fonts.load('30px "Instrument Serif"'),
    document.fonts.load('600 10px "Instrument Sans"'),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, width, height);

  const padX = 32;
  const maxW = width - padX * 2;
  const label = '600 10px "Instrument Sans", sans-serif';
  const setSpacing = (v) => {
    if ("letterSpacing" in ctx) ctx.letterSpacing = v;
  };
  let y = 40;

  // Date
  const dateLabel = new Date(entry.date + "T00:00:00")
    .toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
  ctx.fillStyle = MUTED;
  ctx.font = label;
  setSpacing("1.2px");
  ctx.fillText(dateLabel, padX, y);
  setSpacing("0px");

  // Title
  y += 36;
  ctx.fillStyle = INK;
  ctx.font = '30px "Instrument Serif", Georgia, serif';
  for (const line of wrap(ctx, entry.title, maxW).slice(0, 2)) {
    ctx.fillText(line, padX, y);
    y += 34;
  }

  // Mood dots
  y -= 14;
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.arc(padX + 3 + i * 11, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = i < entry.mood ? ACCENT : LINE;
    ctx.fill();
  }
  ctx.fillStyle = MUTED;
  ctx.font = label;
  setSpacing("1px");
  ctx.fillText(`MOOD ${entry.mood}/10`, padX + 10 * 11 + 8, y + 3);
  setSpacing("0px");

  // Ruled lines + margin line
  const lineH = 25;
  const bodyTop = y + 22;
  const bottom = height - 26;
  ctx.strokeStyle = MARGIN;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padX - 12, bodyTop);
  ctx.lineTo(padX - 12, height);
  ctx.stroke();
  ctx.strokeStyle = LINE;
  for (let ry = bodyTop + lineH; ry <= bottom; ry += lineH) {
    ctx.beginPath();
    ctx.moveTo(16, ry + 0.5);
    ctx.lineTo(width - 16, ry + 0.5);
    ctx.stroke();
  }

  // Body text, sitting on the ruled lines
  ctx.fillStyle = INK;
  ctx.font = '18px "Instrument Serif", Georgia, serif';
  let lines = wrap(ctx, entry.entry, maxW);
  const maxLines = Math.max(1, Math.floor((bottom - bodyTop) / lineH));
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    let last = lines[maxLines - 1];
    while (last && ctx.measureText(last + "…").width > maxW)
      last = last.slice(0, -1);
    lines[maxLines - 1] = last.trimEnd() + "…";
  }
  lines.forEach((line, k) =>
    ctx.fillText(line, padX, bodyTop + (k + 1) * lineH - 7),
  );

  return canvas.toDataURL("image/png");
}
