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

export async function renderPaperPages(
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

  const padX = 32;
  const maxW = width - padX * 2;
  const lineH = 25;
  const labelFont = '600 10px "Instrument Sans", sans-serif';
  const titleFont = '30px "Instrument Serif", Georgia, serif';
  const bodyFont = '18px "Instrument Serif", Georgia, serif';
  const setSpacing = (v) => {
    if ("letterSpacing" in ctx) ctx.letterSpacing = v;
  };

  // Layout is identical on every page
  ctx.font = titleFont;
  const titleLines = wrap(ctx, entry.title, maxW).slice(0, 2);
  const moodY = 76 + titleLines.length * 34 - 14;
  const bodyTop = moodY + 22;
  const bottom = height - 30;
  const maxLines = Math.max(1, Math.floor((bottom - bodyTop) / lineH));

  // Split the full entry into pages
  ctx.font = bodyFont;
  const allLines = wrap(ctx, entry.entry, maxW);
  const chunks = [];
  for (let i = 0; i < allLines.length; i += maxLines) {
    const chunk = allLines.slice(i, i + maxLines);
    if (i > 0) while (chunk[0] === "") chunk.shift(); // no blank line at top of a page
    chunks.push(chunk);
  }
  if (chunks.length === 0) chunks.push([]);

  const dateLabel = new Date(entry.date + "T00:00:00")
    .toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();

  return chunks.map((lines, index) => {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, width, height);

    // Date
    ctx.fillStyle = MUTED;
    ctx.font = labelFont;
    setSpacing("1.2px");
    ctx.fillText(dateLabel, padX, 40);
    setSpacing("0px");

    // Title
    ctx.fillStyle = INK;
    ctx.font = titleFont;
    titleLines.forEach((line, k) => ctx.fillText(line, padX, 76 + k * 34));

    // Mood dots
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.arc(padX + 3 + i * 11, moodY, 3, 0, Math.PI * 2);
      ctx.fillStyle = i < entry.mood ? ACCENT : LINE;
      ctx.fill();
    }
    ctx.fillStyle = MUTED;
    ctx.font = labelFont;
    setSpacing("1px");
    ctx.fillText(`MOOD ${entry.mood}/10`, padX + 10 * 11 + 8, moodY + 3);
    setSpacing("0px");

    // Margin + ruled lines
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

    // Body
    ctx.fillStyle = INK;
    ctx.font = bodyFont;
    lines.forEach((line, k) =>
      ctx.fillText(line, padX, bodyTop + (k + 1) * lineH - 7),
    );

    // Page number
    if (chunks.length > 1) {
      ctx.fillStyle = MUTED;
      ctx.font = labelFont;
      ctx.textAlign = "right";
      setSpacing("1px");
      ctx.fillText(`${index + 1} / ${chunks.length}`, width - 20, height - 10);
      setSpacing("0px");
      ctx.textAlign = "left";
    }

    return canvas.toDataURL("image/png");
  });
}
