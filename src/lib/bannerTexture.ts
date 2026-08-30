import {
  CanvasTexture,
  SRGBColorSpace,
  type CanvasTexture as BannerTex,
} from 'three'
import type { Brand, Mark } from '../types'

const cache = new Map<string, BannerTex>()

function drawMark(
  ctx: CanvasRenderingContext2D,
  mark: Mark,
  cx: number,
  cy: number,
  r: number,
  color: string,
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = Math.max(10, r * 0.14)
  ctx.lineCap = 'square'
  ctx.lineJoin = 'miter'

  switch (mark) {
    case 'bars': {
      ctx.fillRect(cx - r * 0.72, cy - r * 0.55, r * 0.28, r * 1.1)
      ctx.fillRect(cx - r * 0.14, cy - r * 0.35, r * 0.28, r * 0.9)
      ctx.fillRect(cx + r * 0.44, cy - r * 0.7, r * 0.28, r * 1.25)
      break
    }
    case 'ring': {
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.22, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'slash': {
      ctx.beginPath()
      ctx.moveTo(cx - r * 0.7, cy + r * 0.65)
      ctx.lineTo(cx + r * 0.7, cy - r * 0.65)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx - r * 0.25, cy + r * 0.7)
      ctx.lineTo(cx + r * 0.15, cy - r * 0.15)
      ctx.stroke()
      break
    }
    case 'tri': {
      ctx.beginPath()
      ctx.moveTo(cx, cy - r * 0.78)
      ctx.lineTo(cx + r * 0.72, cy + r * 0.58)
      ctx.lineTo(cx - r * 0.72, cy + r * 0.58)
      ctx.closePath()
      ctx.stroke()
      break
    }
    case 'grid': {
      for (let i = -1; i <= 1; i++) {
        ctx.fillRect(cx + i * r * 0.48 - r * 0.12, cy - r * 0.7, r * 0.24, r * 1.4)
        ctx.fillRect(cx - r * 0.7, cy + i * r * 0.48 - r * 0.12, r * 1.4, r * 0.24)
      }
      break
    }
    case 'dot': {
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.34, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2)
      ctx.stroke()
      break
    }
    case 'wave': {
      ctx.beginPath()
      ctx.moveTo(cx - r * 0.85, cy)
      ctx.quadraticCurveTo(cx - r * 0.4, cy - r * 0.7, cx, cy)
      ctx.quadraticCurveTo(cx + r * 0.4, cy + r * 0.7, cx + r * 0.85, cy)
      ctx.stroke()
      break
    }
    case 'cross': {
      ctx.beginPath()
      ctx.moveTo(cx - r * 0.7, cy)
      ctx.lineTo(cx + r * 0.7, cy)
      ctx.moveTo(cx, cy - r * 0.7)
      ctx.lineTo(cx, cy + r * 0.7)
      ctx.stroke()
      ctx.fillRect(cx - r * 0.16, cy - r * 0.16, r * 0.32, r * 0.32)
      break
    }
    case 'hex': {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6
        const x = cx + Math.cos(a) * r * 0.78
        const y = cy + Math.sin(a) * r * 0.78
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()
      break
    }
    case 'arc': {
      ctx.beginPath()
      ctx.arc(cx, cy + r * 0.15, r * 0.72, Math.PI * 1.05, Math.PI * 1.95)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(cx, cy + r * 0.15, r * 0.38, Math.PI * 1.1, Math.PI * 1.9)
      ctx.stroke()
      break
    }
  }
}

export function bannerTexture(brand: Brand, bid: number) {
  const key = `${brand.id}:${bid}`
  const hit = cache.get(key)
  if (hit) return hit

  const w = 512
  const h = 768
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d canvas unavailable')

  ctx.fillStyle = brand.secondary
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = brand.primary
  ctx.fillRect(0, 0, w, 22)
  ctx.fillRect(0, h - 22, w, 22)
  ctx.fillRect(0, 0, 22, h)
  ctx.fillRect(w - 22, 0, 22, h)

  ctx.globalAlpha = 0.14
  ctx.fillRect(40, 40, w - 80, h - 80)
  ctx.globalAlpha = 1

  drawMark(ctx, brand.mark, w / 2, 248, 124, brand.primary)

  ctx.fillStyle = brand.primary
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '700 88px "IBM Plex Mono", ui-monospace, monospace'
  ctx.fillText(brand.name, w / 2, 428)

  ctx.globalAlpha = 0.8
  ctx.font = '500 34px "IBM Plex Mono", ui-monospace, monospace'
  ctx.fillText(brand.glyph, w / 2, 492)
  ctx.globalAlpha = 1

  ctx.font = '600 84px "IBM Plex Mono", ui-monospace, monospace'
  ctx.fillText(`$${bid}`, w / 2, 628)

  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  cache.set(key, tex)
  return tex
}
