'use client'

import { useLayoutEffect } from 'react'

const TARGET_ATTRIBUTES = new Set(['width', 'height'] as const)
type TargetAttribute = typeof TARGET_ATTRIBUTES extends Set<infer U>
  ? U
  : never

const REM_PATTERN = /^-?\d*\.?\d+rem$/i

const computeRootFontSize = () => {
  if (typeof window === 'undefined' || !document?.documentElement) {
    return 16
  }

  const rootSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize ?? '16'
  )

  return Number.isFinite(rootSize) && rootSize > 0 ? rootSize : 16
}

const normalizeDimensionValue = (value: string): string | null => {
  if (!REM_PATTERN.test(value)) return null

  const numeric = parseFloat(value)
  if (!Number.isFinite(numeric)) return null

  const pixels = numeric * computeRootFontSize()
  return Number.isFinite(pixels) ? `${pixels}px` : null
}

const normalizeSvg = (svg: SVGElement) => {
  TARGET_ATTRIBUTES.forEach((attribute) => {
    const currentValue = svg.getAttribute(attribute)
    if (!currentValue) return

    const normalized = normalizeDimensionValue(currentValue)
    if (!normalized) return

    svg.style.setProperty(attribute, normalized, 'important')
    svg.removeAttribute(attribute)
  })
}

const normalizeTree = (root: Element | DocumentFragment) => {
  if (root instanceof SVGElement) {
    normalizeSvg(root)
  }

  if ('querySelectorAll' in root) {
    root
      .querySelectorAll<SVGElement>('svg[width*="rem"], svg[height*="rem"]')
      .forEach(normalizeSvg)
  }
}

const patchSvgAttributeApi = () => {
  if (typeof window === 'undefined' || !(window as any).SVGElement) {
    return
  }

  const svgProto = SVGElement.prototype
  const originalSetAttribute = svgProto.setAttribute
  const originalSetAttributeNS = svgProto.setAttributeNS

  if ((svgProto as any).__remAttributePatched) {
    return
  }

  const applyNormalization = (name: string, value: string): string => {
    if (!TARGET_ATTRIBUTES.has(name as TargetAttribute)) {
      return value
    }

    const trimmed = value.trim()
    const normalized = normalizeDimensionValue(trimmed)
    return normalized ?? value
  }

  svgProto.setAttribute = function patchedSetAttribute(
    name: string,
    value: string
  ) {
    const normalizedValue = applyNormalization(name, value)
    return originalSetAttribute.call(this, name, normalizedValue as string)
  }

  svgProto.setAttributeNS = function patchedSetAttributeNS(
    namespace: string | null,
    name: string,
    value: string
  ) {
    const normalizedValue = applyNormalization(name, value)
    return originalSetAttributeNS.call(
      this,
      namespace,
      name,
      normalizedValue as string
    )
  }

  Object.defineProperty(svgProto, '__remAttributePatched', {
    value: true,
    enumerable: false,
    configurable: false,
  })
}

if (typeof window !== 'undefined') {
  patchSvgAttributeApi()
}

export const SvgAttributeFixer = () => {
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !document?.body) return

    normalizeTree(document.body)

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(({ addedNodes }) => {
        addedNodes.forEach((node) => {
          if (node instanceof Element || node instanceof DocumentFragment) {
            normalizeTree(node)
          }
        })
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}
